import { api } from './client';

export type ContentListMeta = {
  total: number;
  limit: number | null;
  offset: number;
  sort: string;
};

export function listItems(
  collection: string,
  status?: 'draft' | 'published',
  listQuery?: {
    locale?: string;
    limit?: number;
    offset?: number;
    sort?: string;
    /** JSON.stringify(filterObject) */
    filter?: string;
    fields?: string;
  }
) {
  const sp = new URLSearchParams();
  if (status) sp.set('status', status);
  if (listQuery?.locale) sp.set('locale', listQuery.locale);
  if (listQuery?.limit != null) sp.set('limit', String(listQuery.limit));
  if (listQuery?.offset != null) sp.set('offset', String(listQuery.offset));
  if (listQuery?.sort) sp.set('sort', listQuery.sort);
  if (listQuery?.filter) sp.set('filter', listQuery.filter);
  if (listQuery?.fields) sp.set('fields', listQuery.fields);
  const qs = sp.toString();
  return api<{
    data: Array<
      { id: string; status?: string; published_at?: string | null } & Record<string, unknown>
    >;
    meta: ContentListMeta;
  }>(`/content/collections/${collection}${qs ? `?${qs}` : ''}`);
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

export type ContentRevisionSummary = {
  version: number;
  createdAt: string;
  createdById: string | null;
  locale: string;
  status: string;
};

export function listRevisions(collection: string, id: string) {
  return api<{ data: ContentRevisionSummary[] }>(
    `/content/collections/${collection}/${id}/revisions`
  );
}

export function restoreRevision(collection: string, id: string, version: number) {
  return api<{ data: Record<string, unknown> }>(
    `/content/collections/${collection}/${id}/revisions/${version}/restore`,
    { method: 'PATCH' }
  );
}
