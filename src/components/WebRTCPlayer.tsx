import { useMemo } from "react"
import { Box } from "@mui/material"

interface WebRTCPlayerProps {
  name: string
}

export default function WebRTCPlayer({ name }: WebRTCPlayerProps) {
  const streamSrc = useMemo(
    () => `${import.meta.env.VITE_WEBRTC_BASE_URL}/webrtc.html?src=${name}&media=video+audio`,
    [name]
  )

  return (
    <Box
      component="iframe"
      src={streamSrc}
      sx={{ width: "100%", height: "100%", border: "none" }}
      allow="microphone; camera"
    />
  )
}
