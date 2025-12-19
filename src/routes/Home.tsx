import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Box, Typography, Paper, CircularProgress, Alert, Button, Chip, alpha } from "@mui/material"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import ErrorIcon from "@mui/icons-material/Error"
import GridViewIcon from "@mui/icons-material/GridView"
import VideocamIcon from "@mui/icons-material/Videocam"
import type { Camera } from "@/types/camera"
import { colors } from "@/theme"
import { getStreams } from "@/lib/streams"
import WebRTCPlayer from "@/components/WebRTCPlayer"

// ページヘッダーコンポーネント
function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string
  subtitle?: string
  action?: React.ReactNode
}) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        mb: 4,
        gap: 3,
        flexWrap: "wrap",
      }}
    >
      <Box>
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 700,
            background: `linear-gradient(135deg, ${colors.primary.light} 0%, ${colors.primary.main} 100%)`,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            mb: 0.5,
          }}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </Box>
      {action}
    </Box>
  )
}

// カメラカードコンポーネント
function CameraCard({ camera }: { camera: Camera }) {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(`/${camera.name}`)
  }

  const isOnline = camera.connection === "Reachable"

  return (
    <Paper
      elevation={2}
      onClick={handleClick}
      sx={{
        p: 0,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
        overflow: "hidden",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          transform: "translateY(-4px)",
          borderColor: alpha(colors.primary.main, 0.4),
          boxShadow: `0 12px 40px ${alpha(colors.primary.main, 0.2)}`,
          "& .camera-overlay": {
            opacity: 1,
          },
        },
      }}
    >
      {/* サムネイル */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          aspectRatio: "16/9",
          backgroundColor: colors.background.default,
          overflow: "hidden",
        }}
      >
        <WebRTCPlayer name={camera.name} />

        {/* オーバーレイ */}
        <Box
          className="camera-overlay"
          sx={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(180deg, transparent 50%, ${alpha("#000", 0.8)} 100%)`,
            opacity: 0.7,
            transition: "opacity 0.3s ease",
            pointerEvents: "none",
          }}
        />

        {/* ステータスバッジ */}
        <Chip
          icon={
            isOnline ? (
              <CheckCircleIcon sx={{ fontSize: 14 }} />
            ) : (
              <ErrorIcon sx={{ fontSize: 14 }} />
            )
          }
          label={isOnline ? "Online" : "Offline"}
          size="small"
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            backgroundColor: isOnline
              ? alpha(colors.success.main, 0.2)
              : alpha(colors.error.main, 0.2),
            color: isOnline ? colors.success.light : colors.error.light,
            border: `1px solid ${isOnline ? alpha(colors.success.main, 0.4) : alpha(colors.error.main, 0.4)}`,
            fontWeight: 600,
            fontSize: "0.7rem",
            "& .MuiChip-icon": {
              color: "inherit",
            },
          }}
        />

        {/* カメラ名 */}
        <Box
          sx={{
            position: "absolute",
            bottom: 12,
            left: 12,
            right: 12,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <VideocamIcon sx={{ fontSize: 18, color: colors.primary.main }} />
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                color: "#fff",
                textShadow: "0 2px 4px rgba(0,0,0,0.5)",
              }}
            >
              {camera.name}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* カメラ情報 */}
      <Box sx={{ p: 2, flexGrow: 1 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          <InfoRow label="Type" value={camera.type} />
          <InfoRow label="Mode" value={camera.mode} highlight />
        </Box>
      </Box>
    </Paper>
  )
}

// 情報行コンポーネント
function InfoRow({
  label,
  value,
  highlight,
}: {
  label: string
  value: string
  highlight?: boolean
}) {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.8rem" }}>
        {label}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          fontWeight: 500,
          fontSize: "0.8rem",
          color: highlight ? colors.primary.light : "text.primary",
        }}
      >
        {value}
      </Typography>
    </Box>
  )
}

export default function Home() {
  const [cameras, setCameras] = useState<Camera[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const handleGoToMonitor = () => {
    navigate("/monitor")
  }

  useEffect(() => {
    const loadStreams = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const streams = await getStreams()
        setCameras(streams)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load streams")
      } finally {
        setIsLoading(false)
      }
    }

    loadStreams()
  }, [])

  const onlineCameras = cameras.filter((c) => c.connection === "Reachable").length

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        p: { xs: 2, md: 4 },
        background: `radial-gradient(ellipse at top, ${alpha(colors.primary.main, 0.05)} 0%, transparent 50%)`,
      }}
    >
      <PageHeader
        title="Camera Dashboard"
        subtitle={
          cameras.length > 0
            ? `${onlineCameras} of ${cameras.length} cameras online`
            : "カメラを読み込み中..."
        }
        action={
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<GridViewIcon />}
            onClick={handleGoToMonitor}
            sx={{
              px: 4,
              py: 1.5,
              fontSize: "1rem",
            }}
          >
            Monitor View
          </Button>
        }
      />

      {isLoading && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            py: 8,
            gap: 2,
          }}
        >
          <CircularProgress size={48} />
          <Typography variant="body2" color="text.secondary">
            カメラを読み込み中...
          </Typography>
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {!isLoading && !error && cameras.length === 0 && (
        <Alert severity="info">利用可能なストリームがありません</Alert>
      )}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            lg: "repeat(3, 1fr)",
          },
          gap: 3,
        }}
      >
        {cameras.map((camera) => (
          <CameraCard key={camera.name} camera={camera} />
        ))}
      </Box>
    </Box>
  )
}
