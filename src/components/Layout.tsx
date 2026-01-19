import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useIsMobile } from '../hooks/useDeviceType';
import Header from './Header';
import Footer from './Footer';
import HelpSupport from './HelpSupport';
import SkipToMainContent from './SkipToMainContent';

interface LayoutProps {
  children: React.ReactNode;
  showHelp?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, showHelp = true }) => {
  const { isAuthenticated } = useAuth();
  const isMobile = useIsMobile();

  // Add bottom margin on mobile when bottom nav is visible
  const mainMargin = isAuthenticated && isMobile ? 'mb-20' : '';

  return (
    <div className="min-h-screen flex flex-col bg-background-50 dark:bg-gray-900 text-gray-900 dark:text-white overflow-clip">
      <SkipToMainContent />

      <Header />

      {/* DEĞİŞİKLİK BURADA: 'pt-20' eklendi. Bu, içeriği 80px aşağı iter. */}
      <main id="main-content" className={`flex-1 w-full pt-20 ${mainMargin}`}>
        {children}
        
        {/* Footer - Inside scrollable area */}
        <Footer />
      </main>

      {showHelp && <HelpSupport />}
    </div>
  );
};

export default Layout;