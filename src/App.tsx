import { useState } from "react"
import { Routes, Route } from "react-router-dom"
import { Box, Container, Fab, Dialog, IconButton, useTheme, useMediaQuery } from "@mui/material"
import ChatIcon from "@mui/icons-material/Chat"
import CloseIcon from "@mui/icons-material/Close"

import Home from "@/routes/Home"
import HashPage from "@/routes/$name"
import Chat from "@/routes/Chat"
import { ChatContent } from "@/routes/Chat"
import CameraPage from "@/routes/$name"

function App() {
  const [chatOpen, setChatOpen] = useState(false)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  const handleChatOpen = () => {
    setChatOpen(true)
  }

  const handleChatClose = () => {
    setChatOpen(false)
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Container component="main" sx={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/:hash" element={<HashPage />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/:name" element={<CameraPage />} />
        </Routes>
      </Container>

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
          width: 80,
          height: 80,
        }}
      >
        <ChatIcon sx={{ fontSize: 40 }} />
      </Fab>

      {/* チャットポップアップ */}
      <Dialog
        open={chatOpen}
        onClose={handleChatClose}
        fullScreen={isMobile}
        sx={{
          // デスクトップではダイアログを画面右寄りに配置
          "& .MuiDialog-container": {
            justifyContent: "flex-end",
          },
        }}
        PaperProps={{
          sx: {
            width: isMobile ? "100%" : 480,
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
    </Box>
  )
}

export default App
