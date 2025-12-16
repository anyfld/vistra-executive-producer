import { useState } from "react"
import { Box, Typography, Paper, Avatar } from "@mui/material"
import VideocamIcon from "@mui/icons-material/Videocam"

type CameraType = "PTZ" | "Arm"
type Mode = "Autonomous" | "LightWeight"
type Connection = "Reachable" | "Unreachable"

interface Camera {
  id: number
  thumbnail?: string
  type: CameraType
  mode: Mode
  connection: Connection
  hash: string
}

// サンプルデータ
const sampleCameras: Camera[] = [
  {
    id: 1,
    thumbnail: "https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=PTZ+1",
    type: "PTZ",
    mode: "Autonomous",
    connection: "Reachable",
    hash: "1234567890",
  },
  {
    id: 2,
    thumbnail: "https://via.placeholder.com/400x300/2196F3/FFFFFF?text=Arm+2",
    type: "Arm",
    mode: "LightWeight",
    connection: "Reachable",
    hash: "1234567890",
  },
  {
    id: 3,
    thumbnail: "https://via.placeholder.com/400x300/FF9800/FFFFFF?text=PTZ+3",
    type: "PTZ",
    mode: "LightWeight",
    connection: "Unreachable",
    hash: "1234567890",
  },
  {
    id: 4,
    thumbnail: "https://via.placeholder.com/400x300/9C27B0/FFFFFF?text=Arm+4",
    type: "Arm",
    mode: "Autonomous",
    connection: "Reachable",
    hash: "1234567890",
  },
  {
    id: 5,
    thumbnail: "https://via.placeholder.com/400x300/00BCD4/FFFFFF?text=PTZ+5",
    type: "PTZ",
    mode: "Autonomous",
    connection: "Reachable",
    hash: "1234567890",
  },
  {
    id: 6,
    thumbnail: "https://via.placeholder.com/400x300/E91E63/FFFFFF?text=Arm+6",
    type: "Arm",
    mode: "LightWeight",
    connection: "Unreachable",
    hash: "1234567890",
  },
  {
    id: 7,
    thumbnail: "https://via.placeholder.com/400x300/8BC34A/FFFFFF?text=PTZ+7",
    type: "PTZ",
    mode: "LightWeight",
    connection: "Reachable",
    hash: "1234567890",
  },
  {
    id: 8,
    thumbnail: "https://via.placeholder.com/400x300/FF5722/FFFFFF?text=Arm+8",
    type: "Arm",
    mode: "Autonomous",
    connection: "Unreachable",
    hash: "1234567890",
  },
]

// カメラカードコンポーネント
function CameraCard({ camera }: { camera: Camera }) {
  const [hasError, setHasError] = useState(false)

  return (
    <Paper
      elevation={2}
      sx={{
        p: 2,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.2s, box-shadow 0.2s",
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
          backgroundColor: "#f5f5f5",
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
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor: camera.connection === "Reachable" ? "#4caf50" : "#f44336",
                }}
              />
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
        PTZ Camera Dashboard
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
