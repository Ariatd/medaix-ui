import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import GlobalSearch from './GlobalSearch';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

interface DashboardLayoutProps {
  children: React.ReactNode;
  showHelp?: boolean;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, showHelp = true }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { currentUser } = useAuth();

  const pathname = location.pathname;
  const titleMap: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/upload': 'Upload',
    '/history': 'History',
    '/profile': 'Profile',
    '/settings': 'Settings',
  };

  const getTitle = () => {
    // exact matches first
    if (titleMap[pathname]) return titleMap[pathname];
    // handle results/:id
    if (pathname.startsWith('/results')) return 'Results';
    // fallback: use last path segment
    const seg = pathname.split('/').filter(Boolean).pop();
    return seg ? seg.charAt(0).toUpperCase() + seg.slice(1) : 'Dashboard';
  };

  const pageTitle = getTitle();

  return (
    <div className="min-h-screen bg-background-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Fixed brand block in top-left (over the header area) */}
      <div className="fixed left-0 top-0 h-16 w-64 bg-primary-600 flex items-center gap-3 px-4 z-50 shadow-md">
        <Link to="/dashboard" className="flex items-center gap-3 text-white">
          <Logo size={32} />
          <span className="font-bold text-lg">MedAIx</span>
        </Link>
      </div>
      <div className="flex">
        {/* Fixed sidebar on the left */}
        <Sidebar />

        {/* Main column: header, content and footer */}
        <div className="flex-1 flex flex-col min-h-screen">
          {/* Dashboard top header (sticky within the main column) */}
          <header className="sticky top-0 z-20 h-16 w-full bg-white dark:bg-gray-800 transition-colors border-b border-gray-200 dark:border-gray-700">
            <div className="mx-auto max-w-7xl h-full px-4 sm:px-6 lg:px-8">
              <div className="flex h-full items-center justify-between">
                <div className="flex items-center gap-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{pageTitle}</h2>
                </div>

                <div className="flex items-center gap-3">
                  {/* Search (visual only) */}
                  <GlobalSearch />

                  {/* Theme toggle */}
                  <button
                    aria-label="Toggle theme"
                    onClick={toggleTheme}
                    className="rounded-md p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition"
                  >
                    {theme === 'dark' ? (
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.36-6.36l-1.42 1.42M7.05 16.95l-1.42 1.42M18.36 18.36l-1.42-1.42M7.05 7.05L5.63 5.63" />
                      </svg>
                    )}
                  </button>

                  {/* Notifications */}
                  <button
                    aria-label="Notifications"
                    className="rounded-md p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  </button>

                  {/* Avatar */}
                  <Link to="/profile" className="block">
                    <img
                      src={currentUser?.avatar || `https://ui-avatars.com/api/?name=${currentUser?.name || 'User'}&background=0066CC&color=fff`}
                      alt="User avatar"
                      className="h-8 w-8 rounded-full object-cover cursor-pointer hover:opacity-90"
                    />
                  </Link>
                </div>
              </div>
            </div>
          </header>

          <main id="main-content" className="flex-1 w-full">
            {children}
          </main>

          {/* Footer scoped to main column */}
          <Footer />
        </div>
      </div>

      {showHelp && null}
    </div>
  );
};

export default DashboardLayout;
