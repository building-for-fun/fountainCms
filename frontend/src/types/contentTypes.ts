type FieldSchema = {
  type: string;
  required?: boolean;
  default?: unknown;
  options?: string[];
  relationCollection?: string;
  readonly?: boolean;
};

type CollectionSchema = {
  label?: string;
  fields: Record<string, FieldSchema>;
};

export type AppSchema = {
  collections: Record<string, CollectionSchema>;
};
