type FieldSchema = {
  type: string;
  required?: boolean;
  default?: unknown;
};

type CollectionSchema = {
  label?: string;
  fields: Record<string, FieldSchema>;
};

export type AppSchema = {
  collections: Record<string, CollectionSchema>;
};
