import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/Layouts/AdminLayout';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  fetchSchema,
  createContentType,
  updateContentType,
  deleteContentType,
  type CreateContentTypeInput,
  type ContentTypeFieldInput,
  type FieldType,
} from '../../api/schema';
import { listItems } from '../../api/content';
import { fetchMe } from '../../api/auth';
import { useToast } from '../../components/Toast';
import { LoadingSkeleton, ErrorState, EmptyState } from '../../components/states';
import type { AppSchema } from '../../types/contentTypes';

const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

const CONTENT_API_ENDPOINTS = [
  {
    method: 'GET',
    path: (c: string) => `/content/collections/${c}`,
    body: false,
    label: 'List entries',
  },
  {
    method: 'GET',
    path: (c: string) => `/content/collections/${c}/:id`,
    body: false,
    label: 'Get entry',
  },
  {
    method: 'POST',
    path: (c: string) => `/content/collections/${c}`,
    body: true,
    label: 'Create entry',
  },
  {
    method: 'PATCH',
    path: (c: string) => `/content/collections/${c}/:id`,
    body: true,
    label: 'Update entry',
  },
  {
    method: 'DELETE',
    path: (c: string) => `/content/collections/${c}/:id`,
    body: false,
    label: 'Delete entry',
  },
] as const;

function buildCurl(method: string, path: string, body?: boolean): string {
  const url = path.startsWith('http') ? path : `${API_BASE}${path}`;
  const parts = [`curl -X ${method} '${url}'`];
  if (body) {
    parts.push("-H 'Content-Type: application/json'");
    parts.push("-d '{}'");
  }
  parts.push("--cookie 'YOUR_SESSION_COOKIE'  # optional, if authenticated");
  return parts.join(' \\\n  ');
}

function copyCurlToClipboard(curl: string): Promise<void> {
  return navigator.clipboard.writeText(curl);
}

function canSchema(
  permissions: string[] = [],
  op: 'read' | 'create' | 'update' | 'delete'
): boolean {
  const required = `schema:${op}`;
  return (
    permissions.includes(required) ||
    permissions.includes('schema:*') ||
    permissions.includes('*:*')
  );
}

const FIELD_TYPES: FieldType[] = [
  'string',
  'text',
  'number',
  'boolean',
  'enum',
  'datetime',
  'relation',
  'media',
];

type SortOption = 'name-asc' | 'name-desc' | 'fields-asc' | 'fields-desc';
type ModalMode = 'create' | 'edit' | null;

const DataModels = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('name-asc');
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [deleteConfirmKey, setDeleteConfirmKey] = useState<string | null>(null);
  const [form, setForm] = useState<CreateContentTypeInput>({
    name: '',
    label: '',
    fields: [{ name: 'title', type: 'string', required: true }],
  });

  const { data: me } = useQuery({
    queryKey: ['me'],
    queryFn: fetchMe,
  });

  const permissions = me?.permissions ?? [];
  const canCreateSchema = canSchema(permissions, 'create');
  const canUpdateSchema = canSchema(permissions, 'update');
  const canDeleteSchema = canSchema(permissions, 'delete');

  const {
    data: schema,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['schema'],
    queryFn: fetchSchema,
  });

  const createMutation = useMutation({
    mutationFn: createContentType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schema'] });
      showToast('Content type created successfully', 'success');
      setModalMode(null);
      setForm({ name: '', label: '', fields: [{ name: 'title', type: 'string', required: true }] });
    },
    onError: (e: { message?: string }) => {
      showToast(e?.message ?? 'Failed to create content type', 'error');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ name, data }: { name: string; data: Parameters<typeof updateContentType>[1] }) =>
      updateContentType(name, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schema'] });
      showToast('Content type updated successfully', 'success');
      setModalMode(null);
      setEditingKey(null);
    },
    onError: (e: { message?: string }) => {
      showToast(e?.message ?? 'Failed to update content type', 'error');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteContentType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schema'] });
      showToast('Content type deleted', 'success');
      setDeleteConfirmKey(null);
    },
    onError: (e: { message?: string }) => {
      showToast(e?.message ?? 'Failed to delete content type', 'error');
    },
  });

  const collections = useMemo(() => {
    if (!schema) return [];
    let list = Object.entries((schema as AppSchema).collections).map(([key, col]) => ({
      key,
      label: col.label ?? key,
      fieldCount: Object.keys(col.fields).length,
    }));
    if (searchTerm) {
      list = list.filter(
        (c) =>
          c.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.label.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    list.sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return a.label.localeCompare(b.label);
        case 'name-desc':
          return b.label.localeCompare(a.label);
        case 'fields-asc':
          return a.fieldCount - b.fieldCount;
        case 'fields-desc':
          return b.fieldCount - a.fieldCount;
        default:
          return 0;
      }
    });
    return list;
  }, [schema, searchTerm, sortBy]);

  const openCreate = () => {
    setForm({
      name: '',
      label: '',
      fields: [{ name: 'title', type: 'string', required: true }],
    });
    setModalMode('create');
  };

  const openEdit = (key: string) => {
    const col = (schema as AppSchema)?.collections?.[key];
    if (!col) return;
    setEditingKey(key);
    setForm({
      name: key,
      label: col.label ?? '',
      fields: Object.entries(col.fields).map(([name, f]) => ({
        name,
        type: f.type as FieldType,
        required: f.required,
        default: f.default,
        options: f.options,
        readonly: f.readonly,
      })),
    });
    setModalMode('edit');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (modalMode === 'create') {
      createMutation.mutate({
        ...form,
        name: form.name.trim(),
        label: form.label?.trim() || undefined,
        fields: form.fields.filter((f) => f.name.trim()),
      });
    } else if (modalMode === 'edit' && editingKey) {
      updateMutation.mutate({
        name: editingKey,
        data: {
          label: form.label?.trim() || undefined,
          fields: form.fields
            .filter((f) => f.name.trim())
            .map((f) => ({
              ...f,
              name: f.name.trim(),
            })),
        },
      });
    }
  };

  const addField = () => {
    setForm((prev) => ({
      ...prev,
      fields: [...prev.fields, { name: '', type: 'string', required: false }],
    }));
  };

  const removeField = (index: number) => {
    setForm((prev) => ({
      ...prev,
      fields: prev.fields.filter((_, i) => i !== index),
    }));
  };

  const updateField = (index: number, patch: Partial<ContentTypeFieldInput>) => {
    setForm((prev) => ({
      ...prev,
      fields: prev.fields.map((f, i) => (i === index ? { ...f, ...patch } : f)),
    }));
  };

  return (
    <AdminLayout>
      <div className="p-6 md:p-10 max-w-7xl mx-auto">
        <div className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-text mb-2">Data modeling</h1>
            <p className="text-text-muted">
              Define data models (content types) and manage content entries
            </p>
          </div>
          {canCreateSchema && (
            <button
              type="button"
              onClick={openCreate}
              className="shrink-0 px-5 py-2.5 bg-primary text-white rounded-lg font-semibold hover:opacity-90 transition-all shadow-md"
            >
              + Add new data model
            </button>
          )}
        </div>

        {isLoading && (
          <LoadingSkeleton variant="cards" message="Loading data models..." cardCount={6} />
        )}

        {isError && (
          <ErrorState
            message={
              (error as { statusCode?: number })?.statusCode === 403 ||
              (error as { message?: string })?.message?.toLowerCase().includes('permission')
                ? "You don't have permission to view data models."
                : ((error as Error)?.message ?? 'Failed to load schema')
            }
            onRetry={() => refetch()}
          />
        )}

        {schema && Object.keys((schema as AppSchema).collections).length === 0 && (
          <EmptyState
            message="No data models yet"
            description='Click "Add new data model" to create your first content type.'
            icon="📦"
          />
        )}

        {schema && collections.length > 0 && (
          <>
            <div className="mb-8 flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search data models..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-surface text-text placeholder-text-muted transition-all"
                />
              </div>
              <div className="md:w-56">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-surface text-text transition-all"
                >
                  <option value="name-asc">Name (A–Z)</option>
                  <option value="name-desc">Name (Z–A)</option>
                  <option value="fields-asc">Fields (low → high)</option>
                  <option value="fields-desc">Fields (high → low)</option>
                </select>
              </div>
            </div>

            <div className="mb-4 text-sm text-text-muted">
              {collections.length} data model{collections.length !== 1 ? 's' : ''}
            </div>

            {collections.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-text-muted text-lg">No data models match your search</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {collections.map(({ key, label, fieldCount }) => (
                  <DataModelCard
                    key={key}
                    collectionKey={key}
                    label={label}
                    fieldCount={fieldCount}
                    onEdit={() => openEdit(key)}
                    onDelete={() => setDeleteConfirmKey(key)}
                    canEdit={canUpdateSchema}
                    canDelete={canDeleteSchema}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Create / Edit modal */}
      {modalMode && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setModalMode(null)}
        >
          <div
            className="bg-surface rounded-xl shadow-xl border border-border max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-border flex justify-between items-center">
              <h2 className="text-xl font-bold text-text">
                {modalMode === 'create' ? 'New content type' : 'Edit content type'}
              </h2>
              <button
                type="button"
                onClick={() => setModalMode(null)}
                className="text-text-muted hover:text-text text-2xl leading-none"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-text mb-1">Name (API key)</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      name: e.target.value.toLowerCase().replace(/\s+/g, '_'),
                    }))
                  }
                  placeholder="e.g. posts"
                  pattern="^[a-z][a-z0-9_]*$"
                  required
                  disabled={modalMode === 'edit'}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-text font-mono text-sm disabled:opacity-60"
                />
                <p className="text-xs text-text-muted mt-1">
                  Lowercase letters, numbers, underscores. Cannot change when editing.
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-text mb-1">Label</label>
                <input
                  type="text"
                  value={form.label ?? ''}
                  onChange={(e) => setForm((p) => ({ ...p, label: e.target.value }))}
                  placeholder="e.g. Blog Posts"
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-text"
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-text">Fields</label>
                  <button
                    type="button"
                    onClick={addField}
                    className="text-sm text-primary font-medium"
                  >
                    + Add field
                  </button>
                </div>
                <div className="space-y-3">
                  {form.fields.map((field, idx) => (
                    <div
                      key={idx}
                      className="flex flex-wrap items-start gap-2 p-3 border border-border rounded-lg bg-background"
                    >
                      <input
                        type="text"
                        placeholder="Field name"
                        value={field.name}
                        onChange={(e) => updateField(idx, { name: e.target.value })}
                        className="flex-1 min-w-[100px] px-3 py-2 border border-border rounded text-sm font-mono"
                      />
                      <select
                        value={field.type}
                        onChange={(e) => updateField(idx, { type: e.target.value as FieldType })}
                        className="px-3 py-2 border border-border rounded text-sm"
                      >
                        {FIELD_TYPES.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                      <label className="flex items-center gap-1 text-sm text-text-muted whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={field.required ?? false}
                          onChange={(e) => updateField(idx, { required: e.target.checked })}
                        />
                        Required
                      </label>
                      <button
                        type="button"
                        onClick={() => removeField(idx)}
                        className="text-error text-sm"
                        aria-label="Remove field"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setModalMode(null)}
                  className="px-4 py-2 border border-border rounded-lg text-text hover:bg-background"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="px-4 py-2 bg-primary text-white rounded-lg font-medium disabled:opacity-50"
                >
                  {modalMode === 'create' ? 'Create' : 'Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteConfirmKey && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setDeleteConfirmKey(null)}
        >
          <div
            className="bg-surface rounded-xl shadow-xl border border-border p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-text mb-2">Delete content type?</h3>
            <p className="text-text-muted text-sm mb-4">
              Deleting <strong>{deleteConfirmKey}</strong> will remove the type definition. You can
              only delete if there are no entries. This cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmKey(null)}
                className="px-4 py-2 border border-border rounded-lg text-text"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => deleteMutation.mutate(deleteConfirmKey)}
                disabled={deleteMutation.isPending}
                className="px-4 py-2 bg-error text-white rounded-lg font-medium disabled:opacity-50"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

function DataModelCard({
  collectionKey,
  label,
  fieldCount,
  onEdit,
  onDelete,
  canEdit,
  canDelete,
}: {
  collectionKey: string;
  label: string;
  fieldCount: number;
  onEdit: () => void;
  onDelete: () => void;
  canEdit: boolean;
  canDelete: boolean;
}) {
  const [apisExpanded, setApisExpanded] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { showToast } = useToast();

  const { data, isLoading } = useQuery({
    queryKey: ['content', collectionKey, 'meta'],
    queryFn: () => listItems(collectionKey),
    staleTime: 60_000,
  });
  const total = data?.meta?.total ?? null;

  const handleCopyCurl = (endpoint: (typeof CONTENT_API_ENDPOINTS)[number], id: string) => {
    const path = endpoint.path(collectionKey);
    const curl = buildCurl(endpoint.method, path, endpoint.body);
    copyCurlToClipboard(curl)
      .then(() => {
        setCopiedId(id);
        showToast('cURL copied to clipboard', 'success');
        setTimeout(() => setCopiedId(null), 2000);
      })
      .catch(() => showToast('Failed to copy', 'error'));
  };

  return (
    <div className="bg-surface rounded-xl border border-border shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-primary transition-all p-6 flex flex-col">
      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-2xl mb-4">
        📦
      </div>
      <div className="text-xl font-semibold text-text mb-1">{label}</div>
      <div className="font-mono text-sm text-text-muted mb-4">{collectionKey}</div>
      <div className="flex items-center gap-2 text-sm text-text-muted mb-4 flex-wrap">
        <span>
          🏷️ {fieldCount} field{fieldCount !== 1 ? 's' : ''}
        </span>
        {typeof total === 'number' && (
          <>
            <span className="text-border">•</span>
            <span>
              📝 {total} entr{total === 1 ? 'y' : 'ies'}
            </span>
          </>
        )}
        {isLoading && <span className="text-text-muted">…</span>}
      </div>

      {/* API endpoints */}
      <div className="mb-4">
        <button
          type="button"
          onClick={() => setApisExpanded((v) => !v)}
          className="flex items-center gap-2 text-sm font-medium text-primary hover:underline"
        >
          {apisExpanded ? '▼' : '▶'} APIs for this collection
        </button>
        {apisExpanded && (
          <div className="mt-2 pl-4 border-l-2 border-border space-y-2">
            {CONTENT_API_ENDPOINTS.map((ep) => {
              const path = ep.path(collectionKey);
              const id = `${collectionKey}-${ep.method}-${path}`;
              return (
                <div key={id} className="flex flex-wrap items-center gap-2 text-sm group">
                  <span
                    className={`font-mono font-semibold px-1.5 py-0.5 rounded text-xs ${
                      ep.method === 'GET'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : ep.method === 'POST'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                          : ep.method === 'PATCH'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                    }`}
                  >
                    {ep.method}
                  </span>
                  <span className="font-mono text-text-muted break-all">{path}</span>
                  <span className="text-text-muted text-xs">{ep.label}</span>
                  <button
                    type="button"
                    onClick={() => handleCopyCurl(ep, id)}
                    className="opacity-70 group-hover:opacity-100 text-primary text-xs font-medium hover:underline shrink-0"
                    title="Copy cURL"
                  >
                    {copiedId === id ? '✓ Copied' : 'Copy cURL'}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-auto pt-4 border-t border-border flex flex-col gap-2">
        <div className="flex flex-wrap gap-2">
          <Link
            to={`/admin/content/${collectionKey}`}
            className="text-primary font-medium hover:underline"
          >
            Manage content
          </Link>
          <Link
            to={`/admin/content/${collectionKey}/new`}
            className="text-text-muted hover:text-primary font-medium"
          >
            + Add entry
          </Link>
        </div>
        {(canEdit || canDelete) && (
          <div className="flex gap-2">
            {canEdit && (
              <button
                type="button"
                onClick={onEdit}
                className="text-sm text-text-muted hover:text-primary"
              >
                Edit type
              </button>
            )}
            {canDelete && (
              <button
                type="button"
                onClick={onDelete}
                className="text-sm text-error hover:underline"
              >
                Delete type
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default DataModels;
