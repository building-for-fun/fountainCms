import { api } from './client';

export function listItems(collection: string) {
  return api<{
    data: Array<{ id: string } & Record<string, unknown>>;
    meta: { total: number };
  }>(`/api/content/collections/${collection}`);
}

export function getItem(collection: string, id: string) {
  return api<{ id: string } & Record<string, unknown>>(
    `/api/content/collections/${collection}/${id}`
  );
}

export function createItem(collection: string, payload: Record<string, unknown>) {
  return api<{ id: string } & Record<string, unknown>>(`/api/content/collections/${collection}`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function updateItem(collection: string, id: string, payload: Record<string, unknown>) {
  return api<{ id: string } & Record<string, unknown>>(
    `/api/content/collections/${collection}/${id}`,
    {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }
  );
}

export function deleteItem(collection: string, id: string) {
  return api<{ success: boolean }>(`/api/content/collections/${collection}/${id}`, {
    method: 'DELETE',
  });
}
