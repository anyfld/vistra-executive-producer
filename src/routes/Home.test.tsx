import { render, screen, fireEvent } from "@testing-library/react"
import { ThemeProvider } from "@mui/material/styles"
import { describe, it, expect } from "vitest"

import { theme } from "@/theme"
import Home from "./Home"
import { sampleCameras } from "./sampleCameras"

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

  it("renders camera cards", () => {
    const { container } = render(
      <ThemeProvider theme={theme}>
        <Home />
      </ThemeProvider>
    )

    // Paperコンポーネント（カメラカード）がsampleCameras.lengthと一致することを確認
    const cameraCards = container.querySelectorAll(".MuiPaper-root")
    expect(cameraCards.length).toBe(sampleCameras.length)
  })

  it("renders camera information for each card", () => {
    render(
      <ThemeProvider theme={theme}>
        <Home />
      </ThemeProvider>
    )

    // 最初のカメラの情報が表示されているか確認
    expect(screen.getByText(new RegExp(`ID: ${sampleCameras[0].id}`, "i"))).toBeInTheDocument()

    // 複数のカメラカードがあるため、getAllByTextを使用
    const typeLabels = screen.getAllByText(/Type:/i)
    expect(typeLabels.length).toBe(sampleCameras.length)

    const modeLabels = screen.getAllByText(/Mode:/i)
    expect(modeLabels.length).toBe(sampleCameras.length)

    const connectionLabels = screen.getAllByText(/Connection:/i)
    expect(connectionLabels.length).toBe(sampleCameras.length)
  })

  it("renders all camera IDs", () => {
    render(
      <ThemeProvider theme={theme}>
        <Home />
      </ThemeProvider>
    )

    // sampleCamerasの各カメラIDがすべて表示されているか確認
    sampleCameras.forEach((camera) => {
      expect(screen.getByText(new RegExp(`ID: ${camera.id}`, "i"))).toBeInTheDocument()
    })
  })

  it("displays fallback avatar when thumbnail image fails to load", () => {
    const { container } = render(
      <ThemeProvider theme={theme}>
        <Home />
      </ThemeProvider>
    )

    // 最初のカメラの画像要素を取得（alt属性で特定）
    const firstCameraImage = screen.getByAltText(`Camera ${sampleCameras[0].id} thumbnail`)
    expect(firstCameraImage).toBeInTheDocument()

    // 画像の読み込みエラーをシミュレート
    fireEvent.error(firstCameraImage)

    // エラー後、画像が消えてフォールバックアバターが表示されることを確認
    // 画像要素が存在しないことを確認
    expect(screen.queryByAltText(`Camera ${sampleCameras[0].id} thumbnail`)).not.toBeInTheDocument()

    // Avatarコンポーネントが表示されていることを確認（MuiAvatar-rootクラスで検証）
    const avatars = container.querySelectorAll(".MuiAvatar-root")
    expect(avatars.length).toBeGreaterThan(0)
  })

  it("handles image error for multiple camera cards independently", () => {
    const { container } = render(
      <ThemeProvider theme={theme}>
        <Home />
      </ThemeProvider>
    )

    // 最初の2つのカメラの画像要素を取得
    const firstImage = screen.getByAltText(`Camera ${sampleCameras[0].id} thumbnail`)
    const secondImage = screen.getByAltText(`Camera ${sampleCameras[1].id} thumbnail`)

    // 最初の画像のエラーをシミュレート
    fireEvent.error(firstImage)

    // 最初の画像は消え、2つ目の画像はまだ表示されていることを確認
    expect(screen.queryByAltText(`Camera ${sampleCameras[0].id} thumbnail`)).not.toBeInTheDocument()
    expect(screen.getByAltText(`Camera ${sampleCameras[1].id} thumbnail`)).toBeInTheDocument()

    // 2つ目の画像のエラーもシミュレート
    fireEvent.error(secondImage)

    // 2つ目の画像も消えることを確認
    expect(screen.queryByAltText(`Camera ${sampleCameras[1].id} thumbnail`)).not.toBeInTheDocument()

    // 複数のアバターが表示されていることを確認
    const avatars = container.querySelectorAll(".MuiAvatar-root")
    expect(avatars.length).toBeGreaterThanOrEqual(2)
  })
})
