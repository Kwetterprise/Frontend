import { Guid } from "guid-typescript";

export class Account {
  id: Guid;
  username: string;
  bio: string;
  profilePicture: number[];

  token: string;
}

export class AccountWithToken extends Account {
  token: string;
}
