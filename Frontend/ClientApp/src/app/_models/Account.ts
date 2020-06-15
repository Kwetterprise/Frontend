import { Guid } from "guid-typescript";

export class Account {
  id: Guid;
  username: string;
  bio: string;
  profilePicture: number[];
  role: Role;

  token: string;
}

export enum Role {
  User,
  Moderator,
  Administrator,
}

export class AccountWithToken extends Account {
  token: string;
}
