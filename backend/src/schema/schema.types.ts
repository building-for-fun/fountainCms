export type FieldType =
  | 'string'
  | 'text'
  | 'number'
  | 'boolean'
  | 'enum'
  | 'datetime'
  | 'relation'
  | 'media';

export interface FieldSchema {
  type: FieldType;
  required?: boolean;
  default?: any;
  /** Enum choices when `type` is `enum`. */
  options?: string[];
  /** Target content type name when `type` is `relation` (stored in DB options JSON). */
  relationCollection?: string;
  readonly?: boolean;
}

export interface CollectionSchema {
  label?: string;
  fields: Record<string, FieldSchema>;
}

export interface AppSchema {
  collections: Record<string, CollectionSchema>;
}
