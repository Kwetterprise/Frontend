import { Guid } from "guid-typescript";

export class UserInfo {
  id: Guid;
  username: string;
  password: string;
  email: string;
  bio: string;
}
