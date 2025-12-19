import { useNavigate } from "react-router-dom"
import { Box, Typography, Paper, CircularProgress, Alert, Button, Chip, alpha } from "@mui/material"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import ErrorIcon from "@mui/icons-material/Error"
import GridViewIcon from "@mui/icons-material/GridView"
import VideocamIcon from "@mui/icons-material/Videocam"
import { useQuery } from "@connectrpc/connect-query"
import type { Camera } from "@/types/camera"
import { colors } from "@/theme"
import WebRTCPlayer from "@/components/WebRTCPlayer"
import { listCameras } from "@/gen/proto/v1/cd_service-CameraService_connectquery"
import { mapProtoCameras } from "@/lib/cameraMapper"

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
        {/* WebRTCPlayer - ポインターイベントを無効化してカードクリックを優先 */}
        <Box sx={{ pointerEvents: "none" }}>
          <WebRTCPlayer name={camera.name} />
        </Box>

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
            pointerEvents: "none",
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
            pointerEvents: "none",
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

// ProtoのCamera型をアプリケーションのCamera型に変換は `mapProtoCameras` を使用

export default function Home() {
  const navigate = useNavigate()

  // Connect Queryを使用してsrc/gen/proto/v1からカメラ映像一覧を取得
  // EP (Executive Producer) 用のカメラダッシュボード
  // CameraService.listCameras を使用してカメラ一覧を取得
  const { data, isLoading, error } = useQuery(listCameras, {
    masterMfId: "", // 空文字列で全Master MFのカメラを取得
    modeFilter: [], // フィルタなし
    statusFilter: [], // フィルタなし
    pageSize: 100, // 最大100件取得
    pageToken: "", // 最初のページ
  })

  const cameras: Camera[] = mapProtoCameras(data?.cameras)
  const onlineCameras = cameras.filter((c) => c.connection === "Reachable").length

  const handleGoToMonitor = () => {
    navigate("/monitor")
  }

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
          <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
            カメラ一覧の取得に失敗しました
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>エラー:</strong> {error instanceof Error ? error.message : String(error)}
          </Typography>
          <Typography variant="body2" sx={{ fontSize: "0.875rem", mb: 1 }}>
            <strong>API Base URL:</strong>{" "}
            {import.meta.env.VITE_API_BASE_URL || "http://localhost:8080 (default)"}
          </Typography>
          <Typography variant="body2" sx={{ fontSize: "0.875rem", mb: 1 }}>
            <strong>開発モード:</strong>{" "}
            {import.meta.env.DEV ? "はい（Viteプロキシ使用）" : "いいえ"}
          </Typography>
          <Typography
            variant="caption"
            component="div"
            sx={{ fontSize: "0.75rem", mt: 1, opacity: 0.7 }}
          >
            <strong>トラブルシューティング:</strong>
            <ul style={{ marginTop: "0.5rem", paddingLeft: "1.5rem" }}>
              <li>
                バックエンドAPIサーバーが起動しているか確認してください（デフォルト:
                http://localhost:1984）
              </li>
              <li>ブラウザの開発者ツールのネットワークタブでリクエストを確認してください</li>
              <li>CORS設定が正しいか確認してください</li>
            </ul>
          </Typography>
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
