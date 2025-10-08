import { Search } from 'lucide-react';

interface EmptyStateProps {
  searchQuery?: string;
  hasFilters?: boolean;
}

export function EmptyState({ searchQuery, hasFilters }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6">
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
        <Search className="w-12 h-12 text-gray-400" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">No recipes found</h3>
      <p className="text-gray-500 text-center max-w-sm">
        {searchQuery
          ? `We couldn't find any recipes matching "${searchQuery}"`
          : hasFilters
            ? 'No recipes match your current filters'
            : 'Try adjusting your search or filters'}
      </p>
    </div>
  );
}
