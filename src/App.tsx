import { useState } from "react"
import { Routes, Route, useLocation } from "react-router-dom"
import { Box, Container, Fab, Dialog, IconButton, useTheme, useMediaQuery } from "@mui/material"
import ChatIcon from "@mui/icons-material/Chat"
import CloseIcon from "@mui/icons-material/Close"

import Home from "@/routes/Home"
import CameraPage from "@/routes/$name"
import Chat, { ChatContent } from "@/routes/Chat"
import Monitor from "@/routes/Monitor"

function App() {
  const [chatOpen, setChatOpen] = useState(false)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const location = useLocation()

  const isMonitorRoute = location.pathname.startsWith("/monitor")
  const isChatRoute = location.pathname === "/chat"

  // iframe内で実行されているかどうかを判定
  const isInIframe = typeof window !== "undefined" && window.self !== window.top

  const handleChatOpen = () => {
    setChatOpen(true)
  }

  const handleChatClose = () => {
    setChatOpen(false)
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Container
        component="main"
        sx={{ flex: 1, p: isMonitorRoute ? 1 : undefined }}
        maxWidth={isMonitorRoute ? false : "lg"}
        disableGutters={isMonitorRoute}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/:name" element={<CameraPage />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/monitor" element={<Monitor />} />
        </Routes>
      </Container>

      {/* iframe内でない場合のみチャットアイコンとダイアログを表示 */}
      {!isInIframe && !isChatRoute && (
        <>
          {/* 右下に固定されたチャットアイコン */}
          <Fab
            color="primary"
            aria-label="チャットを開く"
            onClick={handleChatOpen}
            sx={{
              position: "fixed",
              bottom: 24,
              right: 24,
              zIndex: theme.zIndex.speedDial,
              width: 72,
              height: 72,
            }}
          >
            <ChatIcon sx={{ fontSize: 36 }} />
          </Fab>

          {/* チャットポップアップ */}
          <Dialog
            open={chatOpen}
            onClose={handleChatClose}
            maxWidth="sm"
            fullScreen={isMobile}
            sx={{
              // デスクトップではダイアログを画面右寄りに配置
              "& .MuiDialog-container": {
                justifyContent: "flex-end",
              },
            }}
            PaperProps={{
              sx: {
                width: isMobile ? "100%" : 420,
                height: isMobile ? "100%" : "80vh",
                maxHeight: isMobile ? "100%" : "80vh",
                m: isMobile ? 0 : 2,
                borderRadius: isMobile ? 0 : 2,
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                position: "relative",
              }}
            >
              {/* 閉じるボタン */}
              <IconButton
                onClick={handleChatClose}
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  zIndex: 1,
                  bgcolor: "background.paper",
                  "&:hover": {
                    bgcolor: "action.hover",
                  },
                }}
                aria-label="チャットを閉じる"
              >
                <CloseIcon />
              </IconButton>

              {/* チャットコンテンツ */}
              <Box sx={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
                <ChatContent />
              </Box>
            </Box>
          </Dialog>
        </>
      )}
    </Box>
  )
}

export default App
