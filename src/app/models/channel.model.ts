import { User } from './user.model';

export class Channel {
  constructor(
    public id: number,
    public name: string,
    public groupId: number,
    public members: number[] | null
  ) {}
}
