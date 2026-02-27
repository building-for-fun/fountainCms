import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/Layouts/AdminLayout';
import { useQuery } from '@tanstack/react-query';
import { fetchSchema } from '../../api/schema';
import { LoadingState, ErrorState, EmptyState } from '../../components/states';

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
      <div className="p-6 md:p-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-text mb-2">Content Types</h1>
          <p className="text-text-muted">Manage and organize your content structures</p>
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
            <div className="mb-8 flex flex-col md:flex-row gap-4">
              {/* Search Input */}
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search content types..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-surface text-text placeholder-text-muted transition-all"
                />
              </div>

              {/* Sort Dropdown */}
              <div className="md:w-64">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-surface text-text transition-all"
                >
                  <option value="name-asc">Name (A-Z)</option>
                  <option value="name-desc">Name (Z-A)</option>
                  <option value="fields-asc">Fields (Low to High)</option>
                  <option value="fields-desc">Fields (High to Low)</option>
                </select>
              </div>
            </div>

            {/* Results Count */}
            <div className="mb-4 text-sm text-text-muted">
              Showing {filteredAndSortedTypes.length} of {Object.keys(schema.collections).length}{' '}
              content type{Object.keys(schema.collections).length !== 1 ? 's' : ''}
            </div>

            {/* No Results */}
            {filteredAndSortedTypes.length === 0 && (
              <div className="text-center py-12">
                <p className="text-text-muted text-lg">No content types match your search</p>
              </div>
            )}

            {/* Card Grid */}
            {filteredAndSortedTypes.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAndSortedTypes.map(({ key, label, fieldCount }) => (
                  <div
                    key={key}
                    className="bg-surface rounded-xl border border-border shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-primary transition-all p-6 flex flex-col"
                  >
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-2xl mb-4">
                      📦
                    </div>
                    <div className="text-xl font-semibold text-text mb-1">{label}</div>
                    <div className="font-mono text-sm text-text-muted mb-4">{key}</div>

                    <div className="flex items-center gap-2 text-sm text-text-muted mb-6">
                      <span>🏷️</span>
                      <span>
                        {fieldCount} {fieldCount === 1 ? 'field' : 'fields'}
                      </span>
                    </div>

                    <Link
                      to={`/admin/content/${key}`}
                      className="mt-auto pt-4 border-t border-border flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all"
                    >
                      <span>Manage Content</span>
                      <span>→</span>
                    </Link>
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
