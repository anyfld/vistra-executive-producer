import { parse } from "valibot"

import { StreamsResponseSchema } from "../types/stream"
import type { Camera } from "@/types/camera.ts"

/**
 * Fetches available streams from the backend API
 * @returns Promise containing the streams data
 */
export async function getStreams(): Promise<Camera[]> {
  const endpoint = `${import.meta.env.VITE_API_BASE_URL}/api/streams`
  const response = await fetch(endpoint)
  if (!response.ok) {
    throw new Error(`Failed to fetch streams: ${response.status} ${response.statusText}`)
  }

  const streamResponse = parse(StreamsResponseSchema, await response.json())
  if (!streamResponse) return []

  return Object.keys(streamResponse).map((stream) => {
    return {
      name: stream,
      type: "PTZ",
      mode: "Autonomous",
      connection: "Reachable",
      thumbnail: "",
    }
  }) satisfies Camera[]
}
