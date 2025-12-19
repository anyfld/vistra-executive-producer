import { render, screen, fireEvent, waitFor } from "@testing-library/react"
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

    expect(screen.getByRole("heading", { name: "AI Assistant" })).toBeInTheDocument()
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

    const input = screen.getByPlaceholderText("メッセージを入力... (Enterで送信)")

    fireEvent.change(input, { target: { value: "こんにちは" } })

    const sendButton = screen.getByRole("button", { name: "メッセージを送信" })
    expect(sendButton).toBeEnabled()

    fireEvent.click(sendButton)

    // ユーザーのメッセージが表示される
    await waitFor(() => {
      expect(screen.getByText("こんにちは")).toBeInTheDocument()
    })

    // ローディングインジケーターが表示される
    await waitFor(() => {
      expect(screen.getByText("考え中...")).toBeInTheDocument()
    })

    // モックのアシスタント応答が表示されるまで待つ
    expect(
      await screen.findByText(/ここにLLMからの実際の回答が表示される想定です。/i, undefined, {
        timeout: 2000,
      })
    ).toBeInTheDocument()
  })

  it("Enter キーでメッセージを送信できる（Shift + Enter では送信されない）", async () => {
    renderWithTheme()

    const input = screen.getByPlaceholderText("メッセージを入力... (Enterで送信)")

    // Shift + Enter では送信されない（メッセージバブルが生成されない）
    fireEvent.change(input, { target: { value: "テストメッセージ" } })
    fireEvent.keyDown(input, { key: "Enter", code: "Enter", shiftKey: true })

    // 少し待ってから、メッセージバブルがまだ表示されていないことを確認
    await new Promise((resolve) => setTimeout(resolve, 200))
    // 空状態メッセージがまだ表示されていることを確認（メッセージが送信されていない）
    expect(
      screen.getByText(/まだメッセージはありません。/i)
    ).toBeInTheDocument()

    // Enter 単体で送信される
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" })

    await waitFor(() => {
      expect(screen.getByText("テストメッセージ")).toBeInTheDocument()
    })

    expect(
      await screen.findByText(/ここにLLMからの実際の回答が表示される想定です。/i, undefined, {
        timeout: 2000,
      })
    ).toBeInTheDocument()
  })
})
