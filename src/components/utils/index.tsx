const getCurrentTimeUTC = () => {
  return new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');
}
import { CHANNEL_LIST } from "@/enums/channel"
import { getUnsentMessages } from "@/services/dexie"
import type { ChannelId, ErrMessageRecord, MessageEnum, UserId } from "@/types"

const findNameChannel = (id: ChannelId) => {
  return CHANNEL_LIST.find(channel => channel.id === id)?.name
}

const formatTime = (isoString: string) => {
  if (!isoString) return ''
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour12: false });
}

const combinedData = async (arrMessages: MessageEnum[], channel: ChannelId, user: UserId, init = false) => {
  if (arrMessages?.length <= 1) return arrMessages
  const reverseMessages = [...arrMessages].reverse()
  const msgInTime = {
    startTime: reverseMessages[0].datetime,
    endTime: reverseMessages[reverseMessages.length - 1].datetime
  }
  const unsentMsg = await getUnsentMessages({
    channel,
    user,
    startTime: msgInTime?.startTime,
    endTime: init ?  getCurrentTimeUTC() : msgInTime.endTime
  });
  return mergeMessages(reverseMessages, unsentMsg);
};

const mergeMessages = (
  server: MessageEnum[],
  unsent: ErrMessageRecord[]
): MessageEnum[] => {
  return [...server, ...unsent]
    .sort((a, b) => {
      const dateA = new Date(a.datetime).getTime();
      const dateB = new Date(b.datetime).getTime();
      return dateA - dateB;
    });
}

const debounce = (fn: (...args: any[]) => void, delay = 500) => {
  let timer: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

const getTodayKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

const findMessageNotError = (position: 'f'|'l', msgList: MessageEnum[] ) => {
    const LastSentMsg = position === 'f' ? msgList : [...msgList].reverse()
    return LastSentMsg.find((m) => !m.isError) || LastSentMsg[0];
}

export {
  findNameChannel,
  formatTime,
  mergeMessages,
  combinedData,
  debounce,
  getTodayKey,
  getCurrentTimeUTC,
  findMessageNotError
}