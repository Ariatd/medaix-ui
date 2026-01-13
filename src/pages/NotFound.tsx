import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="min-h-screen bg-background-50 dark:bg-gray-900 flex items-center justify-center px-4 py-20">
        <div className="text-center max-w-md">
          <div className="text-9xl font-bold text-primary-600 dark:text-primary-400 mb-4">404</div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Page Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
            >
              Go Home
            </button>
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
