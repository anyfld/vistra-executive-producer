type CameraType = "PTZ" | "Arm"
export type Mode = "Autonomous" | "LightWeight"
type Connection = "Reachable" | "Unreachable"

export type Camera = {
  name: string
  type: CameraType
  mode: Mode
  connection: Connection
  thumbnail: string
}
