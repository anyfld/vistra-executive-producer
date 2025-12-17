import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Box, Typography, CircularProgress, Alert, Paper, Button } from "@mui/material"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"

import type { Camera } from "@/types/camera"
import { getStreams } from "@/lib/streams"
import WebRTCPlayer from "@/components/WebRTCPlayer"

export default function Monitor() {
  const [cameras, setCameras] = useState<Camera[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

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

  const columnCount = (() => {
    if (cameras.length <= 1) {
      return 1
    }

    if (cameras.length === 2) {
      return 2
    }

    if (cameras.length <= 4) {
      return 2
    }

    if (cameras.length <= 9) {
      return 3
    }

    return 4
  })()

  const handleBackToHome = () => {
    navigate("/")
  }

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
      }}
    >
      <Box
        sx={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 1,
        }}
      >
        <Button
          variant="outlined"
          color="inherit"
          startIcon={<ArrowBackIcon />}
          onClick={handleBackToHome}
        >
          Back to Dashboard
        </Button>
        <Typography variant="h5" component="h1">
          Monitor View
        </Typography>
      </Box>
      {isLoading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {!isLoading && !error && cameras.length === 0 && (
        <Alert severity="info">No streams available</Alert>
      )}

      <Box
        sx={{
          width: "100%",
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: `repeat(${columnCount}, 1fr)`,
          },
          gap: 0.5,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {cameras.map((camera) => (
          <Paper
            key={camera.name}
            elevation={0}
            sx={{
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              borderRadius: 1,
              border: 1,
              borderColor: "grey.400",
            }}
          >
            <Box
              sx={{
                position: "relative",
                width: "100%",
                pt: "56.25%", // 16:9
                backgroundColor: "black",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                }}
              >
                <WebRTCPlayer name={camera.name} />
              </Box>
              <Box
                sx={{
                  position: "absolute",
                  left: 8,
                  top: 8,
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                  backgroundColor: "rgba(0, 0, 0, 0.6)",
                  maxWidth: "80%",
                }}
              >
                <Typography
                  variant="caption"
                  color="common.white"
                  noWrap
                  aria-label={`Camera ${camera.name}`}
                >
                  {camera.name}
                </Typography>
              </Box>
              <Box
                sx={{
                  position: "absolute",
                  right: 8,
                  bottom: 8,
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                  backgroundColor: "rgba(0, 0, 0, 0.6)",
                }}
              >
                <Typography variant="caption" color="common.white">
                  {camera.connection}
                </Typography>
              </Box>
            </Box>
          </Paper>
        ))}
      </Box>
    </Box>
  )
}
