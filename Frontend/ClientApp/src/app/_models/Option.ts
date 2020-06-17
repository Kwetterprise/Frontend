export class SimpleOption {
  error: string;
  hasFailed: boolean;
}

export class Option<T> extends SimpleOption {
  value: T;
}
