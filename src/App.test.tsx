import { render } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { describe, it, vi } from "vitest"

import App from "./App"

vi.mock("@/lib/streams", () => ({
  getStreams: vi.fn(() => Promise.resolve([])),
}))

describe("App", () => {
  it("renders correctly", () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    )
  })
})
