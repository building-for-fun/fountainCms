import React, { useState, useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import AdminLayout from '../../components/Layouts/AdminLayout';
import { deleteItem, listItems } from '../../api/content';
import { fetchSchema } from '../../api/schema';
import LoadingState from '../../components/LoadingState';
import ErrorState from '../../components/ErrorState';
import EmptyState from '../../components/EmptyState';

const ContentEntries = () => {
  const { collection } = useParams<{ collection: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  if (!collection) {
    return (
      <AdminLayout>
        <ErrorState message="Invalid collection" />
      </AdminLayout>
    );
  }

  const { data: schema, isLoading: schemaLoading } = useQuery({
    queryKey: ['schema'],
    queryFn: fetchSchema,
  });

  const collectionSchema = schema?.collections?.[collection];

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['content', collection],
    queryFn: () => listItems(collection),
    enabled: !!collection,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteItem(collection, id),
    onSuccess: () => {
      setToast({ message: 'Entry deleted successfully', type: 'success' });
      queryClient.invalidateQueries({ queryKey: ['content', collection] });
    },
    onError: () => {
      setToast({ message: 'Failed to delete entry', type: 'error' });
    },
  });

  const filteredEntries = useMemo(() => {
    if (!data?.data) return [];
    if (!searchTerm) return data.data;

    return data.data.filter((item) =>
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [data, searchTerm]);

  if (isLoading || schemaLoading)
    return (
      <AdminLayout>
        <LoadingState />
      </AdminLayout>
    );
  if (isError)
    return (
      <AdminLayout>
        <ErrorState onRetry={() => refetch()} />
      </AdminLayout>
    );

  // Extract ternary rendering logic
  const renderContent = () => {
    if (!collectionSchema) {
      return <ErrorState message="Unknown collection schema" />;
    }

    if (filteredEntries.length === 0) {
      return (
        <EmptyState
          message="No entries found"
          description={
            searchTerm ? 'Try adjusting your search' : 'Start by creating your first entry'
          }
        />
      );
    }

    return (
      <div className="bg-surface rounded-2xl shadow-md overflow-hidden border border-border">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-background">
              <th className="px-6 py-4 font-semibold text-text text-sm uppercase tracking-wider border-b border-border">
                ID
              </th>
              {Object.keys(collectionSchema.fields).map((field) => (
                <th
                  key={field}
                  className="px-6 py-4 font-semibold text-text text-sm uppercase tracking-wider border-b border-border"
                >
                  {field}
                </th>
              ))}
              <th className="px-6 py-4 font-semibold text-text text-sm uppercase tracking-wider border-b border-border text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredEntries.map((item) => (
              <tr
                key={item.id}
                className="border-b border-border hover:bg-background/50 transition-colors"
              >
                <td className="px-6 py-4 font-mono text-xs text-text-muted">
                  {item.id.substring(0, 8)}...
                </td>

                {Object.keys(collectionSchema.fields).map((field) => (
                  <td key={field} className="px-6 py-4 text-text">
                    <div className="max-w-xs truncate">{String(item[field] ?? '—')}</div>
                  </td>
                ))}

                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Link
                      to={`/admin/content/${collection}/${item.id}`}
                      className="p-2 rounded-lg text-primary hover:bg-primary/10 transition-all"
                      title="Edit"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M11 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-5M16.138 3.562a2 2 0 112.828 2.828L10.828 15.343l-4.243 1.06 1.06-4.243 8.323-8.324z"
                        />
                      </svg>
                    </Link>
                    <button
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this entry?')) {
                          deleteMutation.mutate(item.id);
                        }
                      }}
                      className="p-2 rounded-lg text-error hover:bg-error/10 transition-all"
                      title="Delete"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <AdminLayout>
      {toast && (
        <div
          className={`fixed bottom-8 right-8 p-4 rounded-xl shadow-2xl z-50 ${
            toast.type === 'success' ? 'bg-green-600' : 'bg-error'
          } text-white animate-slide-in flex items-center gap-3 min-w-[300px] border border-white/10`}
        >
          <div className="flex-1 font-medium">{toast.message}</div>
          <button onClick={() => setToast(null)} className="text-white/80 hover:text-white">
            ✕
          </button>
        </div>
      )}

      <div className="p-6 md:p-10 max-w-7xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => navigate('/admin/content-types')}
            className="text-text-muted hover:text-text flex items-center gap-2 mb-6 transition-colors group"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to
            Content Types
          </button>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-text">
                {collectionSchema?.label ?? collection}
              </h1>
              <p className="text-text-muted mt-1">
                Manage entries for {collectionSchema?.label ?? collection}
              </p>
            </div>

            <Link
              to={`/admin/content/${collection}/new`}
              className="inline-flex items-center px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:opacity-90 transition-all shadow-md active:scale-95"
            >
              <span className="mr-2 text-xl">+</span> Create Entry
            </Link>
          </div>
        </div>

        <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <input
            type="text"
            placeholder="Search entries..."
            className="w-full max-w-md px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-surface text-text placeholder-text-muted transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="text-sm text-text-muted">
            Showing {filteredEntries.length} of {data?.data.length ?? 0} entries
          </div>
        </div>

        {renderContent()}
      </div>
    </AdminLayout>
  );
};

export default ContentEntries;
