import { useState, useRef, useEffect, type FormEvent } from "react"
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  CircularProgress,
  Stack,
  alpha,
} from "@mui/material"
import SendIcon from "@mui/icons-material/Send"
import SmartToyIcon from "@mui/icons-material/SmartToy"
import PersonIcon from "@mui/icons-material/Person"
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline"
import { colors } from "@/theme"

export type Role = "user" | "assistant"

export type ChatMessage = {
  id: string
  role: Role
  content: string
}

function createMockAssistantReply(userMessage: string): string {
  // 実際のLLM連携部分はここを差し替える想定
  if (!userMessage.trim()) {
    return "何か質問や相談があれば、テキストボックスに入力して送信してください。"
  }

  return `（モック応答）\n\nあなたのメッセージ:\n「${userMessage}」\n\nここにLLMからの実際の回答が表示される想定です。`
}

// 再利用可能なチャットコンテンツコンポーネント
export function ChatContent() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement | null>(null)

  const handleSubmit = async () => {
    const trimmed = input.trim()
    if (!trimmed || isLoading) return

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // 実際のLLM API呼び出しに差し替えるポイント
    const simulateRequest = () =>
      new Promise<string>((resolve) => {
        window.setTimeout(() => {
          resolve(createMockAssistantReply(trimmed))
        }, 800)
      })

    try {
      const assistantText = await simulateRequest()
      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: assistantText,
      }
      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("チャットリクエストの処理中にエラーが発生しました:", error)
      const errorMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "申し訳ございません。エラーが発生しました。もう一度お試しください。",
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const el = scrollContainerRef.current
    if (!el) return
    el.scrollTop = el.scrollHeight
  }, [messages.length, isLoading])

  return (
    <Paper
      elevation={3}
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 3,
        overflow: "hidden",
        height: "100%",
        backgroundColor: colors.background.paper,
        border: `1px solid ${alpha("#fff", 0.08)}`,
      }}
    >
      {/* ヘッダー */}
      <Box
        component="header"
        sx={{
          px: 2.5,
          py: 2,
          borderBottom: `1px solid ${alpha("#fff", 0.08)}`,
          backgroundColor: alpha(colors.background.elevated, 0.5),
          display: "flex",
          alignItems: "center",
          gap: 1.5,
        }}
      >
        <SmartToyIcon sx={{ color: colors.primary.main, fontSize: 24 }} />
        <Typography
          variant="h6"
          component="h1"
          sx={{
            fontWeight: 600,
            background: `linear-gradient(135deg, ${colors.primary.light} 0%, ${colors.primary.main} 100%)`,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          AI Assistant
        </Typography>
      </Box>

      {/* メッセージエリア */}
      <Box
        ref={scrollContainerRef}
        sx={{
          flex: 1,
          px: { xs: 2, md: 3 },
          py: 2,
          overflowY: "auto",
          backgroundColor: colors.background.default,
        }}
        aria-label="チャットメッセージ一覧"
      >
        <Stack spacing={2}>
          {messages.length === 0 && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                py: 6,
                gap: 2,
              }}
            >
              <ChatBubbleOutlineIcon
                sx={{
                  fontSize: 48,
                  color: alpha(colors.text.secondary, 0.3),
                }}
              />
              <Typography variant="body2" color="text.secondary" textAlign="center">
                まだメッセージはありません。
                <br />
                下部の入力欄から最初のメッセージを送信してみてください。
              </Typography>
            </Box>
          )}

          {messages.map((message) => (
            <Box
              key={message.id}
              sx={{
                display: "flex",
                justifyContent: message.role === "user" ? "flex-end" : "flex-start",
                gap: 1.5,
              }}
            >
              {/* アシスタントアバター */}
              {message.role === "assistant" && (
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    backgroundColor: alpha(colors.primary.main, 0.15),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    mt: 0.5,
                  }}
                >
                  <SmartToyIcon sx={{ fontSize: 18, color: colors.primary.main }} />
                </Box>
              )}

              <Box
                sx={{
                  maxWidth: "75%",
                  px: 2,
                  py: 1.5,
                  borderRadius: 2.5,
                  backgroundColor:
                    message.role === "user"
                      ? `linear-gradient(135deg, ${colors.primary.main} 0%, ${colors.primary.dark} 100%)`
                      : colors.background.paper,
                  background:
                    message.role === "user"
                      ? `linear-gradient(135deg, ${colors.primary.main} 0%, ${colors.primary.dark} 100%)`
                      : colors.background.paper,
                  color:
                    message.role === "user" ? colors.primary.contrastText : colors.text.primary,
                  border:
                    message.role === "assistant" ? `1px solid ${alpha("#fff", 0.08)}` : "none",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  boxShadow:
                    message.role === "user"
                      ? `0 4px 12px ${alpha(colors.primary.main, 0.3)}`
                      : `0 2px 8px ${alpha("#000", 0.2)}`,
                }}
              >
                <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                  {message.content}
                </Typography>
              </Box>

              {/* ユーザーアバター */}
              {message.role === "user" && (
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    backgroundColor: alpha(colors.secondary.main, 0.15),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    mt: 0.5,
                  }}
                >
                  <PersonIcon sx={{ fontSize: 18, color: colors.secondary.main }} />
                </Box>
              )}
            </Box>
          ))}

          {/* ローディング */}
          {isLoading && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  backgroundColor: alpha(colors.primary.main, 0.15),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <SmartToyIcon sx={{ fontSize: 18, color: colors.primary.main }} />
              </Box>
              <Box
                sx={{
                  px: 2,
                  py: 1.5,
                  borderRadius: 2.5,
                  backgroundColor: colors.background.paper,
                  border: `1px solid ${alpha("#fff", 0.08)}`,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <CircularProgress size={16} />
                <Typography variant="body2" color="text.secondary">
                  考え中...
                </Typography>
              </Box>
            </Box>
          )}
        </Stack>
      </Box>

      {/* 入力エリア */}
      <Box
        component="form"
        onSubmit={(event: FormEvent<HTMLFormElement>) => {
          event.preventDefault()
          void handleSubmit()
        }}
        sx={{
          px: 2,
          py: 2,
          borderTop: `1px solid ${alpha("#fff", 0.08)}`,
          backgroundColor: alpha(colors.background.elevated, 0.5),
        }}
        aria-label="メッセージ入力フォーム"
      >
        <TextField
          fullWidth
          multiline
          minRows={1}
          maxRows={4}
          placeholder="メッセージを入力... (Enterで送信)"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
              event.preventDefault()
              void handleSubmit()
            }
          }}
          InputProps={{
            endAdornment: (
              <IconButton
                type="submit"
                color="primary"
                aria-label="メッセージを送信"
                disabled={!input.trim() || isLoading}
                edge="end"
                sx={{
                  backgroundColor:
                    input.trim() && !isLoading ? alpha(colors.primary.main, 0.15) : "transparent",
                  "&:hover": {
                    backgroundColor: alpha(colors.primary.main, 0.25),
                  },
                }}
              >
                {isLoading ? <CircularProgress size={18} /> : <SendIcon />}
              </IconButton>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              backgroundColor: alpha("#fff", 0.03),
            },
          }}
        />
      </Box>
    </Paper>
  )
}

// ページ表示用のコンポーネント（後方互換性のため）
export default function Chat() {
  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        py: { xs: 2, md: 4 },
        px: { xs: 1, md: 2 },
        background: `radial-gradient(ellipse at top, ${alpha(colors.primary.main, 0.05)} 0%, transparent 50%)`,
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 960, maxHeight: "calc(100vh - 64px)" }}>
        <ChatContent />
      </Box>
    </Box>
  )
}
