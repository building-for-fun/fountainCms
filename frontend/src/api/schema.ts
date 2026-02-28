import { AppSchema } from '../types/contentTypes';
import { api } from './client';

export async function fetchSchema(): Promise<AppSchema> {
  return api<AppSchema>('/schema');
}

export type FieldType = 'string' | 'text' | 'number' | 'boolean' | 'enum' | 'datetime' | 'relation';

export interface ContentTypeFieldInput {
  name: string;
  type: FieldType;
  required?: boolean;
  default?: unknown;
  options?: string[];
  readonly?: boolean;
}

export interface CreateContentTypeInput {
  name: string;
  label?: string;
  fields: ContentTypeFieldInput[];
}

export interface UpdateContentTypeInput {
  label?: string;
  fields?: ContentTypeFieldInput[];
}

export async function createContentType(data: CreateContentTypeInput): Promise<{ name: string }> {
  return api<{ name: string }>('/schema', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateContentType(
  name: string,
  data: UpdateContentTypeInput
): Promise<{ name: string }> {
  return api<{ name: string }>(`/schema/${encodeURIComponent(name)}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function deleteContentType(name: string): Promise<{ name: string }> {
  return api<{ name: string }>(`/schema/${encodeURIComponent(name)}`, {
    method: 'DELETE',
  });
}
