import React, { useState, useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import AdminLayout from '../../components/Layouts/AdminLayout';
import { deleteItem, listItems } from '../../api/content';
import { fetchSchema } from '../../api/schema';
import LoadingState from '../../components/LoadingState';
import ErrorState from '../../components/ErrorState';
import EmptyState from '../../components/EmptyState';

const GlobalStyle = () => (
  <style
    dangerouslySetInnerHTML={{
      __html: `
    .content-table-container {
      background: white;
      border-radius: 1rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      overflow: hidden;
      border: 1px solid #f3f4f6;
    }
    .content-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }
    .content-table th {
      background: #f9fafb;
      padding: 1rem 1.5rem;
      font-weight: 600;
      color: #374151;
      font-size: 0.875rem;
      border-bottom: 1px solid #f3f4f6;
      text-transform: uppercase;
      letter-spacing: 0.025em;
    }
    .content-table td {
      padding: 1rem 1.5rem;
      color: #4b5563;
      font-size: 0.9375rem;
      border-bottom: 1px solid #f3f4f6;
    }
    .content-table tr:last-child td {
      border-bottom: none;
    }
    .content-table tr:hover td {
      background: #fdfdfd;
    }
    .action-btn {
      padding: 0.5rem;
      border-radius: 0.375rem;
      transition: all 0.2s;
    }
    .action-btn-edit {
      color: #2563eb;
    }
    .action-btn-edit:hover {
      background: #eff6ff;
    }
    .action-btn-delete {
      color: #dc2626;
    }
    .action-btn-delete:hover {
      background: #fef2f2;
    }
    .search-input {
      width: 100%;
      max-width: 400px;
      padding: 0.625rem 1rem;
      border: 1px solid #d1d5db;
      border-radius: 0.5rem;
      transition: all 0.2s;
    }
    .search-input:focus {
      outline: none;
      border-color: #2563eb;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    }
  `,
    }}
  />
);

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

  return (
    <AdminLayout>
      <GlobalStyle />
      {toast && (
        <div
          className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white`}
        >
          {toast.message}
        </div>
      )}

      <div className="p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <button
              onClick={() => navigate('/admin/content-types')}
              className="text-gray-500 hover:text-gray-700 flex items-center gap-2 mb-4 transition-colors"
            >
              ← Back to Content Types
            </button>
            <h1 className="text-3xl font-bold text-gray-900">
              {collectionSchema?.label ?? collection}
            </h1>
            <p className="text-gray-500 mt-1">
              Manage entries for {collectionSchema?.label ?? collection}
            </p>
          </div>

          <Link
            to={`/admin/content/${collection}/new`}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <span className="mr-2">+</span> Create Entry
          </Link>
        </div>

        <div className="mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
          <input
            type="text"
            placeholder="Search entries..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="text-sm text-gray-500">
            Showing {filteredEntries.length} of {data?.data.length ?? 0} entries
          </div>
        </div>

        {!collectionSchema ? (
          <ErrorState message="Unknown collection schema" />
        ) : filteredEntries.length === 0 ? (
          <EmptyState
            title="No entries found"
            message={
              searchTerm ? 'Try adjusting your search' : 'Start by creating your first entry'
            }
          />
        ) : (
          <div className="content-table-container">
            <table className="content-table">
              <thead>
                <tr>
                  <th>ID</th>
                  {Object.keys(collectionSchema.fields).map((field) => (
                    <th key={field}>{field}</th>
                  ))}
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEntries.map((item) => (
                  <tr key={item.id}>
                    <td className="font-mono text-xs">{item.id.substring(0, 8)}...</td>

                    {Object.keys(collectionSchema.fields).map((field) => (
                      <td key={field}>
                        <div className="max-w-xs truncate">{String(item[field] ?? '—')}</div>
                      </td>
                    ))}

                    <td className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          to={`/admin/content/${collection}/${item.id}`}
                          className="action-btn action-btn-edit"
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
                          className="action-btn action-btn-delete"
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
        )}
      </div>
    </AdminLayout>
  );
};

export default ContentEntries;
