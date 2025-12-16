import { render, screen } from "@testing-library/react"
import { ThemeProvider } from "@mui/material/styles"
import { describe, it, expect } from "vitest"

import { theme } from "@/theme"
import Home from "./Home"

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

    expect(screen.getByRole("heading", { name: /PTZ Camera Dashboard/i })).toBeInTheDocument()
  })

  it("renders camera cards", () => {
    const { container } = render(
      <ThemeProvider theme={theme}>
        <Home />
      </ThemeProvider>
    )

    // Paperコンポーネント（カメラカード）が8つ表示されているか確認
    const cameraCards = container.querySelectorAll(".MuiPaper-root")
    expect(cameraCards.length).toBe(8)
  })

  it("renders camera information for each card", () => {
    render(
      <ThemeProvider theme={theme}>
        <Home />
      </ThemeProvider>
    )

    // 最初のカメラの情報が表示されているか確認
    expect(screen.getByText(/ID: 1/i)).toBeInTheDocument()

    // 複数のカメラカードがあるため、getAllByTextを使用
    const typeLabels = screen.getAllByText(/Type:/i)
    expect(typeLabels.length).toBe(8)

    const modeLabels = screen.getAllByText(/Mode:/i)
    expect(modeLabels.length).toBe(8)

    const connectionLabels = screen.getAllByText(/Connection:/i)
    expect(connectionLabels.length).toBe(8)
  })

  it("renders all camera IDs", () => {
    render(
      <ThemeProvider theme={theme}>
        <Home />
      </ThemeProvider>
    )

    // 8つのカメラIDがすべて表示されているか確認
    for (let i = 1; i <= 8; i++) {
      expect(screen.getByText(new RegExp(`ID: ${i}`, "i"))).toBeInTheDocument()
    }
  })
})
