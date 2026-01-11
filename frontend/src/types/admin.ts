export type UserResponse =
  | { data: null }
  | { data: Record<string, unknown> }
  | { data: Array<Record<string, unknown>> }
  | Array<Record<string, unknown>>;
