import React from 'react';

export const SkeletonLine: React.FC<{ width?: string; height?: string; className?: string }> = ({
  width = 'w-full',
  height = 'h-4',
  className = '',
}) => (
  <div className={`${width} ${height} bg-gray-200 dark:bg-gray-700 rounded animate-pulse ${className}`} />
);

export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`bg-white dark:bg-gray-800 rounded-lg p-6 space-y-4 animate-pulse ${className}`}>
    <SkeletonLine height="h-6" width="w-3/4" />
    <SkeletonLine height="h-4" width="w-full" />
    <SkeletonLine height="h-4" width="w-5/6" />
  </div>
);

export const DashboardSkeleton: React.FC = () => (
  <div className="min-h-screen bg-background-50 dark:bg-gray-900 py-8">
    <div className="max-w-6xl mx-auto px-4 space-y-8">
      <SkeletonLine height="h-8" width="w-1/3" />
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>

      {/* Recent Analyses Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 space-y-4">
        <SkeletonLine height="h-6" width="w-1/4" />
        {[...Array(5)].map((_, i) => (
          <SkeletonLine key={i} height="h-12" width="w-full" className="my-2" />
        ))}
      </div>
    </div>
  </div>
);

export const HistorySkeleton: React.FC = () => (
  <div className="min-h-screen bg-background-50 dark:bg-gray-900 py-8">
    <div className="max-w-6xl mx-auto px-4 space-y-6">
      <SkeletonLine height="h-8" width="w-1/4" />
      <SkeletonCard />
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 space-y-4">
        {[...Array(10)].map((_, i) => (
          <SkeletonLine key={i} height="h-12" width="w-full" className="my-2" />
        ))}
      </div>
    </div>
  </div>
);

export const ResultsSkeleton: React.FC = () => (
  <div className="min-h-screen bg-background-50 dark:bg-gray-900 py-8">
    <div className="max-w-6xl mx-auto px-4">
      <SkeletonLine height="h-8" width="w-1/3" className="mb-6" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <SkeletonCard />
          <SkeletonCard />
        </div>
        <SkeletonCard />
      </div>
    </div>
  </div>
);

interface ButtonLoaderProps {
  loading?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const ButtonLoader: React.FC<ButtonLoaderProps> = ({ loading = false, children, className = '' }) => (
  <span className={`inline-flex items-center gap-2 ${className}`}>
    {loading && (
      <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        />
      </svg>
    )}
    {children}
  </span>
);

export const ProgressBar: React.FC<{ progress: number; className?: string }> = ({ progress, className = '' }) => (
  <div className={`h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden ${className}`}>
    <div
      className="h-full bg-primary-600 transition-all duration-300"
      style={{ width: `${progress}%` }}
    />
  </div>
);
