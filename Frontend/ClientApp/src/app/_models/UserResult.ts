import { Guid } from "guid-typescript";

export class UserResult {
  id: Guid;
  username: string;
  token: string;
  bio: string;
}
