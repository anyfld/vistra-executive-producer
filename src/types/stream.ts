import { array, literal, number, object, optional, record, string, union } from "valibot"

export const CodecSchema = object({
  codec_name: string(),
  codec_type: union([literal("audio"), literal("video")]),
  channels: optional(number()),
  sample_rate: optional(number()),
})

export const ReceiverSchema = object({
  id: number(),
  codec: CodecSchema,
  bytes: number(),
  packets: number(),
})

export const ProducerSchema = object({
  id: number(),
  format_name: string(),
  protocol: string(),
  remote_addr: string(),
  user_agent: string(),
  medias: array(string()),
  receivers: array(ReceiverSchema),
  bytes_recv: number(),
})

export const StreamSchema = object({
  producers: optional(array(ProducerSchema)),
})

export const StreamsResponseSchema = optional(record(string(), optional(StreamSchema)))
