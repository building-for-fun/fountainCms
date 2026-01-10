import { api } from './client';

export function listItems(collection: string) {
  return api<{
    data: Array<{ id: string } & Record<string, unknown>>;
    meta: { total: number };
  }>(`/content/collections/${collection}`);
}

export function deleteItem(collection: string, id: string) {
  return api<{ success: boolean }>(`/content/collections/${collection}/${id}`, {
    method: 'DELETE',
  });
}
