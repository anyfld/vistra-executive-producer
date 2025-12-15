import { createConnectTransport } from "@connectrpc/connect-web"

export const transport = createConnectTransport({
  baseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080",
})
