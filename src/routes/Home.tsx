import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Box, Typography, Paper, CircularProgress, Alert, Button } from "@mui/material"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import ErrorIcon from "@mui/icons-material/Error"
import GridViewIcon from "@mui/icons-material/GridView"
import type { Camera } from "@/types/camera"
import { theme } from "@/theme"
import { getStreams } from "@/lib/streams"
import WebRTCPlayer from "@/components/WebRTCPlayer"

// カメラカードコンポーネント
function CameraCard({ camera }: { camera: Camera }) {
  const [isHovered, setIsHovered] = useState(false)
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(`/${camera.name}`)
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
        transform: isHovered ? "translateY(-4px)" : "none",
        boxShadow: isHovered ? 4 : undefined,
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
        <WebRTCPlayer name={camera.name} />
      </Box>

      {/* カメラ情報 */}
      <Box
        sx={{ flexGrow: 1 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Typography variant="h6" component="div" gutterBottom>
          Name: {camera.name}
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

  return (
    <Box sx={{ width: "100%", minHeight: "100vh", p: 3 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 3,
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 0 }}>
          Camera Dashboard
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<GridViewIcon />}
          onClick={handleGoToMonitor}
        >
          Monitor View
        </Button>
      </Box>

      {isLoading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {!isLoading && !error && cameras.length === 0 && (
        <Alert severity="info">No streams available</Alert>
      )}

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
        {cameras.map((camera) => (
          <CameraCard key={camera.name} camera={camera} />
        ))}
      </Box>
    </Box>
  )
}
