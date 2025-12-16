import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Box, Typography, Button, IconButton, Paper } from "@mui/material"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward"
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward"
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew"
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos"
import ZoomInIcon from "@mui/icons-material/ZoomIn"
import ZoomOutIcon from "@mui/icons-material/ZoomOut"
import { sampleCameras, type Mode } from "./sampleCameras"
import { theme } from "@/theme"

export default function HashPage() {
  const { hash } = useParams<{ hash: string }>()
  const navigate = useNavigate()

  // hashから該当するcameraを検索
  const camera = sampleCameras.find((cam) => cam.hash === hash)
  const [mode, setMode] = useState<Mode>(camera?.mode ?? "Autonomous")

  if (!camera) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" color="error">
          Camera not found for hash: {hash}
        </Typography>
      </Box>
    )
  }

  const handleChangeMode = () => {
    setMode((prevMode: Mode) => {
      const nextMode = prevMode === "Autonomous" ? "LightWeight" : "Autonomous"
      return nextMode
    })
  }

  const handleBack = () => {
    navigate("/")
  }

  // メトリクスデータ（サンプル）
  const metrics: {
    label: string
    latency: string
    jitter: string
    packetLoss: string
    videoFrame: string
  }[] = [
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
        p: 3,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* 上部: ID, Modeとボタン */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 3,
        }}
      >
        <IconButton
          onClick={handleBack}
          sx={{
            bgcolor: theme.palette.grey[200],
            "&:hover": {
              bgcolor: theme.palette.grey[300],
            },
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        {/* 左上: IDとMode */}
        <Box>
          <Typography variant="h6" component="div">
            ID: {String(camera.id).padStart(4, "0")}
          </Typography>
          <Typography variant="h6" component="div">
            Mode: {mode}
          </Typography>
        </Box>

        {/* 右上: Change Modeボタンと戻るボタン */}
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <Button variant="contained" onClick={handleChangeMode}>
            Change Mode
          </Button>
        </Box>
      </Box>

      {/* 中央コンテンツエリア */}
      <Box
        sx={{
          display: "flex",
          gap: 3,
          alignItems: "center",
          mb: 3,
        }}
      >
        {/* 左側: 大きな映像エリア（16:9 を維持） */}
        <Paper
          elevation={2}
          sx={{
            aspectRatio: "16/9",
            width: "100%",
            maxWidth: "100%",
            bgcolor: theme.palette.grey[200],
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 1,
            overflow: "hidden",
          }}
        >
          {camera.thumbnail ? (
            <Box
              component="img"
              src={camera.thumbnail}
              alt={`Camera ${camera.id} video`}
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          ) : (
            <Typography variant="body2" color="text.secondary">
              Video Stream
            </Typography>
          )}
        </Paper>

        {/* 右側: 十字キー、UP/DOWNボタンが並んだコントローラー */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
            width: "260px",
            alignSelf: "center",
          }}
        >
          <Paper
            elevation={2}
            sx={{
              p: 2,
              bgcolor: theme.palette.grey[100],
              borderRadius: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                gap: 3,
                justifyContent: "space-between",
                alignItems: "stretch",
              }}
            >
              {/* 左カラム: 上に十字キー, 下にズーム */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                {/* 十字キー（左上） */}
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 40px)",
                    gridTemplateRows: "repeat(3, 40px)",
                    gap: 1,
                    alignItems: "center",
                    justifyItems: "center",
                  }}
                >
                  {/* 上 */}
                  <Box />
                  <IconButton
                    color="primary"
                    size="small"
                    sx={{
                      bgcolor: theme.palette.grey[200],
                      "&:hover": { bgcolor: theme.palette.grey[300] },
                    }}
                    aria-label="視野を上に移動"
                  >
                    <ArrowUpwardIcon fontSize="small" />
                  </IconButton>
                  <Box />

                  {/* 左・中央・右 */}
                  <IconButton
                    color="primary"
                    size="small"
                    sx={{
                      bgcolor: theme.palette.grey[200],
                      "&:hover": { bgcolor: theme.palette.grey[300] },
                    }}
                    aria-label="視野を左に移動"
                  >
                    <ArrowBackIosNewIcon fontSize="small" />
                  </IconButton>
                  <Box />
                  <IconButton
                    color="primary"
                    size="small"
                    sx={{
                      bgcolor: theme.palette.grey[200],
                      "&:hover": { bgcolor: theme.palette.grey[300] },
                    }}
                    aria-label="視野を右に移動"
                  >
                    <ArrowForwardIosIcon fontSize="small" />
                  </IconButton>

                  {/* 下 */}
                  <Box />
                  <IconButton
                    color="primary"
                    size="small"
                    sx={{
                      bgcolor: theme.palette.grey[200],
                      "&:hover": { bgcolor: theme.palette.grey[300] },
                    }}
                    aria-label="視野を下に移動"
                  >
                    <ArrowDownwardIcon fontSize="small" />
                  </IconButton>
                  <Box />
                </Box>

                {/* Zoomボタン（左下・横並び） */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 4,
                    alignItems: "center",
                    justifyContent: "center",
                    mt: 2,
                  }}
                >
                  <IconButton
                    color="primary"
                    size="small"
                    sx={{
                      bgcolor: theme.palette.grey[200],
                      "&:hover": { bgcolor: theme.palette.grey[300] },
                    }}
                    aria-label="ズームイン"
                  >
                    <ZoomInIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    color="primary"
                    size="small"
                    sx={{
                      bgcolor: theme.palette.grey[200],
                      "&:hover": { bgcolor: theme.palette.grey[300] },
                    }}
                    aria-label="ズームアウト"
                  >
                    <ZoomOutIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>

              {/* 右カラム: UP / DOWN */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  gap: 2,
                  alignItems: "center",
                }}
              >
                <Button
                  variant="contained"
                  size="small"
                  sx={{ minWidth: 80 }}
                  aria-label="アームを上方向（UP）に操作"
                >
                  UP
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  sx={{ minWidth: 80 }}
                  aria-label="アームを下方向（DOWN）に操作"
                >
                  DOWN
                </Button>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Box>

      {/* 下部: メトリクス表示 */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 2,
        }}
      >
        {metrics.map((metric, index) => (
          <Paper
            key={index}
            elevation={1}
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            <Typography variant="body2" fontWeight="medium">
              {metric.label}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Latency: {metric.latency}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Jitter: {metric.jitter}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Packet Loss: {metric.packetLoss}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Video Frame: {metric.videoFrame}
            </Typography>
          </Paper>
        ))}
      </Box>
    </Box>
  )
}
