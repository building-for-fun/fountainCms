import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import AdminLayout from '../../components/Layouts/AdminLayout';
import { createItem, getItem, updateItem, listRevisions, restoreRevision } from '../../api/content';
import { fetchSchema } from '../../api/schema';
import { useToast } from '../../components/Toast';
import { LoadingSkeleton, ErrorState } from '../../components/states';
import { MediaPicker } from '../../components/MediaPicker/MediaPicker';

const ENTRY_LOCALE_OPTIONS = (import.meta.env.VITE_CONTENT_LOCALES as string | undefined)
  ?.split(',')
  .map((s) => s.trim())
  .filter(Boolean) ?? ['default'];

const ContentEntryDetail = () => {
  const { collection, id } = useParams<{ collection: string; id?: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const isEdit = !!id;
  const [formData, setFormData] = useState<Record<string, any>>({});

  const {
    data: schema,
    isLoading: schemaLoading,
    isError: schemaError,
  } = useQuery({
    queryKey: ['schema'],
    queryFn: fetchSchema,
  });

  const { data: existingData, isLoading: dataLoading } = useQuery({
    queryKey: ['content', collection, id],
    queryFn: () => getItem(collection!, id!),
    enabled: isEdit && !!collection && !!id,
  });

  const collectionSchema = schema?.collections?.[collection || ''];

  const entryData = (existingData as { data?: Record<string, unknown> })?.data ?? existingData;

  const { data: revisionsData } = useQuery({
    queryKey: ['content-revisions', collection, id],
    queryFn: () => listRevisions(collection!, id!),
    enabled: isEdit && !!collection && !!id,
  });

  const restoreMutation = useMutation({
    mutationFn: (version: number) => restoreRevision(collection!, id!, version),
    onSuccess: () => {
      showToast('Restored from revision', 'success');
      queryClient.invalidateQueries({ queryKey: ['content', collection, id] });
      queryClient.invalidateQueries({ queryKey: ['content-revisions', collection, id] });
    },
    onError: (error: Error) => {
      showToast(error?.message ?? 'Restore failed', 'error');
    },
  });

  useEffect(() => {
    if (entryData && typeof entryData === 'object') {
      setFormData({ ...entryData });
    }
  }, [existingData]);

  // Apply schema defaults and draft status for new entries
  useEffect(() => {
    if (isEdit || !collectionSchema) return;
    const defaults: Record<string, unknown> = {
      status: 'draft',
      locale: ENTRY_LOCALE_OPTIONS[0] ?? 'default',
    };
    for (const [fieldName, fieldConfig] of Object.entries(collectionSchema.fields)) {
      if (fieldConfig.default !== undefined && fieldConfig.default !== null) {
        defaults[fieldName] = fieldConfig.default;
      }
    }
    setFormData((prev) => ({ ...defaults, ...prev }));
  }, [isEdit, collectionSchema]);

  const mutation = useMutation({
    mutationFn: (payload: Record<string, any>) =>
      isEdit ? updateItem(collection!, id!, payload) : createItem(collection!, payload),
    onSuccess: () => {
      showToast(`Entry ${isEdit ? 'updated' : 'created'} successfully!`, 'success');
      setTimeout(() => navigate(`/admin/content/${collection}`), 1500);
    },
    onError: (error: Error) => {
      showToast(error?.message || 'Something went wrong', 'error');
    },
  });

  if (schemaLoading || (isEdit && dataLoading))
    return (
      <AdminLayout>
        <LoadingSkeleton variant="spinner" message="Loading..." />
      </AdminLayout>
    );
  if (schemaError || !collectionSchema)
    return (
      <AdminLayout>
        <ErrorState message="Could not load schema" />
      </AdminLayout>
    );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    fieldType?: string
  ) => {
    const { name, value } = e.target;
    const type = fieldType ?? (e.target as HTMLInputElement).type;
    let next: any = value;
    if (type === 'number') next = value === '' ? undefined : Number(value);
    else if (fieldType === 'boolean') next = value === 'true';
    setFormData((prev) => ({ ...prev, [name]: next }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { id: _id, published_at: _pubAt, publishedAt: _pubAt2, ...rest } = formData;
    const payload: Record<string, unknown> = { ...rest };
    if (
      payload.translation_group_id === '' ||
      payload.translation_group_id === undefined ||
      payload.translation_group_id === null
    ) {
      delete payload.translation_group_id;
    }
    mutation.mutate(payload);
  };

  const status = formData.status === 'published' ? 'published' : 'draft';
  const publishedAt = formData.published_at ?? formData.publishedAt ?? null;

  return (
    <AdminLayout>
      <div className="p-6 md:p-10 max-w-7xl mx-auto">
        <div className="mb-10">
          <button
            onClick={() => navigate(`/admin/content/${collection}`)}
            className="text-text-muted hover:text-text flex items-center gap-2 mb-6 transition-colors group"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to
            Entries
          </button>
          <h1 className="text-3xl font-bold text-text">
            {isEdit ? 'Edit' : 'Create'} {collectionSchema.label}
          </h1>
          <p className="text-text-muted mt-2">
            {isEdit ? 'Update existing content entry' : 'Add a new entry to this collection'}
          </p>
        </div>

        <div className="max-w-3xl mx-auto bg-surface p-8 md:p-12 rounded-2xl shadow-xl border border-border">
          <form onSubmit={handleSubmit}>
            {Object.entries(collectionSchema.fields).map(
              ([fieldName, fieldConfig]: [string, any]) => (
                <div key={fieldName} className="mb-8">
                  <label className="block text-sm font-semibold text-text mb-2 capitalize">
                    {fieldName}
                  </label>
                  {fieldConfig.type === 'boolean' ? (
                    <select
                      name={fieldName}
                      value={
                        formData[fieldName] === true || formData[fieldName] === 'true'
                          ? 'true'
                          : 'false'
                      }
                      onChange={(e) => handleInputChange(e, 'boolean')}
                      className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-text transition-all"
                    >
                      <option value="false">No</option>
                      <option value="true">Yes</option>
                    </select>
                  ) : fieldConfig.type === 'enum' && Array.isArray(fieldConfig.options) ? (
                    <select
                      name={fieldName}
                      value={formData[fieldName] ?? ''}
                      onChange={(e) => handleInputChange(e)}
                      className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-text transition-all"
                    >
                      <option value="">Select...</option>
                      {fieldConfig.options.map((opt: string) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : fieldConfig.type === 'media' ? (
                    <MediaPicker
                      value={formData[fieldName] ?? null}
                      onChange={(mediaId) =>
                        setFormData((prev) => ({ ...prev, [fieldName]: mediaId }))
                      }
                    />
                  ) : fieldConfig.type === 'text' && fieldConfig.variant === 'long' ? (
                    <textarea
                      name={fieldName}
                      value={formData[fieldName] || ''}
                      onChange={(e) => handleInputChange(e)}
                      className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-text placeholder-text-muted transition-all"
                      rows={5}
                      placeholder={`Enter ${fieldName}...`}
                    />
                  ) : (
                    <input
                      type={fieldConfig.type === 'number' ? 'number' : 'text'}
                      name={fieldName}
                      value={formData[fieldName] ?? ''}
                      onChange={(e) => handleInputChange(e)}
                      className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-text placeholder-text-muted transition-all"
                      placeholder={`Enter ${fieldName}...`}
                    />
                  )}
                </div>
              )
            )}

            <div className="mb-8 pt-6 border-t border-border">
              <label className="block text-sm font-semibold text-text mb-2">Locale</label>
              <select
                value={(formData.locale as string) ?? ENTRY_LOCALE_OPTIONS[0] ?? 'default'}
                onChange={(e) => setFormData((prev) => ({ ...prev, locale: e.target.value }))}
                className="w-full max-w-xs px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-text"
              >
                {ENTRY_LOCALE_OPTIONS.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
              <p className="text-xs text-text-muted mt-2">
                Link translations by reusing the translation group ID from another entry (optional).
              </p>
            </div>

            <div className="mb-8">
              <label className="block text-sm font-semibold text-text mb-2">
                Translation group ID
              </label>
              <input
                type="text"
                value={(formData.translation_group_id as string) ?? ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    translation_group_id: e.target.value.trim() || undefined,
                  }))
                }
                readOnly={isEdit}
                placeholder={isEdit ? '' : 'Paste UUID from an existing entry to pair locales'}
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-text font-mono text-sm read-only:bg-background/70 read-only:cursor-not-allowed"
              />
            </div>

            <div className="mb-8 pt-6 border-t border-border">
              <label className="block text-sm font-semibold text-text mb-2">Status</label>
              <select
                value={status}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    status: e.target.value as 'draft' | 'published',
                  }))
                }
                className="w-full max-w-xs px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-text"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
              {status === 'published' && publishedAt && (
                <p className="text-sm text-text-muted mt-2">
                  Published on {new Date(publishedAt).toLocaleString()}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-4 mt-10 pt-8 border-t border-border">
              <button
                type="button"
                onClick={() => navigate(`/admin/content/${collection}`)}
                className="px-6 py-2.5 bg-surface text-text border border-border rounded-lg font-semibold hover:bg-background transition-all shadow-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={mutation.isPending}
                className="px-6 py-2.5 bg-primary text-white rounded-lg font-semibold hover:opacity-90 transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {mutation.isPending ? 'Saving...' : isEdit ? 'Update Entry' : 'Create Entry'}
              </button>
            </div>
          </form>
        </div>

        {isEdit && revisionsData?.data && revisionsData.data.length > 0 && (
          <div className="max-w-3xl mx-auto mt-10 bg-surface p-8 rounded-2xl shadow-lg border border-border">
            <h2 className="text-xl font-bold text-text mb-2">Revision history</h2>
            <p className="text-sm text-text-muted mb-6">
              Each update saves a snapshot. Restoring rolls content back and keeps the prior state
              in history.
            </p>
            <ul className="divide-y divide-border border border-border rounded-lg overflow-hidden">
              {revisionsData.data.map((r) => (
                <li
                  key={r.version}
                  className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-background"
                >
                  <div className="text-sm">
                    <span className="font-mono font-semibold text-text">v{r.version}</span>
                    <span className="text-text-muted mx-2">·</span>
                    <span className="text-text-muted">
                      {new Date(r.createdAt).toLocaleString()}
                    </span>
                    <span className="text-text-muted mx-2">·</span>
                    <span className="text-text">{r.locale}</span>
                    <span className="text-text-muted mx-2">·</span>
                    <span className="capitalize">{r.status}</span>
                  </div>
                  <button
                    type="button"
                    disabled={restoreMutation.isPending}
                    onClick={() => {
                      if (
                        window.confirm(
                          `Restore version ${r.version}? Current content will be snapshotted first.`
                        )
                      ) {
                        restoreMutation.mutate(r.version);
                      }
                    }}
                    className="text-sm px-3 py-1.5 rounded-lg border border-border text-text hover:bg-surface disabled:opacity-50"
                  >
                    Restore
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ContentEntryDetail;
