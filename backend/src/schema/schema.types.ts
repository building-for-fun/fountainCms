export type FieldType =
  | 'string'
  | 'text'
  | 'number'
  | 'boolean'
  | 'enum'
  | 'datetime'
  | 'relation';

export interface FieldSchema {
  type: FieldType;
  required?: boolean;
  default?: any;
  options?: string[];
  readonly?: boolean;
}

export interface CollectionSchema {
  label?: string;
  fields: Record<string, FieldSchema>;
}

export interface AppSchema {
  collections: Record<string, CollectionSchema>;
}
