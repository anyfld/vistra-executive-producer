import { render, screen, fireEvent } from "@testing-library/react"
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

vi.mock("@/lib/streams", () => ({
  getStreams: vi.fn(() => Promise.resolve(mockCameras)),
}))

vi.mock("@/components/WebRTCPlayer", () => ({
  default: ({ name }: { name: string }) => <div data-testid={`webrtc-${name}`}>{name}</div>,
}))

beforeEach(() => {
  mockedNavigate.mockClear()
})

describe("Home", () => {
  it("renders correctly", () => {
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
    const { container } = render(
      <ThemeProvider theme={theme}>
        <Home />
      </ThemeProvider>
    )

    // Wait for first camera to load
    await screen.findByText(/Name: camera-1/i)

    // Paperコンポーネント（カメラカード）がmockCameras.lengthと一致することを確認
    const cameraCards = container.querySelectorAll(".MuiPaper-root")
    expect(cameraCards.length).toBe(mockCameras.length)
  })

  it("renders camera information for each card", async () => {
    render(
      <ThemeProvider theme={theme}>
        <Home />
      </ThemeProvider>
    )

    // Wait for cameras to load
    await screen.findByText(/Name: camera-1/i)

    // 最初のカメラの情報が表示されているか確認
    expect(screen.getByText(new RegExp(`Name: ${mockCameras[0].name}`, "i"))).toBeInTheDocument()

    // 複数のカメラカードがあるため、getAllByTextを使用
    const typeLabels = screen.getAllByText(/Type:/i)
    expect(typeLabels.length).toBe(mockCameras.length)

    const modeLabels = screen.getAllByText(/Mode:/i)
    expect(modeLabels.length).toBe(mockCameras.length)

    const connectionLabels = screen.getAllByText(/Connection:/i)
    expect(connectionLabels.length).toBe(mockCameras.length)
  })

  it("renders all camera names", async () => {
    render(
      <ThemeProvider theme={theme}>
        <Home />
      </ThemeProvider>
    )

    // Wait for cameras to load and check all are displayed
    for (const camera of mockCameras) {
      await screen.findByText(new RegExp(`Name: ${camera.name}`, "i"))
    }
  })

  it("navigates to camera detail page when a camera card is clicked", async () => {
    render(
      <ThemeProvider theme={theme}>
        <Home />
      </ThemeProvider>
    )

    const targetCamera = mockCameras[0]

    const nameElement = await screen.findByText(new RegExp(`Name: ${targetCamera.name}`, "i"))
    const cardElement = nameElement.closest(".MuiPaper-root")

    if (cardElement) {
      fireEvent.click(cardElement)
    }

    expect(mockedNavigate).toHaveBeenCalledWith(`/${targetCamera.name}`)
  })
})
