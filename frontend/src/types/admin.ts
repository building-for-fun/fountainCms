export type UserResponse =
  | { data: null }
  | { data: Record<string, unknown> }
  | { data: Array<Record<string, unknown>> }
  | Array<Record<string, unknown>>;

export type AuditLog = {
  id: string;
  action: string;
  entity: string;
  entityId?: string;
  collection?: string;
  createdAt: string;
  user?: {
    id: string;
    username: string;
    email: string;
  };
};
