import { api, apiVoid } from './client';

export interface ApiTokenMeta {
  id: string;
  name: string;
  permissions: string[];
  expiresAt: string | null;
  createdAt: string;
}

export async function fetchApiTokens(): Promise<ApiTokenMeta[]> {
  const res = await api<{ data: ApiTokenMeta[] }>('/api-tokens');
  return res.data;
}

export async function createApiToken(body: {
  name: string;
  permissions: string[];
  expiresAt?: string;
}): Promise<{ token: string; meta: ApiTokenMeta }> {
  return api('/api-tokens', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function revokeApiToken(id: string): Promise<void> {
  await apiVoid(`/api-tokens/${id}`, { method: 'DELETE' });
}
