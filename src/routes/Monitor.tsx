import { useNavigate } from "react-router-dom"
import { Box, Typography, CircularProgress, Alert, Paper, Button, alpha, Chip } from "@mui/material"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import GridViewIcon from "@mui/icons-material/GridView"
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord"
import { useQuery } from "@connectrpc/connect-query"
import type { Camera } from "@/types/camera"
import { listCameras } from "@/gen/proto/v1/cd_service-CameraService_connectquery"
import { mapProtoCameras } from "@/lib/cameraMapper"
import WebRTCPlayer from "@/components/WebRTCPlayer"
import { colors } from "@/theme"

export default function Monitor() {
  const navigate = useNavigate()

  // use connect-query to fetch cameras from CameraService.ListCameras
  const { data, isLoading, error } = useQuery(listCameras, {
    masterMfId: "",
    modeFilter: [],
    statusFilter: [],
    pageSize: 100,
    pageToken: "",
  })

  const cameras: Camera[] = mapProtoCameras(data?.cameras)

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

  const onlineCameras = cameras.filter((c) => c.connection === "Reachable").length

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        p: 2,
        backgroundColor: colors.background.default,
      }}
    >
      {/* ヘッダー */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 1,
          py: 1,
        }}
      >
        <Button
          variant="outlined"
          color="primary"
          size="large"
          startIcon={<ArrowBackIcon />}
          onClick={handleBackToHome}
          sx={{
            borderWidth: 2,
            px: 3,
            py: 1,
            "&:hover": {
              borderWidth: 2,
            },
          }}
        >
          Back to Dashboard
        </Button>

        <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
          <Chip
            icon={<FiberManualRecordIcon sx={{ fontSize: 10 }} />}
            label={`${onlineCameras} / ${cameras.length} Online`}
            sx={{
              backgroundColor: alpha(colors.success.main, 0.15),
              color: colors.success.light,
              border: `1px solid ${alpha(colors.success.main, 0.3)}`,
              fontWeight: 600,
              "& .MuiChip-icon": {
                color: colors.success.main,
                animation: "pulse 2s infinite",
              },
              "@keyframes pulse": {
                "0%, 100%": { opacity: 1 },
                "50%": { opacity: 0.4 },
              },
            }}
          />

          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <GridViewIcon sx={{ color: colors.primary.main, fontSize: 28 }} />
            <Typography
              variant="h5"
              component="h1"
              sx={{
                fontWeight: 700,
                background: `linear-gradient(135deg, ${colors.primary.light} 0%, ${colors.primary.main} 100%)`,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Monitor View
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* ローディング */}
      {isLoading && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
            gap: 2,
          }}
        >
          <CircularProgress size={48} />
          <Typography variant="body2" color="text.secondary">
            ストリームを読み込み中...
          </Typography>
        </Box>
      )}

      {/* エラー */}
      {error && (
        <Alert severity="error" sx={{ mx: 1 }}>
          {error instanceof Error ? error.message : String(error)}
        </Alert>
      )}

      {/* 空状態 */}
      {!isLoading && !error && cameras.length === 0 && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
          }}
        >
          <Alert severity="info">利用可能なストリームがありません</Alert>
        </Box>
      )}

      {/* カメラグリッド */}
      <Box
        sx={{
          flex: 1,
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: `repeat(${columnCount}, 1fr)`,
          },
          gap: 1,
          alignContent: "start",
        }}
      >
        {cameras.map((camera) => {
          const isOnline = camera.connection === "Reachable"
          return (
            <Paper
              key={camera.name}
              elevation={0}
              sx={{
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                borderRadius: 2,
                border: `1px solid ${alpha("#fff", 0.08)}`,
              }}
            >
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  pt: "56.25%", // 16:9
                  backgroundColor: "#000",
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

                {/* カメラ名オーバーレイ */}
                <Box
                  sx={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    top: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    px: 1.5,
                    py: 1,
                    background: `linear-gradient(180deg, ${alpha("#000", 0.7)} 0%, transparent 100%)`,
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      color: "#fff",
                      fontWeight: 600,
                      letterSpacing: "0.02em",
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                    }}
                    aria-label={`Camera ${camera.name}`}
                  >
                    {camera.name}
                  </Typography>

                  {/* ステータスドット */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                    }}
                  >
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        backgroundColor: isOnline ? colors.success.main : colors.error.main,
                        boxShadow: `0 0 8px ${isOnline ? colors.success.main : colors.error.main}`,
                        animation: isOnline ? "pulse 2s infinite" : "none",
                        "@keyframes pulse": {
                          "0%, 100%": { opacity: 1 },
                          "50%": { opacity: 0.5 },
                        },
                      }}
                    />
                  </Box>
                </Box>

                {/* 接続タイプ */}
                <Box
                  sx={{
                    position: "absolute",
                    right: 8,
                    bottom: 8,
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                    backgroundColor: alpha("#000", 0.7),
                    backdropFilter: "blur(4px)",
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      color: colors.text.secondary,
                      fontSize: "0.65rem",
                      fontWeight: 500,
                    }}
                  >
                    {camera.connection}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          )
        })}
      </Box>
    </Box>
  )
}
