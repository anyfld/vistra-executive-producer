import { useState, useRef, useEffect, type FormEvent } from "react"
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  CircularProgress,
  Stack,
} from "@mui/material"
import SendIcon from "@mui/icons-material/Send"

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
  const [error, setError] = useState<string | null>(null)
  const scrollContainerRef = useRef<HTMLDivElement | null>(null)

  const handleSubmit = async () => {
    const trimmed = input.trim()
    if (!trimmed || isLoading) return

    // 新しい送信ごとに前回のエラー表示をリセット
    setError(null)

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // 実際のLLM API呼び出しに差し替えるポイント
    // 例:
    // const response = await fetch("/api/chat", { ... })
    // const data = await response.json()
    // const assistantText = data.message
    try {
      const simulateRequest = () =>
        new Promise<string>((resolve) => {
          window.setTimeout(() => {
            resolve(createMockAssistantReply(trimmed))
          }, 800)
        })

      const assistantText = await simulateRequest()
      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: assistantText,
      }
      setMessages((prev) => [...prev, assistantMessage])
      // 正常終了時はエラーをクリア（将来のAPI実装で部分的成功などを考慮）
      setError(null)
    } catch {
      // 実際の運用ではロギング基盤などに送る想定
      setError("アシスタントからの応答取得中にエラーが発生しました。しばらく待ってから再度お試しください。")
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
      }}
    >
      <Box
        component="header"
        sx={{
          px: 2,
          py: 2,
          borderBottom: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
        }}
      >
        <Typography variant="h6" component="h1">
          LLM チャット
        </Typography>
      </Box>

      <Box
        ref={scrollContainerRef}
        sx={(theme) => ({
          flex: 1,
          px: { xs: 1.5, md: 3 },
          py: 2,
          overflowY: "auto",
          bgcolor: theme.palette.mode === "dark" ? "background.default" : theme.palette.grey[50],
        })}
        aria-label="チャットメッセージ一覧"
      >
        <Stack spacing={1.5}>
          {messages.length === 0 && (
            <Typography variant="body2" color="text.secondary">
              まだメッセージはありません。下部の入力欄から最初のメッセージを送信してみてください。
            </Typography>
          )}
          {messages.map((message) => (
            <Box
              key={message.id}
              sx={{
                display: "flex",
                justifyContent: message.role === "user" ? "flex-end" : "flex-start",
                mb: 0.5,
              }}
            >
              <Box
                sx={{
                  maxWidth: "80%",
                  px: { xs: 1.5, md: 2 },
                  py: 1.25,
                  borderRadius: 3,
                  bgcolor:
                    message.role === "user"
                      ? "primary.main"
                      : (theme) =>
                          theme.palette.mode === "dark"
                            ? theme.palette.grey[900]
                            : theme.palette.background.paper,
                  color: message.role === "user" ? "primary.contrastText" : "text.primary",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  boxShadow: 1,
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    display: "block",
                    mb: 0.5,
                    opacity: 0.7,
                  }}
                >
                  {message.role === "user" ? "あなた" : "アシスタント"}
                </Typography>
                <Typography variant="body2">{message.content}</Typography>
              </Box>
            </Box>
          ))}

          {isLoading && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "text.secondary" }}>
              <CircularProgress size={18} />
              <Typography variant="body2">アシスタントが考え中です…</Typography>
            </Box>
          )}
        </Stack>
      </Box>

      <Box
        component="form"
        onSubmit={(event: FormEvent<HTMLFormElement>) => {
          event.preventDefault()
          void handleSubmit()
        }}
        sx={{
          px: 2,
          py: 1.5,
          borderTop: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
        }}
        aria-label="メッセージ入力フォーム"
      >
        {error && (
          <Typography
            variant="body2"
            color="error"
            role="alert"
            sx={{ mb: 1 }}
          >
            {error}
          </Typography>
        )}
        <TextField
          fullWidth
          multiline
          minRows={1}
          maxRows={4}
          placeholder="メッセージを入力して Enter で送信（Shift + Enter で改行）"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            const isComposing = event.nativeEvent.isComposing

            if (event.key === "Enter" && !event.shiftKey && !isComposing) {
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
              >
                {isLoading ? <CircularProgress size={18} /> : <SendIcon />}
              </IconButton>
            ),
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
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 960, maxHeight: "calc(100vh - 64px)" }}>
        <ChatContent />
      </Box>
    </Box>
  )
}
