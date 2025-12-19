import { render, screen, fireEvent } from "@testing-library/react"
import { ThemeProvider } from "@mui/material/styles"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { TransportProvider } from "@connectrpc/connect-query"
import { describe, it, expect, vi } from "vitest"
import { useParams, useNavigate } from "react-router-dom"

import { theme } from "@/theme"
import { transport } from "@/lib/connect"
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
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <TransportProvider transport={transport}>
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </TransportProvider>
    </QueryClientProvider>
  )

  it("renders camera name from route parameter", () => {
    const cameraName = "camera-1"
    mockedUseParams.mockReturnValue({ name: cameraName })

    render(<CameraPage />, { wrapper })

    // h1要素にカメラ名が表示されていることを確認
    const heading = screen.getByRole("heading", { level: 1 })
    expect(heading).toHaveTextContent(cameraName)
  })

  it("renders WebRTC player with camera name", () => {
    const cameraName = "camera-2"
    mockedUseParams.mockReturnValue({ name: cameraName })

    render(<CameraPage />, { wrapper })

    const player = screen.getByTestId("webrtc-player")
    expect(player).toBeInTheDocument()
    expect(player).toHaveTextContent(cameraName)
  })

  it("displays mode chip with Autonomous mode", () => {
    const cameraName = "camera-3"
    mockedUseParams.mockReturnValue({ name: cameraName })

    render(<CameraPage />, { wrapper })

    // モードチップが表示されていることを確認
    expect(screen.getByText("Autonomous")).toBeInTheDocument()
  })

  it("navigates back to home when back button is clicked", () => {
    const cameraName = "camera-4"
    const navigateMock = vi.fn()

    mockedUseParams.mockReturnValue({ name: cameraName })
    mockedUseNavigate.mockReturnValue(navigateMock)

    render(<CameraPage />, { wrapper })

    // 最初の IconButton が戻るボタン
    const buttons = screen.getAllByRole("button")
    fireEvent.click(buttons[0])

    expect(navigateMock).toHaveBeenCalledWith("/")
  })
})
