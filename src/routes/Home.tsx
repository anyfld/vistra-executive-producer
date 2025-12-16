import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Box, Typography, Paper, Avatar } from "@mui/material"
import VideocamIcon from "@mui/icons-material/Videocam"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import ErrorIcon from "@mui/icons-material/Error"
import { sampleCameras, type Camera } from "./sampleCameras"
import { theme } from "@/theme"

// カメラカードコンポーネント
function CameraCard({ camera }: { camera: Camera }) {
  const [hasError, setHasError] = useState(false)
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(`/${camera.hash}`)
  }

  return (
    <Paper
      elevation={2}
      onClick={handleClick}
      sx={{
        p: 2,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.2s, box-shadow 0.2s",
        cursor: "pointer",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 4,
        },
      }}
    >
      {/* サムネイル */}
      <Box
        sx={{
          width: "100%",
          aspectRatio: "16/9",
          mb: 2,
          borderRadius: 1,
          overflow: "hidden",
          backgroundColor: theme.palette.grey[100],
        }}
      >
        {camera.thumbnail && !hasError ? (
          <Box
            component="img"
            src={camera.thumbnail}
            alt={`Camera ${camera.id} thumbnail`}
            onError={() => setHasError(true)}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : (
          <Avatar sx={{ bgcolor: "rgba(0, 0, 0, 0.26)", width: 64, height: 64 }}>
            <VideocamIcon sx={{ fontSize: 40 }} />
          </Avatar>
        )}
      </Box>

      {/* カメラ情報 */}
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="h6" component="div" gutterBottom>
          ID: {camera.id}
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 1 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body2" color="text.secondary">
              Type:
            </Typography>
            <Typography variant="body2" fontWeight="medium">
              {camera.type}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body2" color="text.secondary">
              Mode:
            </Typography>
            <Typography variant="body2" fontWeight="medium">
              {camera.mode}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="body2" color="text.secondary">
              Connection:
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              {camera.connection === "Reachable" ? (
                <CheckCircleIcon
                  sx={{
                    fontSize: 16,
                    color: theme.palette.success.main,
                  }}
                />
              ) : (
                <ErrorIcon
                  sx={{
                    fontSize: 16,
                    color: theme.palette.error.main,
                  }}
                />
              )}
              <Typography variant="body2" fontWeight="medium">
                {camera.connection}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Paper>
  )
}

export default function Home() {
  return (
    <Box sx={{ width: "100%", minHeight: "100vh", p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3 }}>
        Camera Dashboard
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
          },
          gap: 3,
        }}
      >
        {sampleCameras.map((camera) => (
          <CameraCard key={camera.id} camera={camera} />
        ))}
      </Box>
    </Box>
  )
}
