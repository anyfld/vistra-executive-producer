import { render } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { describe, it, vi } from "vitest"

import App from "./App"

vi.mock("@connectrpc/connect-query", () => ({
  useQuery: vi.fn(() => ({ data: { cameras: [] }, isLoading: false, error: null })),
}))
vi.mock("@/lib/cameraMapper", () => ({
  mapProtoCameras: vi.fn(() => []),
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
