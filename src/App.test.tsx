import { render } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { describe, it } from "vitest"

import App from "./App"

describe("App", () => {
  it("renders correctly", () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    )
  })
})
