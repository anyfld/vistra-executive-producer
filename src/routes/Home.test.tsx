import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { ThemeProvider } from "@mui/material/styles"
import { describe, it, expect, vi, beforeEach } from "vitest"

import { theme } from "@/theme"
import Home from "./Home"

const mockCameras = [
  {
    name: "camera-1",
    type: "PTZ" as const,
    mode: "Autonomous" as const,
    connection: "Reachable" as const,
  },
  {
    name: "camera-2",
    type: "Arm" as const,
    mode: "LightWeight" as const,
    connection: "Reachable" as const,
  },
  {
    name: "camera-3",
    type: "PTZ" as const,
    mode: "Autonomous" as const,
    connection: "Unreachable" as const,
  },
]

const mockedNavigate = vi.fn()

vi.mock("react-router-dom", () => ({
  useNavigate: () => mockedNavigate,
}))

vi.mock("@connectrpc/connect-query", () => ({
  useQuery: vi.fn(),
}))

vi.mock("@/lib/cameraMapper", () => ({
  mapProtoCameras: vi.fn(),
}))

vi.mock("@/components/WebRTCPlayer", () => ({
  default: ({ name }: { name: string }) => <div data-testid={`webrtc-${name}`}>{name}</div>,
}))

beforeEach(() => {
  mockedNavigate.mockClear()
})

describe("Home", () => {
  it("renders correctly", async () => {
    // mock useQuery to return ready data and mapProtoCameras to return mock cameras
    const { useQuery } = await import("@connectrpc/connect-query")
    const { mapProtoCameras } = await import("@/lib/cameraMapper")
    ;(useQuery as any).mockReturnValue({ data: { cameras: [] }, isLoading: false, error: null })
    ;(mapProtoCameras as any).mockReturnValue(mockCameras)

    render(
      <ThemeProvider theme={theme}>
        <Home />
      </ThemeProvider>
    )
  })

  it("renders dashboard heading", () => {
    render(
      <ThemeProvider theme={theme}>
        <Home />
      </ThemeProvider>
    )

    expect(screen.getByRole("heading", { name: /Camera Dashboard/i })).toBeInTheDocument()
  })

  it("renders camera cards", async () => {
    const { useQuery } = await import("@connectrpc/connect-query")
    const { mapProtoCameras } = await import("@/lib/cameraMapper")
    ;(useQuery as any).mockReturnValue({ data: { cameras: [] }, isLoading: false, error: null })
    ;(mapProtoCameras as any).mockReturnValue(mockCameras)

    const { container } = render(
      <ThemeProvider theme={theme}>
        <Home />
      </ThemeProvider>
    )

    // Wait for first camera to load - カメラ名は複数箇所に表示されるので、getAllByTextを使用
    await waitFor(
      () => {
        const nameElements = screen.getAllByText(mockCameras[0].name)
        expect(nameElements.length).toBeGreaterThan(0)
      },
      { timeout: 3000 }
    )

    // Paperコンポーネント（カメラカード）がmockCameras.lengthと一致することを確認
    await waitFor(
      () => {
        const cameraCards = container.querySelectorAll(".MuiPaper-root")
        expect(cameraCards.length).toBe(mockCameras.length)
      },
      { timeout: 3000 }
    )
  })

  it("renders camera information for each card", async () => {
    const { useQuery } = await import("@connectrpc/connect-query")
    const { mapProtoCameras } = await import("@/lib/cameraMapper")
    ;(useQuery as any).mockReturnValue({ data: { cameras: [] }, isLoading: false, error: null })
    ;(mapProtoCameras as any).mockReturnValue(mockCameras)

    render(
      <ThemeProvider theme={theme}>
        <Home />
      </ThemeProvider>
    )

    // Wait for cameras to load
    await waitFor(
      () => {
        const nameElements = screen.getAllByText(mockCameras[0].name)
        expect(nameElements.length).toBeGreaterThan(0)
      },
      { timeout: 3000 }
    )

    // 複数のカメラカードがあるため、getAllByTextを使用
    await waitFor(
      () => {
        const typeLabels = screen.getAllByText(/Type/i)
        expect(typeLabels.length).toBe(mockCameras.length)

        const modeLabels = screen.getAllByText(/Mode/i)
        expect(modeLabels.length).toBe(mockCameras.length)
      },
      { timeout: 3000 }
    )
  })

  it("renders all camera names", async () => {
    const { useQuery } = await import("@connectrpc/connect-query")
    const { mapProtoCameras } = await import("@/lib/cameraMapper")
    ;(useQuery as any).mockReturnValue({ data: { cameras: [] }, isLoading: false, error: null })
    ;(mapProtoCameras as any).mockReturnValue(mockCameras)

    render(
      <ThemeProvider theme={theme}>
        <Home />
      </ThemeProvider>
    )

    // Wait for cameras to load and check all are displayed
    await waitFor(
      async () => {
        for (const camera of mockCameras) {
          const elements = screen.getAllByText(camera.name)
          expect(elements.length).toBeGreaterThan(0)
        }
      },
      { timeout: 3000 }
    )
  })

  it("navigates to camera detail page when a camera card is clicked", async () => {
    const { useQuery } = await import("@connectrpc/connect-query")
    const { mapProtoCameras } = await import("@/lib/cameraMapper")
    ;(useQuery as any).mockReturnValue({ data: { cameras: [] }, isLoading: false, error: null })
    ;(mapProtoCameras as any).mockReturnValue(mockCameras)

    render(
      <ThemeProvider theme={theme}>
        <Home />
      </ThemeProvider>
    )

    const targetCamera = mockCameras[0]

    // カメラ名が表示されるまで待つ
    await waitFor(
      () => {
        const nameElements = screen.getAllByText(targetCamera.name)
        expect(nameElements.length).toBeGreaterThan(0)
      },
      { timeout: 3000 }
    )

    // カメラ名を含むPaperコンポーネント（カメラカード）を探す
    await waitFor(
      () => {
        const nameElements = screen.getAllByText(targetCamera.name)
        const cardElement = nameElements[0]?.closest(".MuiPaper-root")
        if (cardElement) {
          fireEvent.click(cardElement)
        } else {
          throw new Error("Card element not found")
        }
      },
      { timeout: 3000 }
    )

    await waitFor(() => {
      expect(mockedNavigate).toHaveBeenCalledWith(`/${targetCamera.name}`)
    })
  })
})
