import { Guid } from "guid-typescript";

export class Tweet {
  content: string;
  author: Author;
  createdOn: Date;
}

export class Author {
  id: Guid;
  username: string;
  profilePicture: number[];
}

export class PostTweetRequest {
  constructor(public author: Guid, public content: string, public parent: Guid) {

  }
}
