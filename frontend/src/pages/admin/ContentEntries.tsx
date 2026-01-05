import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import AdminLayout from '../../components/Layouts/AdminLayout';
import { deleteItem, listItems } from '../../api/content';
import { fetchSchema } from '../../api/schema';

const ContentEntries = () => {
  const { collection } = useParams<{ collection: string }>();
  const queryClient = useQueryClient();

  if (!collection) {
    return <div>Invalid collection</div>;
  }

  const { data: schema } = useQuery({
    queryKey: ['schema'],
    queryFn: fetchSchema,
  });

  const collectionSchema = schema?.collections?.[collection];

  const { data, isLoading, isError } = useQuery({
    queryKey: ['content', collection],
    queryFn: () => listItems(collection),
    enabled: !!collection,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteItem(collection, id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['content', collection],
      });
    },
  });

  return (
    <AdminLayout>
      <div style={{ padding: '2rem' }}>
        <h1>{collectionSchema?.label ?? collection}</h1>

        {!collectionSchema && !isLoading && <p style={{ color: 'red' }}>Unknown collection</p>}

        <div style={{ marginBottom: '1rem' }}>
          <Link to={`/admin/content/${collection}/new`}>+ Create entry</Link>
        </div>

        {isLoading && <p>Loading entries…</p>}

        {isError && <p style={{ color: 'red' }}>Failed to load entries</p>}

        {data && data.data.length === 0 && <p>No entries yet.</p>}

        {data && data.data.length > 0 && (
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
            }}
          >
            <thead>
              <tr>
                <th align="left">ID</th>
                {collectionSchema &&
                  Object.keys(collectionSchema.fields).map((field) => (
                    <th key={field} align="left">
                      {field}
                    </th>
                  ))}
                <th />
              </tr>
            </thead>
            <tbody>
              {data.data.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>

                  {collectionSchema &&
                    Object.keys(collectionSchema.fields).map((field) => (
                      <td key={field}>{String(item[field] ?? '')}</td>
                    ))}

                  <td>
                    <Link to={`/admin/content/${collection}/${item.id}`}>Edit</Link>
                    {' · '}
                    <button onClick={() => deleteMutation.mutate(item.id)}>Delete</button>
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

export default ContentEntries;
