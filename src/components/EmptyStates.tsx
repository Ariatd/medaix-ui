import React from 'react';
import { useNavigate } from 'react-router-dom';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  illustration?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = '📭',
  title,
  description,
  action,
  illustration,
}) => (
  <div className="flex flex-col items-center justify-center py-12 px-4">
    {illustration || <div className="text-6xl mb-4">{icon}</div>}
    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
    <p className="text-gray-600 dark:text-gray-400 text-center max-w-sm mb-6">{description}</p>
    {action && (
      <button
        onClick={action.onClick}
        className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
      >
        {action.label}
      </button>
    )}
  </div>
);

export const DashboardEmptyState: React.FC = () => {
  const navigate = useNavigate();

  return (
    <EmptyState
      icon="📊"
      title="No Analyses Yet"
      description="Start analyzing medical images to see your statistics and analysis history here."
      action={{
        label: 'Upload Image',
        onClick: () => navigate('/upload'),
      }}
    />
  );
};

export const HistoryEmptyState: React.FC = () => {
  const navigate = useNavigate();

  return (
    <EmptyState
      icon="🔍"
      title="No Analyses Found"
      description="Your analysis history will appear here. Upload a medical image to get started."
      action={{
        label: 'Upload Your First Image',
        onClick: () => navigate('/upload'),
      }}
    />
  );
};

export const SearchEmptyState: React.FC<{ searchTerm: string }> = ({ searchTerm }) => (
  <EmptyState
    icon="🔎"
    title="No Results Found"
    description={`We couldn't find anything matching "${searchTerm}". Try adjusting your search terms.`}
  />
);

export const ProfileEmptyState: React.FC = () => (
  <EmptyState
    icon="👤"
    title="Complete Your Profile"
    description="Add your information to personalize your MedAIx experience and get better recommendations."
  />
);

export const NotificationsEmptyState: React.FC = () => (
  <EmptyState
    icon="🔔"
    title="No Notifications"
    description="You're all caught up! New notifications will appear here."
  />
);

export const AnalysisEmptyState: React.FC = () => (
  <EmptyState
    icon="⏳"
    title="No Analysis Available"
    description="The analysis you're looking for is not available. It may have been deleted or the link is invalid."
  />
);
