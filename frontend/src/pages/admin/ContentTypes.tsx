import React, { useState, useMemo } from 'react';
import AdminLayout from '../../components/Layouts/AdminLayout';
import { useQuery } from '@tanstack/react-query';
import { fetchSchema } from '../../api/schema';
import LoadingState from '../../components/LoadingState';
import ErrorState from '../../components/ErrorState';
import EmptyState from '../../components/EmptyState';

type SortOption = 'name-asc' | 'name-desc' | 'fields-asc' | 'fields-desc';

const ContentTypes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('name-asc');

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

  // Filter and sort content types
  const filteredAndSortedTypes = useMemo(() => {
    if (!schema) return [];

    let types = Object.entries(schema.collections).map(([key, collection]) => ({
      key,
      label: collection.label ?? key,
      fieldCount: Object.keys(collection.fields).length,
      collection,
    }));

    // Filter by search term
    if (searchTerm) {
      types = types.filter(
        (type) =>
          type.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
          type.label.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort
    types.sort((a, b) => {
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

    return types;
  }, [schema, searchTerm, sortBy]);

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

        {/* Data - Search, Filter, and Cards */}
        {schema && Object.keys(schema.collections).length > 0 && (
          <>
            {/* Search and Sort Bar */}
            <div className="mb-6 flex flex-col md:flex-row gap-4">
              {/* Search Input */}
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search content types..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
                />
              </div>

              {/* Sort Dropdown */}
              <div className="md:w-64">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
                >
                  <option value="name-asc">Name (A-Z)</option>
                  <option value="name-desc">Name (Z-A)</option>
                  <option value="fields-asc">Fields (Low to High)</option>
                  <option value="fields-desc">Fields (High to Low)</option>
                </select>
              </div>
            </div>

            {/* Results Count */}
            <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
              Showing {filteredAndSortedTypes.length} of {Object.keys(schema.collections).length}{' '}
              content type{Object.keys(schema.collections).length !== 1 ? 's' : ''}
            </div>

            {/* No Results */}
            {filteredAndSortedTypes.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  No content types match your search
                </p>
              </div>
            )}

            {/* Card Grid */}
            {filteredAndSortedTypes.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAndSortedTypes.map(({ key, label, fieldCount }) => (
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
                              {label}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                              {key}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                          <span className="text-base">🏷️</span>
                          <span>
                            {fieldCount} {fieldCount === 1 ? 'field' : 'fields'}
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
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default ContentTypes;
