import React from 'react';

interface EmptyStateProps {
  message?: string;
  description?: string;
  icon?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const EmptyState: React.FC<EmptyStateProps> = ({
  message = 'No data found',
  description,
  icon = '📭',
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-4">
      <div className="text-6xl">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">{message}</h3>
      {description && (
        <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">{description}</p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
