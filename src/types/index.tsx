import type { CHANNELS } from "@/enums/channel";

export type UserId = 'Sam' | 'Russell' | 'Joyse'



export type ChannelId = typeof CHANNELS[keyof typeof CHANNELS];

export interface MessageEnum  {
    messageId: string,
    text: string,
    datetime: string,
    userId: UserId,
    isError?: boolean
}

export interface ErrMessageRecord  extends MessageEnum {
  id?: number;
  channel: string;
}

export interface InfoChat {
    firstMsg: MessageEnum | null;
    lastMsg: MessageEnum | null;
}