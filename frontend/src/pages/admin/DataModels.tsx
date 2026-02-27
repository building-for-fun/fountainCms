import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/Layouts/AdminLayout';
import { useQuery } from '@tanstack/react-query';
import { fetchSchema } from '../../api/schema';
import { listItems } from '../../api/content';
import { LoadingState, ErrorState, EmptyState } from '../../components/states';
import type { AppSchema } from '../../types/contentTypes';

type SortOption = 'name-asc' | 'name-desc' | 'fields-asc' | 'fields-desc';

const DataModels = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('name-asc');
  const [toast, setToast] = useState<{ message: string } | null>(null);

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

  const handleAddDataModel = () => {
    setToast({
      message:
        'Add new data model (content type) via API is coming soon. Use the backend seed or API to create types for now.',
    });
    setTimeout(() => setToast(null), 5000);
  };

  return (
    <AdminLayout>
      <div className="p-6 md:p-10 max-w-7xl mx-auto">
        {toast && (
          <div className="fixed bottom-8 right-8 p-4 rounded-xl shadow-2xl z-50 bg-primary text-white max-w-md animate-slide-in border border-white/10">
            {toast.message}
          </div>
        )}

        <div className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-text mb-2">Data modeling</h1>
            <p className="text-text-muted">
              Define data models (content types) and manage content entries
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddDataModel}
            className="shrink-0 px-5 py-2.5 bg-primary text-white rounded-lg font-semibold hover:opacity-90 transition-all shadow-md"
          >
            + Add new data model
          </button>
        </div>

        {isLoading && <LoadingState message="Loading data models..." />}

        {isError && (
          <ErrorState
            message={(error as Error)?.message ?? 'Failed to load schema'}
            onRetry={() => refetch()}
          />
        )}

        {schema && Object.keys((schema as AppSchema).collections).length === 0 && (
          <EmptyState
            message="No data models yet"
            description="Add a content type (e.g. via backend seed or API), or use “Add new data model” when available."
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
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
};

function DataModelCard({
  collectionKey,
  label,
  fieldCount,
}: {
  collectionKey: string;
  label: string;
  fieldCount: number;
}) {
  const { data, isLoading } = useQuery({
    queryKey: ['content', collectionKey, 'meta'],
    queryFn: () => listItems(collectionKey),
    staleTime: 60_000,
  });
  const total = data?.meta?.total ?? null;

  return (
    <div className="bg-surface rounded-xl border border-border shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-primary transition-all p-6 flex flex-col">
      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-2xl mb-4">
        📦
      </div>
      <div className="text-xl font-semibold text-text mb-1">{label}</div>
      <div className="font-mono text-sm text-text-muted mb-4">{collectionKey}</div>
      <div className="flex items-center gap-2 text-sm text-text-muted mb-6 flex-wrap">
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
      <div className="mt-auto pt-4 border-t border-border flex flex-col sm:flex-row gap-2">
        <Link
          to={`/admin/content/${collectionKey}`}
          className="flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all"
        >
          Manage content
        </Link>
        <Link
          to={`/admin/content/${collectionKey}/new`}
          className="flex items-center gap-2 text-text-muted hover:text-primary font-medium transition-all"
        >
          + Add entry
        </Link>
      </div>
    </div>
  );
}

export default DataModels;
