import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import AdminLayout from '../../components/Layouts/AdminLayout';
import { createItem, getItem, updateItem } from '../../api/content';
import { fetchSchema } from '../../api/schema';
import LoadingState from '../../components/LoadingState';
import ErrorState from '../../components/ErrorState';

const GlobalStyle = () => (
  <style
    dangerouslySetInnerHTML={{
      __html: `
    .entry-form-container {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      padding: 2.5rem;
      border-radius: 1rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      border: 1px solid #f3f4f6;
    }
    .form-group {
      margin-bottom: 1.5rem;
    }
    .form-label {
      display: block;
      font-size: 0.875rem;
      font-weight: 600;
      color: #374151;
      margin-bottom: 0.5rem;
      text-transform: capitalize;
    }
    .form-input {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 1px solid #d1d5db;
      border-radius: 0.5rem;
      font-size: 1rem;
      transition: all 0.2s;
    }
    .form-input:focus {
      outline: none;
      border-color: #2563eb;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    }
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 2rem;
      padding-top: 2rem;
      border-top: 1px solid #f3f4f6;
    }
    .btn {
      padding: 0.75rem 1.5rem;
      border-radius: 0.5rem;
      font-weight: 600;
      transition: all 0.2s;
      cursor: pointer;
    }
    .btn-primary {
      background: #2563eb;
      color: white;
      border: none;
    }
    .btn-primary:hover {
      background: #1d4ed8;
    }
    .btn-secondary {
      background: white;
      color: #374151;
      border: 1px solid #d1d5db;
    }
    .btn-secondary:hover {
      background: #f9fafb;
    }
  `,
    }}
  />
);

const ContentEntryDetail = () => {
  const { collection, id } = useParams<{ collection: string; id?: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

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

  useEffect(() => {
    if (existingData) {
      setFormData(existingData);
    }
  }, [existingData]);

  const mutation = useMutation({
    mutationFn: (payload: Record<string, any>) =>
      isEdit ? updateItem(collection!, id!, payload) : createItem(collection!, payload),
    onSuccess: () => {
      setToast({
        message: `Entry ${isEdit ? 'updated' : 'created'} successfully!`,
        type: 'success',
      });
      setTimeout(() => navigate(`/admin/content/${collection}`), 1500);
    },
    onError: (error: any) => {
      setToast({ message: error.message || 'Something went wrong', type: 'error' });
    },
  });

  if (schemaLoading || (isEdit && dataLoading))
    return (
      <AdminLayout>
        <LoadingState />
      </AdminLayout>
    );
  if (schemaError || !collectionSchema)
    return (
      <AdminLayout>
        <ErrorState message="Could not load schema" />
      </AdminLayout>
    );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Exclude technical fields if necessary, though backend usually handles it
    const { id: _, ...payload } = formData;
    mutation.mutate(payload);
  };

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
        <div className="mb-8">
          <button
            onClick={() => navigate(`/admin/content/${collection}`)}
            className="text-gray-500 hover:text-gray-700 flex items-center gap-2 mb-4 transition-colors"
          >
            ← Back to Entries
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEdit ? 'Edit' : 'Create'} {collectionSchema.label}
          </h1>
          <p className="text-gray-500 mt-2">
            {isEdit ? 'Update existing content entry' : 'Add a new entry to this collection'}
          </p>
        </div>

        <div className="entry-form-container">
          <form onSubmit={handleSubmit}>
            {Object.entries(collectionSchema.fields).map(
              ([fieldName, fieldConfig]: [string, any]) => (
                <div key={fieldName} className="form-group">
                  <label className="form-label">{fieldName}</label>
                  {fieldConfig.type === 'text' && fieldConfig.variant === 'long' ? (
                    <textarea
                      name={fieldName}
                      value={formData[fieldName] || ''}
                      onChange={handleInputChange}
                      className="form-input"
                      rows={5}
                      placeholder={`Enter ${fieldName}...`}
                    />
                  ) : (
                    <input
                      type={fieldConfig.type === 'number' ? 'number' : 'text'}
                      name={fieldName}
                      value={formData[fieldName] || ''}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder={`Enter ${fieldName}...`}
                    />
                  )}
                </div>
              )
            )}

            <div className="form-actions">
              <button
                type="button"
                onClick={() => navigate(`/admin/content/${collection}`)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button type="submit" disabled={mutation.isPending} className="btn btn-primary">
                {mutation.isPending ? 'Saving...' : isEdit ? 'Update Entry' : 'Create Entry'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ContentEntryDetail;
