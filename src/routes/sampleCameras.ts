type CameraType = "PTZ" | "Arm"
type Mode = "Autonomous" | "LightWeight"
type Connection = "Reachable" | "Unreachable"

export interface Camera {
  id: number
  thumbnail?: string
  type: CameraType
  mode: Mode
  connection: Connection
  hash: string
}

// サンプルデータ
export const sampleCameras: Camera[] = [
  {
    id: 1,
    thumbnail: "https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=PTZ+1",
    type: "PTZ",
    mode: "Autonomous",
    connection: "Reachable",
    hash: "1234567890",
  },
  {
    id: 2,
    thumbnail: "https://via.placeholder.com/400x300/2196F3/FFFFFF?text=Arm+2",
    type: "Arm",
    mode: "LightWeight",
    connection: "Reachable",
    hash: "1234567890",
  },
  {
    id: 3,
    thumbnail: "https://via.placeholder.com/400x300/FF9800/FFFFFF?text=PTZ+3",
    type: "PTZ",
    mode: "LightWeight",
    connection: "Unreachable",
    hash: "1234567890",
  },
  {
    id: 4,
    thumbnail: "https://via.placeholder.com/400x300/9C27B0/FFFFFF?text=Arm+4",
    type: "Arm",
    mode: "Autonomous",
    connection: "Reachable",
    hash: "1234567890",
  },
  {
    id: 5,
    thumbnail: "https://via.placeholder.com/400x300/00BCD4/FFFFFF?text=PTZ+5",
    type: "PTZ",
    mode: "Autonomous",
    connection: "Reachable",
    hash: "1234567890",
  },
  {
    id: 6,
    thumbnail: "https://via.placeholder.com/400x300/E91E63/FFFFFF?text=Arm+6",
    type: "Arm",
    mode: "LightWeight",
    connection: "Unreachable",
    hash: "1234567890",
  },
  {
    id: 7,
    thumbnail: "https://via.placeholder.com/400x300/8BC34A/FFFFFF?text=PTZ+7",
    type: "PTZ",
    mode: "LightWeight",
    connection: "Reachable",
    hash: "1234567890",
  },
  {
    id: 8,
    thumbnail: "https://via.placeholder.com/400x300/FF5722/FFFFFF?text=Arm+8",
    type: "Arm",
    mode: "Autonomous",
    connection: "Unreachable",
    hash: "1234567890",
  },
]
