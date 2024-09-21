export class Chat {
  messageId: number;
  userId: number;
  channelId: number;
  content: string;
  timestamp: Date;

  constructor(
    messageId: number,
    userId: number,
    channelId: number,
    content: string,
    timestamp: Date
  ) {
    this.messageId = messageId;
    this.userId = userId;
    this.channelId = channelId;
    this.content = content;
    this.timestamp = timestamp;
  }
}

// export class Chat {
//   constructor(
//     messageId: number,
//     userId: number,
//     timestamp: Date,
//     channelId: number,
//     content: string
//   ) {}
// }

// export interface Channel {
//   ; // Array of user IDs
// }
