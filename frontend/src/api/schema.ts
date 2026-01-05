import { AppSchema } from '../types/contentTypes';
import { api } from './client';

export async function fetchSchema(): Promise<AppSchema> {
  return api<AppSchema>('/schema');
}
