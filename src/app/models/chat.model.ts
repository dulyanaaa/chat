import { User } from './user.model';

export class Chat {
  constructor(
    public messageId: number,
    public userId: number,
    public username: string,
    public channelId: number,
    public content: string,
    public timestamp: Date
  ) {}
}

// export class Chat {
//   messageId: number;
//   userId: number;
//   channelId: number;
//   content: string;
//   timestamp: Date;
//   username: string;

//   constructor(
//     messageId: number,
//     userId: number,
//     username: string,
//     channelId: number,
//     content: string,
//     timestamp: Date
//   ) {
//     this.messageId = messageId;
//     this.userId = userId;
//     this.channelId = channelId;
//     this.content = content;
//     this.timestamp = timestamp;
//     this.username = username;
//   }
// }

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
