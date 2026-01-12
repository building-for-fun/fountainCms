import React from 'react';
import AdminLayout from '../../components/Layouts/AdminLayout';
import { useQuery } from '@tanstack/react-query';
import { fetchSchema } from '../../api/schema';
import LoadingState from '../../components/LoadingState';
import ErrorState from '../../components/ErrorState';
import EmptyState from '../../components/EmptyState';

const ContentTypes = () => {
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

  return (
    <AdminLayout>
      <div style={{ padding: '2rem' }}>
        <h1>Content Types</h1>

        {/* Loading State */}
        {isLoading && <LoadingState message="Loading content types..." />}

        {/* Error State */}
        {isError && (
          <ErrorState
            message={(error as Error).message || 'Failed to fetch content types'}
            onRetry={() => refetch()}
          />
        )}

        {/* Empty State */}
        {schema && Object.keys(schema.collections).length === 0 && (
          <EmptyState
            message="No Content Types Yet"
            description="Content types define the structure of your data. Start by creating your first content type."
            icon="📦"
          />
        )}

        {/* Data */}
        {schema && Object.keys(schema.collections).length > 0 && (
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              marginTop: '1rem',
            }}
          >
            <thead>
              <tr>
                <th align="left">Key</th>
                <th align="left">Label</th>
                <th align="left">Fields</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {Object.entries(schema.collections).map(([key, collection]) => (
                <tr key={key}>
                  <td>{key}</td>
                  <td>{collection.label ?? key}</td>
                  <td>{Object.keys(collection.fields).length}</td>
                  <td>
                    <a href={`/admin/content/${key}`} style={{ color: '#2563eb' }}>
                      Manage →
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
};

export default ContentTypes;
