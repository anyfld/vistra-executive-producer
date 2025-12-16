import { render, screen, fireEvent } from "@testing-library/react"
import { ThemeProvider } from "@mui/material/styles"
import { describe, it, expect } from "vitest"

import { theme } from "@/theme"
import Chat from "./Chat"

describe("Chat", () => {
  const renderWithTheme = () =>
    render(
      <ThemeProvider theme={theme}>
        <Chat />
      </ThemeProvider>
    )

  it("初期表示でヘッダーと空状態メッセージが表示される", () => {
    renderWithTheme()

    expect(screen.getByRole("heading", { name: "LLM チャット" })).toBeInTheDocument()
    expect(
      screen.getByText(
        /まだメッセージはありません。下部の入力欄から最初のメッセージを送信してみてください。/i
      )
    ).toBeInTheDocument()

    const sendButton = screen.getByRole("button", { name: "メッセージを送信" })
    expect(sendButton).toBeDisabled()
  })

  it("メッセージを入力して送信ボタンを押すとユーザーメッセージとアシスタントの応答が表示される", async () => {
    renderWithTheme()

    const input = screen.getByPlaceholderText(
      "メッセージを入力して Enter で送信（Shift + Enter で改行）"
    )

    fireEvent.change(input, { target: { value: "こんにちは" } })

    const sendButton = screen.getByRole("button", { name: "メッセージを送信" })
    expect(sendButton).toBeEnabled()

    fireEvent.click(sendButton)

    // ユーザーのメッセージが表示される
    expect(screen.getByText("あなた")).toBeInTheDocument()
    expect(screen.getByText("こんにちは")).toBeInTheDocument()

    // ローディングインジケーターが表示される
    expect(screen.getByText("アシスタントが考え中です…")).toBeInTheDocument()

    // モックのアシスタント応答が表示されるまで待つ
    expect(
      await screen.findByText(/ここにLLMからの実際の回答が表示される想定です。/i, undefined, {
        timeout: 2000,
      })
    ).toBeInTheDocument()

    // アシスタントのバッジも表示されていること
    expect(screen.getByText("アシスタント")).toBeInTheDocument()
  })

  it("Enter キーでメッセージを送信できる（Shift + Enter では送信されない）", async () => {
    renderWithTheme()

    const input = screen.getByPlaceholderText(
      "メッセージを入力して Enter で送信（Shift + Enter で改行）"
    )

    // Shift + Enter では送信されない（メッセージバブルが生成されない）
    fireEvent.change(input, { target: { value: "テストメッセージ" } })
    fireEvent.keyDown(input, { key: "Enter", code: "Enter", shiftKey: true })

    // 入力欄には値が残っていてよいので、ユーザー用ラベル「あなた」がまだ表示されていないことを確認
    expect(screen.queryByText("あなた")).not.toBeInTheDocument()

    // Enter 単体で送信される
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" })

    expect(screen.getByText("あなた")).toBeInTheDocument()
    expect(screen.getByText("テストメッセージ")).toBeInTheDocument()

    expect(
      await screen.findByText(/ここにLLMからの実際の回答が表示される想定です。/i, undefined, {
        timeout: 2000,
      })
    ).toBeInTheDocument()
  })
})
