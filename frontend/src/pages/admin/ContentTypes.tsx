import React from 'react';
import AdminLayout from '../../components/Layouts/AdminLayout';
import { useQuery } from '@tanstack/react-query';
import { fetchSchema } from '../../api/schema';

const ContentTypes = () => {
  const {
    data: schema,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['schema'],
    queryFn: fetchSchema,
  });
  return (
    <AdminLayout>
      <div style={{ padding: '2rem' }}>
        <h1>Content Types</h1>

        {/* Loading */}
        {isLoading && <p>Loading schema…</p>}

        {/* Error */}
        {isError && <p style={{ color: 'red' }}>{(error as Error).message}</p>}

        {/* Data */}
        {schema && (
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

        {/* Empty state */}
        {schema && Object.keys(schema.collections).length === 0 && <p>No content types defined.</p>}
      </div>
    </AdminLayout>
  );
};

export default ContentTypes;
