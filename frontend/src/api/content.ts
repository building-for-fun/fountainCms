import { api } from './client';

export function listItems(collection: string, status?: 'draft' | 'published') {
  const qs = status ? `?status=${status}` : '';
  return api<{
    data: Array<
      { id: string; status?: string; published_at?: string | null } & Record<string, unknown>
    >;
    meta: { total: number };
  }>(`/content/collections/${collection}${qs}`);
}

export function getItem(collection: string, id: string) {
  return api<{ id: string } & Record<string, unknown>>(`/content/collections/${collection}/${id}`);
}

export function createItem(collection: string, payload: Record<string, unknown>) {
  return api<{ id: string } & Record<string, unknown>>(`/content/collections/${collection}`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function updateItem(collection: string, id: string, payload: Record<string, unknown>) {
  return api<{ id: string } & Record<string, unknown>>(`/content/collections/${collection}/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export function deleteItem(collection: string, id: string) {
  return api<{ success: boolean }>(`/content/collections/${collection}/${id}`, {
    method: 'DELETE',
  });
}
