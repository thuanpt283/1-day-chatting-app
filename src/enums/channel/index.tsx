import { type ChannelId } from "@/types";

const CHANNELS = {
  GENERAL: "General",
  TECHNOLOGY: "Technology",
  LGTM: "LGTM",
} as const;

const CHANNEL_LIST: { id: ChannelId; name: string }[] = [
  {
    id: CHANNELS.GENERAL,
    name: "General Channel",
  },
  {
    id: CHANNELS.TECHNOLOGY,
    name: "Technology Channel",
  },
  {
    id: CHANNELS.LGTM,
    name: "LGTM Channel",
  },
]

export {
    CHANNELS,
    CHANNEL_LIST
}