import { useMemo } from "react"
import { useQuery } from "@connectrpc/connect-query"
import { Box } from "@mui/material"
import { getGlobalConfig } from "@/gen/proto/v1/service-ConfigService_connectquery"
import { create } from "@bufbuild/protobuf"
import { GetGlobalConfigRequestSchema } from "@/gen/proto/v1/service_pb"

interface WebRTCPlayerProps {
  name: string
}

export default function WebRTCPlayer({ name }: WebRTCPlayerProps) {
  const { data: globalConfig } = useQuery(getGlobalConfig, create(GetGlobalConfigRequestSchema, {}))

  const streamSrc = useMemo(() => {
    const template = globalConfig?.config?.webrtcUrlTemplate
    if (!template) {
      return ""
    }
    return template.replace("{webrtc_connection_name}", name)
  }, [globalConfig?.config?.webrtcUrlTemplate, name])

  if (!streamSrc) {
    return null
  }

  return (
    <Box
      component="iframe"
      src={streamSrc}
      sx={{ width: "100%", height: "100%", border: "none" }}
      allow="microphone; camera"
    />
  )
}
