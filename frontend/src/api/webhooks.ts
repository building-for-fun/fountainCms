import { api, apiVoid } from './client';

export interface WebhookMeta {
  id: string;
  name: string;
  url: string;
  events: string[];
  collections: string[];
  headers: Record<string, string> | null;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export async function fetchWebhooks(): Promise<WebhookMeta[]> {
  const res = await api<{ data: WebhookMeta[] }>('/webhooks');
  return res.data;
}

export async function createWebhook(body: {
  name: string;
  url: string;
  events: string[];
  collections?: string[];
  headers?: Record<string, string>;
}): Promise<{ secret: string; meta: WebhookMeta }> {
  return api('/webhooks', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function updateWebhook(
  id: string,
  body: {
    name?: string;
    url?: string;
    events?: string[];
    collections?: string[];
    headers?: Record<string, string> | null;
    enabled?: boolean;
    regenerateSecret?: boolean;
  }
): Promise<{ meta: WebhookMeta; secret?: string }> {
  return api(`/webhooks/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}

export async function deleteWebhook(id: string): Promise<void> {
  await apiVoid(`/webhooks/${id}`, { method: 'DELETE' });
}
