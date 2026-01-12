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
      <div className="p-6 md:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Content Types
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage and organize your content structures
          </p>
        </div>

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

        {/* Data - Card Grid */}
        {schema && Object.keys(schema.collections).length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(schema.collections).map(([key, collection]) => (
              <div
                key={key}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group"
              >
                <div className="p-6">
                  {/* Icon and Title */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-2xl">
                        📦
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                          {collection.label ?? key}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">{key}</p>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                      <span className="text-base">🏷️</span>
                      <span>
                        {Object.keys(collection.fields).length}{' '}
                        {Object.keys(collection.fields).length === 1 ? 'field' : 'fields'}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                    <a
                      href={`/admin/content/${key}`}
                      className="inline-flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm transition-colors group-hover:translate-x-1 transform duration-200"
                    >
                      <span>Manage Content</span>
                      <span className="text-lg">→</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ContentTypes;
