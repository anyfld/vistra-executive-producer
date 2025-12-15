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

  it("renders MUI Grid container", () => {
    const { container } = render(
      <ThemeProvider theme={theme}>
        <Home />
      </ThemeProvider>
    )

    // MUI Gridコンテナがレンダリングされているか確認
    const gridContainer = container.querySelector(".MuiGrid-container")
    expect(gridContainer).toBeInTheDocument()
  })

  it("renders MUI Grid items", () => {
    const { container } = render(
      <ThemeProvider theme={theme}>
        <Home />
      </ThemeProvider>
    )

    const gridItems = container.querySelectorAll(".MuiGrid-root")
    expect(gridItems.length).toBeGreaterThan(0)
  })

  it("renders Home heading", () => {
    render(
      <ThemeProvider theme={theme}>
        <Home />
      </ThemeProvider>
    )

    expect(screen.getByRole("heading", { name: /home/i })).toBeInTheDocument()
  })
})
