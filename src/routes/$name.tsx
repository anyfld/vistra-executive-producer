import { useState, useCallback, useEffect, useRef } from "react"
import { useMutation, useQuery } from "@connectrpc/connect-query"
import { useParams, useNavigate } from "react-router-dom"
import { Box, Typography, Button, IconButton, Paper, Chip, alpha } from "@mui/material"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward"
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward"
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew"
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos"
import ZoomInIcon from "@mui/icons-material/ZoomIn"
import ZoomOutIcon from "@mui/icons-material/ZoomOut"
import VideocamIcon from "@mui/icons-material/Videocam"
import SettingsIcon from "@mui/icons-material/Settings"
import SpeedIcon from "@mui/icons-material/Speed"
import type { Mode } from "@/types/camera"
import { colors } from "@/theme"
import WebRTCPlayer from "@/components/WebRTCPlayer"
import { FDService } from "@/gen/proto/v1/fd_service_pb"
import { ControlCommandType } from "@/gen/proto/v1/fd_service_pb"
import type { PTZParameters } from "@/gen/proto/v1/cinematography_pb"
import { getCamera } from "@/gen/proto/v1/cd_service-CameraService_connectquery"
import { listAllCameras } from "@/gen/proto/v1/cr_service-CRService_connectquery"
import { CameraStatus } from "@/gen/proto/v1/cr_service_pb"

// メトリクス型
type MetricData = {
  label: string
  latency: string
  jitter: string
  packetLoss: string
  videoFrame: string
}

// メトリクスカードコンポーネント
function MetricCard({ metric, index }: { metric: MetricData; index: number }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
        backgroundColor: alpha(colors.background.paper, 0.6),
        backdropFilter: "blur(10px)",
        border: `1px solid ${alpha("#fff", 0.06)}`,
        transition: "all 0.3s ease",
        "&:hover": {
          borderColor: alpha(colors.primary.main, 0.3),
          backgroundColor: alpha(colors.primary.main, 0.05),
        },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
        <SpeedIcon sx={{ fontSize: 18, color: colors.primary.main }} />
        <Typography variant="body2" sx={{ fontWeight: 600, color: colors.text.primary }}>
          {metric.label}
        </Typography>
        <Chip
          label={`#${index + 1}`}
          size="small"
          sx={{
            ml: "auto",
            height: 20,
            fontSize: "0.65rem",
            backgroundColor: alpha(colors.primary.main, 0.15),
            color: colors.primary.light,
          }}
        />
      </Box>
      <MetricRow label="Latency" value={metric.latency} />
      <MetricRow label="Jitter" value={metric.jitter} />
      <MetricRow
        label="Packet Loss"
        value={metric.packetLoss}
        isGood={metric.packetLoss === "0%"}
      />
      <MetricRow label="Video Frame" value={metric.videoFrame} />
    </Paper>
  )
}

// メトリクス行コンポーネント
function MetricRow({ label, value, isGood }: { label: string; value: string; isGood?: boolean }) {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography
        variant="caption"
        sx={{
          fontWeight: 500,
          fontFamily: "monospace",
          color: isGood ? colors.success.light : colors.text.primary,
        }}
      >
        {value}
      </Typography>
    </Box>
  )
}

// コントロールボタンコンポーネント
function ControlButton({
  icon,
  label,
  onClick,
  onPressStart,
  onPressEnd,
  disabled,
}: {
  icon: React.ReactNode
  label: string
  onClick?: () => void
  onPressStart?: () => void
  onPressEnd?: () => void
  disabled?: boolean
}) {
  return (
    <IconButton
      color="primary"
      size="medium"
      onClick={onClick}
      onPointerDown={(e) => {
        // 長押し中のコンテキストメニューやテキスト選択を抑止
        e.preventDefault()
        ;(e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId)
        onPressStart?.()
      }}
      onPointerUp={(e) => {
        e.preventDefault()
        onPressEnd?.()
      }}
      onPointerCancel={() => {
        onPressEnd?.()
      }}
      onContextMenu={(e) => e.preventDefault()}
      disabled={disabled}
      sx={{
        backgroundColor: alpha(colors.primary.main, 0.1),
        border: `1px solid ${alpha(colors.primary.main, 0.2)}`,
        width: 44,
        height: 44,
        "&:hover": {
          backgroundColor: alpha(colors.primary.main, 0.2),
          borderColor: colors.primary.main,
          transform: "scale(1.05)",
        },
        transition: "all 0.2s ease",
      }}
      aria-label={label}
    >
      {icon}
    </IconButton>
  )
}

export default function CameraPage() {
  const { cameraId: cameraIdParam } = useParams<{ cameraId: string }>()
  const navigate = useNavigate()
  const [mode] = useState<Mode>("Autonomous")

  const { mutateAsync: sendCommand, isPending: sending } = useMutation(
    FDService.method.streamControlCommands
  )

  const cameraId = cameraIdParam ?? ""
  const { data: cameraData } = useQuery(getCamera, { cameraId }, { enabled: Boolean(cameraId) })
  const cameraName = (cameraData?.camera?.name ?? cameraId) || "camera"
  const webrtcConnectionName = cameraData?.camera?.webrtcConnectionName || ""
  const streamName = webrtcConnectionName || cameraName

  // CRService の ListAllCameras から STREAMING 状態のカメラを取得し、不一致時に自動修正
  const { data: streamingList } = useQuery(listAllCameras, {
    masterMfId: "",
    modeFilter: [],
    statusFilter: [CameraStatus.STREAMING],
    pageSize: 100,
    pageToken: "",
  })
  useEffect(() => {
    const shouldAutoFix = typeof window !== "undefined" && import.meta.env.MODE !== "test"
    if (!shouldAutoFix) return
    const ids = new Set((streamingList?.cameras ?? []).map((c) => c.id))
    if (ids.size === 0) return
    if (!cameraIdParam || !ids.has(cameraIdParam)) {
      const target = streamingList?.cameras?.[0]?.id
      if (target) {
        navigate(`/${target}`, { replace: true })
      }
    }
  }, [cameraIdParam, streamingList, navigate])

  const genId = () => globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2)

  // 長押し用のインターバルRef
  const longPressIntervalRef = useRef<number | null>(null)

  // ローカルPTZ状態（絶対値）。サーバーの能力が不明なため、デフォルトレンジに合わせてクランプ。
  const [, setPTZ] = useState<Pick<PTZParameters, "pan" | "tilt" | "zoom">>({
    pan: 0,
    tilt: 0,
    zoom: 1, // サンプルのデフォルトZoomMinが1.0
  })

  const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max)

  // 画面外で指が離れた場合でも確実に停止
  useEffect(() => {
    const stop = () => {
      if (longPressIntervalRef.current) {
        clearInterval(longPressIntervalRef.current)
        longPressIntervalRef.current = null
      }
    }
    window.addEventListener("pointerup", stop)
    window.addEventListener("pointercancel", stop)
    return () => {
      window.removeEventListener("pointerup", stop)
      window.removeEventListener("pointercancel", stop)
    }
  }, [])

  // 指定ターゲット（絶対値）をサーバへ送信（ローカル状態は変更しない）
  const sendPTZAbsoluteTarget = useCallback(
    (target: {
      pan: number
      tilt: number
      zoom: number
      panSpeed: number
      tiltSpeed: number
      zoomSpeed: number
    }) => {
      if (!cameraId) return
      const command = {
        commandId: genId(),
        cameraId,
        type: ControlCommandType.PTZ_ABSOLUTE,
        ptzParameters: target as unknown as PTZParameters,
        presetNumber: 0,
        focusValue: 0,
        timeoutMs: 5000,
      }
      ;(async () => {
        try {
          await sendCommand({
            message: {
              case: "command",
              value: command,
            },
          })
        } catch (e) {
          console.error("Failed to send PTZ absolute", e)
        }
      })()
    },
    [cameraId, sendCommand]
  )
  // 増分制御のステップとレンジ
  const PAN_STEP = 10 // degrees
  const TILT_STEP = 5 // degrees
  const ZOOM_STEP = 0.5 // zoom units
  const RANGE = {
    panMin: -180,
    panMax: 180,
    tiltMin: -45,
    tiltMax: 45,
    zoomMin: 1,
    zoomMax: 5,
  }

  const nudgePan = useCallback(
    (dir: 1 | -1) => {
      setPTZ((prev) => {
        const nextPan = clamp(prev.pan + dir * PAN_STEP, RANGE.panMin, RANGE.panMax)
        const target = {
          pan: nextPan,
          tilt: prev.tilt,
          zoom: prev.zoom,
          panSpeed: 0.6,
          tiltSpeed: 0.5,
          zoomSpeed: 0.5,
        }
        sendPTZAbsoluteTarget(target)
        return { pan: nextPan, tilt: prev.tilt, zoom: prev.zoom }
      })
    },
    [sendPTZAbsoluteTarget]
  )

  const nudgeTilt = useCallback(
    (dir: 1 | -1) => {
      setPTZ((prev) => {
        const nextTilt = clamp(prev.tilt + dir * TILT_STEP, RANGE.tiltMin, RANGE.tiltMax)
        const target = {
          pan: prev.pan,
          tilt: nextTilt,
          zoom: prev.zoom,
          panSpeed: 0.5,
          tiltSpeed: 0.6,
          zoomSpeed: 0.5,
        }
        sendPTZAbsoluteTarget(target)
        return { pan: prev.pan, tilt: nextTilt, zoom: prev.zoom }
      })
    },
    [sendPTZAbsoluteTarget]
  )

  const nudgeZoom = useCallback(
    (dir: 1 | -1) => {
      setPTZ((prev) => {
        const nextZoom = clamp(prev.zoom + dir * ZOOM_STEP, RANGE.zoomMin, RANGE.zoomMax)
        const target = {
          pan: prev.pan,
          tilt: prev.tilt,
          zoom: nextZoom,
          panSpeed: 0.5,
          tiltSpeed: 0.5,
          zoomSpeed: 0.6,
        }
        sendPTZAbsoluteTarget(target)
        return { pan: prev.pan, tilt: prev.tilt, zoom: nextZoom }
      })
    },
    [sendPTZAbsoluteTarget]
  )

  // 長押し用ハンドラー生成関数
  const createLongPressHandlers = (nudgeFunc: (dir: 1 | -1) => void, dir: 1 | -1) => ({
    onPressStart: () => {
      if (longPressIntervalRef.current) {
        clearInterval(longPressIntervalRef.current)
        longPressIntervalRef.current = null
      }
      // 最初の操作は即座、その後200ms間隔で繰り返す
      nudgeFunc(dir)
      longPressIntervalRef.current = window.setInterval(() => {
        nudgeFunc(dir)
      }, 200)
    },
    onPressEnd: () => {
      if (longPressIntervalRef.current) {
        clearInterval(longPressIntervalRef.current)
        longPressIntervalRef.current = null
      }
    },
  })

  const handleBack = () => {
    navigate("/")
  }

  // メトリクスデータ（サンプル）
  const metrics: MetricData[] = [
    {
      label: "EP <-> MD",
      latency: "10ms",
      jitter: "5ms",
      packetLoss: "0%",
      videoFrame: "60fps",
    },
    {
      label: "EP <-> MD",
      latency: "10ms",
      jitter: "5ms",
      packetLoss: "0%",
      videoFrame: "60fps",
    },
    {
      label: "EP <-> MD",
      latency: "10ms",
      jitter: "5ms",
      packetLoss: "0%",
      videoFrame: "60fps",
    },
    {
      label: "EP <-> MD",
      latency: "10ms",
      jitter: "5ms",
      packetLoss: "0%",
      videoFrame: "60fps",
    },
  ]

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        p: { xs: 2, md: 3 },
        display: "flex",
        flexDirection: "column",
        gap: 3,
        background: `radial-gradient(ellipse at top left, ${alpha(colors.primary.main, 0.05)} 0%, transparent 50%)`,
      }}
    >
      {/* ヘッダー */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        {/* 戻るボタン */}
        <Button
          variant="outlined"
          color="primary"
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{
            borderWidth: 2,
            px: 2.5,
            "&:hover": {
              borderWidth: 2,
            },
          }}
        >
          Dashboard
        </Button>

        {/* カメラ情報 */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <VideocamIcon sx={{ color: colors.primary.main, fontSize: 28 }} />
            <Box>
              <Typography
                variant="h5"
                component="h1"
                sx={{
                  fontWeight: 700,
                  background: `linear-gradient(135deg, ${colors.primary.light} 0%, ${colors.primary.main} 100%)`,
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  lineHeight: 1.2,
                }}
              >
                {cameraName}
              </Typography>
            </Box>
          </Box>

          {/* モードチップ */}
          <Chip
            icon={<SettingsIcon sx={{ fontSize: 16 }} />}
            label={mode}
            sx={{
              backgroundColor:
                mode === "Autonomous"
                  ? alpha(colors.success.main, 0.15)
                  : alpha(colors.warning.main, 0.15),
              color: mode === "Autonomous" ? colors.success.light : colors.warning.light,
              border: `1px solid ${mode === "Autonomous" ? alpha(colors.success.main, 0.3) : alpha(colors.warning.main, 0.3)}`,
              fontWeight: 600,
              "& .MuiChip-icon": {
                color: "inherit",
              },
            }}
          />
        </Box>
      </Box>

      {/* メインコンテンツ */}
      <Box
        sx={{
          display: "flex",
          gap: 3,
          flexDirection: { xs: "column", lg: "row" },
        }}
      >
        {/* 映像エリア */}
        <Paper
          elevation={2}
          sx={{
            flex: 1,
            aspectRatio: "16/9",
            backgroundColor: "#000",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 3,
            overflow: "hidden",
            position: "relative",
          }}
        >
          <WebRTCPlayer name={streamName} />

          {/* LIVE バッジ */}
          <Box
            sx={{
              position: "absolute",
              top: 16,
              left: 16,
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              px: 1.5,
              py: 0.5,
              borderRadius: 1,
              backgroundColor: alpha(colors.error.main, 0.9),
            }}
          >
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: "#fff",
                animation: "pulse 1.5s infinite",
                "@keyframes pulse": {
                  "0%, 100%": { opacity: 1 },
                  "50%": { opacity: 0.5 },
                },
              }}
            />
            <Typography
              variant="caption"
              sx={{
                fontWeight: 700,
                color: "#fff",
                fontSize: "0.7rem",
                letterSpacing: "0.05em",
              }}
            >
              LIVE
            </Typography>
          </Box>
        </Paper>

        {/* コントロールパネル */}
        <Paper
          elevation={2}
          sx={{
            p: 3,
            borderRadius: 3,
            width: { xs: "100%", lg: 280 },
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 600,
              color: colors.text.secondary,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              fontSize: "0.7rem",
            }}
          >
            Camera Controls
          </Typography>

          {/* PTZ コントロール */}
          <Box>
            <Typography
              variant="caption"
              sx={{
                color: colors.text.secondary,
                mb: 1.5,
                display: "block",
              }}
            >
              Pan / Tilt
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 44px)",
                gridTemplateRows: "repeat(3, 44px)",
                gap: 1,
                justifyContent: "center",
              }}
            >
              <Box />
              <ControlButton
                icon={<ArrowUpwardIcon />}
                label="視野を上に移動"
                {...createLongPressHandlers(nudgeTilt, +1)}
                disabled={sending}
              />
              <Box />
              <ControlButton
                icon={<ArrowBackIosNewIcon />}
                label="視野を左に移動"
                {...createLongPressHandlers(nudgePan, -1)}
                disabled={sending}
              />
              <Box />
              <ControlButton
                icon={<ArrowForwardIosIcon />}
                label="視野を右に移動"
                {...createLongPressHandlers(nudgePan, +1)}
                disabled={sending}
              />
              <Box />
              <ControlButton
                icon={<ArrowDownwardIcon />}
                label="視野を下に移動"
                {...createLongPressHandlers(nudgeTilt, -1)}
                disabled={sending}
              />
              <Box />
            </Box>
          </Box>

          {/* ズームコントロール */}
          <Box>
            <Typography
              variant="caption"
              sx={{
                color: colors.text.secondary,
                mb: 1.5,
                display: "block",
              }}
            >
              Zoom
            </Typography>
            <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
              <ControlButton
                icon={<ZoomInIcon />}
                label="ズームイン"
                {...createLongPressHandlers(nudgeZoom, +1)}
                disabled={sending}
              />
              <ControlButton
                icon={<ZoomOutIcon />}
                label="ズームアウト"
                {...createLongPressHandlers(nudgeZoom, -1)}
                disabled={sending}
              />
            </Box>
          </Box>

          {/* アームコントロール */}
          <Box>
            <Typography
              variant="caption"
              sx={{
                color: colors.text.secondary,
                mb: 1.5,
                display: "block",
              }}
            >
              Arm Control
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              <Button
                variant="contained"
                fullWidth
                startIcon={<ArrowUpwardIcon />}
                aria-label="アームを上方向（UP）に操作"
                sx={{
                  background: `linear-gradient(135deg, ${colors.secondary.main} 0%, ${colors.secondary.dark} 100%)`,
                  boxShadow: `0 4px 14px ${alpha(colors.secondary.main, 0.4)}`,
                  "&:hover": {
                    background: `linear-gradient(135deg, ${colors.secondary.light} 0%, ${colors.secondary.main} 100%)`,
                  },
                }}
              >
                UP
              </Button>
              <Button
                variant="contained"
                fullWidth
                startIcon={<ArrowDownwardIcon />}
                aria-label="アームを下方向（DOWN）に操作"
                sx={{
                  background: `linear-gradient(135deg, ${colors.secondary.main} 0%, ${colors.secondary.dark} 100%)`,
                  boxShadow: `0 4px 14px ${alpha(colors.secondary.main, 0.4)}`,
                  "&:hover": {
                    background: `linear-gradient(135deg, ${colors.secondary.light} 0%, ${colors.secondary.main} 100%)`,
                  },
                }}
              >
                DOWN
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* メトリクス */}
      <Box>
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 600,
            color: colors.text.secondary,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            fontSize: "0.7rem",
            mb: 2,
          }}
        >
          Connection Metrics
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              lg: "repeat(4, 1fr)",
            },
            gap: 2,
          }}
        >
          {metrics.map((metric, index) => (
            <MetricCard key={index} metric={metric} index={index} />
          ))}
        </Box>
      </Box>
    </Box>
  )
}
