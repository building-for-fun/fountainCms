import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import AdminLayout from '../../components/Layouts/AdminLayout';
import { createItem, getItem, updateItem } from '../../api/content';
import { fetchSchema } from '../../api/schema';
import { LoadingState, ErrorState } from '../../components/states';

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
                  {fieldConfig.type === 'text' && fieldConfig.variant === 'long' ? (
                    <textarea
                      name={fieldName}
                      value={formData[fieldName] || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-text placeholder-text-muted transition-all"
                      rows={5}
                      placeholder={`Enter ${fieldName}...`}
                    />
                  ) : (
                    <input
                      type={fieldConfig.type === 'number' ? 'number' : 'text'}
                      name={fieldName}
                      value={formData[fieldName] || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-text placeholder-text-muted transition-all"
                      placeholder={`Enter ${fieldName}...`}
                    />
                  )}
                </div>
              )
            )}

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
      </div>
    </AdminLayout>
  );
};

export default ContentEntryDetail;
