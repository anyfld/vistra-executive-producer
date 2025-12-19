import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { ThemeProvider } from "@mui/material/styles"
import { describe, it, expect, vi } from "vitest"
import { useParams, useNavigate } from "react-router-dom"

import { theme } from "@/theme"
import CameraPage from "./$name"

vi.mock("react-router-dom", () => ({
  useParams: vi.fn(),
  useNavigate: vi.fn(),
}))

vi.mock("@/components/WebRTCPlayer", () => ({
  default: ({ name }: { name: string }) => <div data-testid="webrtc-player">{name}</div>,
}))

const mockedUseParams = useParams as unknown as {
  mockReturnValue: (value: { name?: string }) => void
}

const mockedUseNavigate = useNavigate as unknown as {
  mockReturnValue: (value: (path: string) => void) => void
}

describe("DetailPage", () => {
  it("renders camera name from route parameter", () => {
    const cameraName = "camera-1"
    mockedUseParams.mockReturnValue({ name: cameraName })

    render(
      <ThemeProvider theme={theme}>
        <CameraPage />
      </ThemeProvider>
    )

    // h1要素にカメラ名が表示されていることを確認
    const heading = screen.getByRole("heading", { level: 1 })
    expect(heading).toHaveTextContent(cameraName)
  })

  it("renders WebRTC player with camera name", () => {
    const cameraName = "camera-2"
    mockedUseParams.mockReturnValue({ name: cameraName })

    render(
      <ThemeProvider theme={theme}>
        <CameraPage />
      </ThemeProvider>
    )

    const player = screen.getByTestId("webrtc-player")
    expect(player).toBeInTheDocument()
    expect(player).toHaveTextContent(cameraName)
  })

  it("toggles mode when Change Mode button is clicked", async () => {
    const cameraName = "camera-3"
    mockedUseParams.mockReturnValue({ name: cameraName })

    render(
      <ThemeProvider theme={theme}>
        <CameraPage />
      </ThemeProvider>
    )

    // 初期モード
    expect(screen.getByText("Autonomous")).toBeInTheDocument()

    const changeModeButton = screen.getByRole("button", { name: /Change Mode/i })

    // 1回目のクリックで LightWeight に切り替わる
    fireEvent.click(changeModeButton)
    await waitFor(() => {
      expect(screen.getByText("LightWeight")).toBeInTheDocument()
    })

    // 2回目のクリックで Autonomous に戻る
    fireEvent.click(changeModeButton)
    await waitFor(() => {
      expect(screen.getByText("Autonomous")).toBeInTheDocument()
    })
  })

  it("navigates back to home when back button is clicked", () => {
    const cameraName = "camera-4"
    const navigateMock = vi.fn()

    mockedUseParams.mockReturnValue({ name: cameraName })
    mockedUseNavigate.mockReturnValue(navigateMock)

    render(
      <ThemeProvider theme={theme}>
        <CameraPage />
      </ThemeProvider>
    )

    // 最初の IconButton が戻るボタン
    const buttons = screen.getAllByRole("button")
    fireEvent.click(buttons[0])

    expect(navigateMock).toHaveBeenCalledWith("/")
  })
})
