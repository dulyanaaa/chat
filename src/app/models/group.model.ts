import { Channel } from './channel.model';

export class Group {
  constructor(
    public id: number,
    public name: string,
    public channels: number[],
    public adminIds: number[],
    public members: string[]
  ) {}
}
