import { parse } from "valibot"

import { StreamsResponseSchema } from "../types/stream"
import type { Camera } from "@/types/camera"

const dummyData: Camera[] = [
  {
    name: "Sample Camera 1",
    type: "PTZ",
    mode: "Autonomous",
    connection: "Reachable",
  },
  {
    name: "Sample Camera 2",
    type: "PTZ",
    mode: "Autonomous",
    connection: "Reachable",
  },
]

/**
 * Fetches available streams from the backend API
 * @returns Promise containing the streams data
 */
export async function getStreams(): Promise<Camera[]> {
  try {
    const endpoint = `${import.meta.env.VITE_API_BASE_URL}/api/streams`
    const response = await fetch(endpoint)
    if (!response.ok) {
      throw new Error(`Failed to fetch streams: ${response.status} ${response.statusText}`)
    }

    const streamResponse = parse(StreamsResponseSchema, await response.json())
    if (!streamResponse || Object.keys(streamResponse).length === 0) {
      throw new Error("No streams available")
    }

    return Object.keys(streamResponse).map((stream) => {
      return {
        name: stream,
        type: "PTZ",
        mode: "Autonomous",
        connection: "Reachable",
        thumbnail: "",
      }
    }) satisfies Camera[]
  } catch (error) {
    console.error("Error fetching streams:", error)
    return dummyData
  }
}
