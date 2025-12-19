import { render, screen, waitFor } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { ThemeProvider } from "@mui/material/styles"
import { describe, it, expect, vi, beforeEach } from "vitest"

import { theme } from "@/theme"
import Monitor from "./Monitor"

vi.mock("@connectrpc/connect-query", () => ({
  useQuery: vi.fn(),
}))

vi.mock("@/lib/cameraMapper", () => ({
  mapProtoCameras: vi.fn(),
}))

import { useQuery } from "@connectrpc/connect-query"
import { mapProtoCameras } from "@/lib/cameraMapper"

const mockedUseQuery = vi.mocked(useQuery)
const mockedMapProto = vi.mocked(mapProtoCameras)

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

vi.mock("@/components/WebRTCPlayer", () => ({
  default: ({ name }: { name: string }) => <div data-testid={`webrtc-${name}`}>{name}</div>,
}))

describe("Monitor", () => {
  beforeEach(() => {
    mockedUseQuery.mockReset()
    mockedMapProto.mockReset()
  })

  const renderWithTheme = () =>
    render(
      <MemoryRouter>
        <ThemeProvider theme={theme}>
          <Monitor />
        </ThemeProvider>
      </MemoryRouter>
    )

  it("初期表示でストリーム読み込み中のローディングインジケーターが表示される", async () => {

    mockedUseQuery.mockReturnValue({ data: undefined, isLoading: true, error: null } as unknown as ReturnType<typeof useQuery>)
    mockedMapProto.mockReturnValue([])

    renderWithTheme()

    expect(screen.getByRole("progressbar")).toBeInTheDocument()
  })

  it("ストリーム取得に失敗した場合にエラーメッセージが表示される", async () => {
    const errorMessage = "Failed to load streams"

    mockedUseQuery.mockReturnValue({ data: undefined, isLoading: false, error: new Error(errorMessage) } as unknown as ReturnType<typeof useQuery>)
    mockedMapProto.mockReturnValue([])

    renderWithTheme()

    expect(await screen.findByText(errorMessage)).toBeInTheDocument()
  })

  it("ストリームが空の場合に情報メッセージが表示される", async () => {

    mockedUseQuery.mockReturnValue({ data: { cameras: [] }, isLoading: false, error: null } as unknown as ReturnType<typeof useQuery>)
    mockedMapProto.mockReturnValue([])

    renderWithTheme()

    await waitFor(
      async () => {
        expect(await screen.findByText(/利用可能なストリームがありません/i)).toBeInTheDocument()
      },
      { timeout: 3000 }
    )
  })

  it("取得したカメラ情報がグリッドに表示される", async () => {

    mockedUseQuery.mockReturnValue({ data: { cameras: [{} as unknown, {} as unknown] }, isLoading: false, error: null } as unknown as ReturnType<typeof useQuery>)
    mockedMapProto.mockReturnValue(mockCameras)

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
