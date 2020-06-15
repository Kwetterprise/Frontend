import { Guid } from "guid-typescript";

export class TimedData<T> {
  data: T[];
  ascending: boolean;
  next?: Guid;
}
