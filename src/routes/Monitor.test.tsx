import { render, screen, waitFor } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { ThemeProvider } from "@mui/material/styles"
import { describe, it, expect, vi, beforeEach } from "vitest"

import { theme } from "@/theme"
import { getStreams } from "@/lib/streams"
import Monitor from "./Monitor"

const mockCameras = [
  {
    name: "camera-1",
    type: "PTZ" as const,
    mode: "Autonomous" as const,
    connection: "Reachable" as const,
  },
  {
    name: "camera-2",
    type: "PTZ" as const,
    mode: "Autonomous" as const,
    connection: "Unreachable" as const,
  },
]

vi.mock("@/lib/streams", () => ({
  getStreams: vi.fn(),
}))

vi.mock("@/components/WebRTCPlayer", () => ({
  default: ({ name }: { name: string }) => <div data-testid={`webrtc-${name}`}>{name}</div>,
}))

const mockGetStreams = vi.mocked(getStreams)

describe("Monitor", () => {
  beforeEach(() => {
    mockGetStreams.mockReset()
  })

  const renderWithTheme = () =>
    render(
      <MemoryRouter>
        <ThemeProvider theme={theme}>
          <Monitor />
        </ThemeProvider>
      </MemoryRouter>
    )

  it("初期表示でストリーム読み込み中のローディングインジケーターが表示される", () => {
    mockGetStreams.mockResolvedValueOnce([])

    renderWithTheme()

    expect(screen.getByRole("progressbar")).toBeInTheDocument()
  })

  it("ストリーム取得に失敗した場合にエラーメッセージが表示される", async () => {
    const errorMessage = "Failed to load streams"
    mockGetStreams.mockRejectedValueOnce(new Error(errorMessage))

    renderWithTheme()

    expect(await screen.findByText(errorMessage)).toBeInTheDocument()
  })

  it("ストリームが空の場合に情報メッセージが表示される", async () => {
    mockGetStreams.mockResolvedValueOnce([])

    renderWithTheme()

    await waitFor(
      async () => {
        expect(await screen.findByText(/利用可能なストリームがありません/i)).toBeInTheDocument()
      },
      { timeout: 3000 }
    )
  })

  it("取得したカメラ情報がグリッドに表示される", async () => {
    mockGetStreams.mockResolvedValueOnce(mockCameras)

    const { container } = renderWithTheme()

    for (const camera of mockCameras) {
      expect(await screen.findByTestId(`webrtc-${camera.name}`)).toBeInTheDocument()
      expect(screen.getByLabelText(new RegExp(`Camera ${camera.name}`, "i"))).toBeInTheDocument()
      expect(screen.getByText(camera.connection)).toBeInTheDocument()
    }

    const cameraCards = container.querySelectorAll(".MuiPaper-root")
    expect(cameraCards.length).toBe(mockCameras.length)
  })
})
