import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useIsMobile } from '../hooks/useDeviceType';
import { useTheme } from '../context/ThemeContext';
import Logo from './Logo';
import GlobalSearch from './GlobalSearch';
import NotificationCenter from './NotificationCenter';
import Sidebar from './Sidebar';
import Footer from './Footer';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { isAuthenticated, currentUser, logout } = useAuth();
  const isMobile = useIsMobile();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  // Don't render anything if not authenticated
  if (!isAuthenticated) {
    return <>{children}</>;
  }

  // Get page title
  const pathname = location.pathname;
  const titleMap: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/upload': 'Upload',
    '/history': 'History',
    '/profile': 'Profile',
    '/settings': 'Settings',
  };

  const getTitle = () => {
    if (titleMap[pathname]) return titleMap[pathname];
    if (pathname.startsWith('/results')) return 'Results';
    const seg = pathname.split('/').filter(Boolean).pop();
    return seg ? seg.charAt(0).toUpperCase() + seg.slice(1) : 'Dashboard';
  };

  const pageTitle = getTitle();

  return (
    // ROOT CONTAINER: h-screen + overflow-hidden + flex
    <div className="h-screen overflow-hidden flex bg-background-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* SIDEBAR: Fixed on left, full height, NO scrolling */}
      <Sidebar />

      {/* CONTENT AREA: Flex column, takes remaining space */}
      <div className="flex flex-col flex-1 h-full min-w-0">
        
        {/* HEADER/NAVBAR: Fixed at top, doesn't scroll */}
        <header className="flex-none h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 sm:px-6 shrink-0 z-20">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {pageTitle}
            </h2>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search */}
            <GlobalSearch />

            {/* Theme Toggle */}
            <button
              aria-label="Toggle theme"
              onClick={toggleTheme}
              className="rounded-md p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition touch-manipulation"
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
            <NotificationCenter />

            {/* Avatar */}
            <Link to="/profile" className="block">
              <img
                src={currentUser?.avatar || `https://ui-avatars.com/api/?name=${currentUser?.name || 'User'}&background=0066CC&color=fff`}
                alt="User avatar"
                className="h-8 w-8 rounded-full object-cover cursor-pointer hover:opacity-90"
              />
            </Link>
          </div>
        </header>

        {/* MAIN CONTENT: ONLY scrollable part with overflow-y-auto */}
        <main 
          id="main-content" 
          className="flex-1 overflow-y-auto w-full"
        >
          <div className="w-full min-h-full">
            {children}
            
            {/* Footer - Inside scrollable area */}
            <Footer />
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-40 safe-area-inset-bottom lg:hidden">
          <div className="flex items-center justify-around h-16 gap-1">
            {[
              { path: '/dashboard', label: 'Home', icon: 'M3 12l2-3m0 0l7-4 7 4M5 9v10a1 1 0 001 1h12a1 1 0 001-1V9m-9 11l4-2m0 0l4 2m-4-2v2m0-11l7-4' },
              { path: '/upload', label: 'Upload', icon: 'M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10' },
              { path: '/history', label: 'History', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
              { path: '/profile', label: 'Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
            ].map((item) => {
              const isActive = location.pathname === item.path || location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors ${
                    isActive
                      ? 'text-primary-600 dark:text-primary-400'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                  <span className="text-xs font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
};

export default AppLayout;

