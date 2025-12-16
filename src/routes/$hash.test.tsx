import { render, screen, fireEvent } from "@testing-library/react"
import { ThemeProvider } from "@mui/material/styles"
import { describe, it, expect, vi } from "vitest"
import { useParams, useNavigate } from "react-router-dom"

import { theme } from "@/theme"
import HashPage from "./$hash"
import { sampleCameras } from "./sampleCameras"

vi.mock("react-router-dom", () => ({
  useParams: vi.fn(),
  useNavigate: vi.fn(),
}))

const mockedUseParams = useParams as unknown as {
  mockReturnValue: (value: { hash?: string }) => void
}

const mockedUseNavigate = useNavigate as unknown as {
  mockReturnValue: (value: (path: string) => void) => void
}

describe("HashPage", () => {
  it("renders error message when camera is not found", () => {
    const invalidHash = "invalid-hash"
    mockedUseParams.mockReturnValue({ hash: invalidHash })

    render(
      <ThemeProvider theme={theme}>
        <HashPage />
      </ThemeProvider>
    )

    expect(
      screen.getByText(new RegExp(`Camera not found for hash: ${invalidHash}`, "i"))
    ).toBeInTheDocument()
  })

  it("renders camera information when camera is found", () => {
    const targetCamera = sampleCameras[0]
    mockedUseParams.mockReturnValue({ hash: targetCamera.hash })

    render(
      <ThemeProvider theme={theme}>
        <HashPage />
      </ThemeProvider>
    )

    expect(
      screen.getByText(new RegExp(`ID: ${String(targetCamera.id).padStart(4, "0")}`, "i"))
    ).toBeInTheDocument()
    expect(screen.getByText(new RegExp(`Mode: ${targetCamera.mode}`, "i"))).toBeInTheDocument()
  })

  it("toggles mode when Change Mode button is clicked", () => {
    const targetCamera = { ...sampleCameras[0], mode: "Autonomous" as const }
    mockedUseParams.mockReturnValue({ hash: targetCamera.hash })

    render(
      <ThemeProvider theme={theme}>
        <HashPage />
      </ThemeProvider>
    )

    // 初期モード
    expect(screen.getByText(/Mode: Autonomous/i)).toBeInTheDocument()

    const changeModeButton = screen.getByRole("button", { name: /Change Mode/i })

    // 1回目のクリックで LightWeight に切り替わる
    fireEvent.click(changeModeButton)
    expect(screen.getByText(/Mode: LightWeight/i)).toBeInTheDocument()

    // 2回目のクリックで Autonomous に戻る
    fireEvent.click(changeModeButton)
    expect(screen.getByText(/Mode: Autonomous/i)).toBeInTheDocument()
  })

  it("navigates back to home when back button is clicked", () => {
    const targetCamera = sampleCameras[1]
    const navigateMock = vi.fn()

    mockedUseParams.mockReturnValue({ hash: targetCamera.hash })
    mockedUseNavigate.mockReturnValue(navigateMock)

    render(
      <ThemeProvider theme={theme}>
        <HashPage />
      </ThemeProvider>
    )

    // 最初の IconButton が戻るボタン
    const buttons = screen.getAllByRole("button")
    fireEvent.click(buttons[0])

    expect(navigateMock).toHaveBeenCalledWith("/")
  })

  it("renders camera thumbnail image when available", () => {
    const targetCamera = sampleCameras[2]
    mockedUseParams.mockReturnValue({ hash: targetCamera.hash })

    render(
      <ThemeProvider theme={theme}>
        <HashPage />
      </ThemeProvider>
    )

    const image = screen.getByAltText(`Camera ${targetCamera.id} video`) as HTMLImageElement
    expect(image).toBeInTheDocument()
    expect(image.src).toBe(targetCamera.thumbnail)
  })
})
