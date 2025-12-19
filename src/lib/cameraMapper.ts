import type { Camera } from "@/types/camera"
import type { Camera as ProtoCamera } from "@/gen/proto/v1/cr_service_pb"
import {
  CameraMode as CameraModeEnum,
  CameraStatus as CameraStatusEnum,
} from "@/gen/proto/v1/cr_service_pb"

export function mapProtoCamera(protoCamera: ProtoCamera): Camera {
  const mode: Camera["mode"] =
    protoCamera.mode === CameraModeEnum.LIGHTWEIGHT
      ? "LightWeight"
      : protoCamera.mode === CameraModeEnum.AUTONOMOUS
        ? "Autonomous"
        : "Autonomous"

  const connection: Camera["connection"] =
    protoCamera.status === CameraStatusEnum.ONLINE ||
    protoCamera.status === CameraStatusEnum.STREAMING
      ? "Reachable"
      : "Unreachable"

  const type: Camera["type"] = (protoCamera.metadata["type"] as Camera["type"]) || "PTZ"

  return {
    id: protoCamera.id,
    name: protoCamera.name,
    type,
    mode,
    connection,
  }
}

export function mapProtoCameras(cameras?: ProtoCamera[]): Camera[] {
  if (!cameras) return []
  return cameras.map(mapProtoCamera)
}

