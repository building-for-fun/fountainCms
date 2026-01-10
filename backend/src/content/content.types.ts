export interface ContentItem {
  id: string;
  collection: string;
  data: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface ListResponse<T> {
  data: T[];
  meta: {
    total: number;
  };
}

export interface SingleResponse<T> {
  data: T;
}
