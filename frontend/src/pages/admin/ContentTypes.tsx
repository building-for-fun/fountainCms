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
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .content-grid {
          display: grid !important;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)) !important;
          gap: 1.5rem !important;
        }
        .content-card {
          background: white !important;
          border-radius: 0.75rem !important;
          border: 1px solid #e2e8f0 !important;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1) !important;
          padding: 1.5rem !important;
          transition: all 0.2s ease !important;
          display: flex !important;
          flex-direction: column !important;
        }
        .dark .content-card {
          background: #1e293b !important;
          border-color: #334155 !important;
          color: white !important;
        }
        .content-card:hover {
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1) !important;
          transform: translateY(-4px) !important;
          border-color: #3b82f6 !important;
        }
        .card-icon {
          width: 3rem !important;
          height: 3rem !important;
          border-radius: 0.5rem !important;
          background-color: #dbeafe !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          font-size: 1.5rem !important;
          margin-bottom: 1rem !important;
        }
        .dark .card-icon {
          background-color: rgba(30, 58, 138, 0.4) !important;
        }
        .card-title {
          font-size: 1.25rem !important;
          font-weight: 600 !important;
          margin-bottom: 0.25rem !important;
        }
        .card-key {
          font-family: monospace !important;
          font-size: 0.875rem !important;
          color: #64748b !important;
          margin-bottom: 1rem !important;
        }
        .card-stats {
          display: flex !important;
          align-items: center !important;
          gap: 0.5rem !important;
          font-size: 0.875rem !important;
          color: #475569 !important;
          margin-bottom: 1.5rem !important;
        }
        .dark .card-stats {
          color: #94a3b8 !important;
        }
        .card-action {
          margin-top: auto !important;
          padding-top: 1rem !important;
          border-top: 1px solid #f1f5f9 !important;
          display: flex !important;
          align-items: center !important;
          gap: 0.5rem !important;
          color: #2563eb !important;
          font-weight: 500 !important;
          text-decoration: none !important;
        }
        .dark .card-action {
          border-top-color: #334155 !important;
          color: #60a5fa !important;
        }
        .search-input {
          width: 100% !important;
          padding: 0.5rem 1rem !important;
          border-radius: 0.5rem !important;
          border: 1px solid #d1d5db !important;
          background: white !important;
        }
        .dark .search-input {
          background: #1f2937 !important;
          border-color: #4b5563 !important;
          color: white !important;
        }
        .sort-select {
          width: 100% !important;
          padding: 0.5rem 1rem !important;
          border-radius: 0.5rem !important;
          border: 1px solid #d1d5db !important;
          background: white !important;
        }
        .dark .sort-select {
          background: #1f2937 !important;
          border-color: #4b5563 !important;
          color: white !important;
        }
      `,
        }}
      />
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
                  className="search-input"
                />
              </div>

              {/* Sort Dropdown */}
              <div className="md:w-64">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="sort-select"
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
              <div className="content-grid">
                {filteredAndSortedTypes.map(({ key, label, fieldCount }) => (
                  <div key={key} className="content-card">
                    <div className="card-icon">📦</div>
                    <div className="card-title">{label}</div>
                    <div className="card-key">{key}</div>

                    <div className="card-stats">
                      <span>🏷️</span>
                      <span>
                        {fieldCount} {fieldCount === 1 ? 'field' : 'fields'}
                      </span>
                    </div>

                    <a href={`/admin/content/${key}`} className="card-action">
                      <span>Manage Content</span>
                      <span>→</span>
                    </a>
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
