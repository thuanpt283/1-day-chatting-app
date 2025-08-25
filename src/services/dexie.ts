// Lấy messages trong khoảng thời gian [start, end] (ISO string)
export async function getMessagesInRange(start: string, end: string) {
  return db.messages
    .where('datetime')
    .between(start, end, true, true)
    .toArray();
}
import type { ChannelId, ErrMessageRecord, UserId } from '@/types';
import Dexie from 'dexie';
import type { Table } from 'dexie';


export class MessageDB extends Dexie {
  messages!: Table<ErrMessageRecord, number>;
  constructor() {
    super('messageStore');
    this.version(1).stores({
      messages: '++id, messageId, userId, text, datetime, channel',
      drafts: 'userId'
    });
  }
}


export const db = new MessageDB();

export async function getUnsentMessages({  channel, user, startTime, endTime } :
  {
    channel: ChannelId,
    user: UserId,
    startTime?: string,
    endTime?: string
  }) {
  let query = db.messages
    .where("channel")
    .equals(channel)
    .and(msg => msg.userId === user);
  if (startTime && endTime) {
    query = query.and(msg => msg.datetime >= startTime && msg.datetime <= endTime);
  }
  return await query.toArray();
}
