import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { NotificationProvider } from './context/NotificationContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';
import Toast from './components/Toast';
import PageLoadingBar from './components/PageLoadingBar';
import WelcomeModal from './components/WelcomeModal';
import BottomNav from './components/BottomNav';
import PlatformStyles from './components/PlatformStyles';
import KeyboardShortcutsProvider from './components/KeyboardShortcutsProvider';
import KeyboardShortcutsModal from './components/KeyboardShortcutsModal';
import { initializeMockData } from './utils/mockData';
import Landing from './pages/Landing';
import PublicRoute from './components/PublicRoute';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import PasswordReset from './pages/PasswordReset';
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import Results from './pages/Results';
import History from './pages/History';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Documentation from './pages/Documentation';
import BrandGuide from './pages/BrandGuide';
import NotFound from './pages/NotFound';

const App: React.FC = () => {
  // Initialize mock data on app load
  useEffect(() => {
    try {
      initializeMockData();
    } catch (err) {
      console.error('Failed to initialize mock data:', err);
      // Continue app operation even if mock data fails
    }
  }, []);

  return (
    <ErrorBoundary>
      <BrowserRouter>
          <ThemeProvider>
            <AuthProvider>
              <ToastProvider>
                <NotificationProvider>
                  <PlatformStyles>
                    <KeyboardShortcutsProvider>
                      <PageLoadingBar />
                      <Toast />
                      <WelcomeModal />
                      <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={
                      <PublicRoute>
                        <Landing />
                      </PublicRoute>
                    } />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/reset-password" element={<PasswordReset />} />
                    <Route path="/documentation" element={<Documentation />} />
                    <Route path="/brand" element={<BrandGuide />} />

                {/* Protected Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/upload"
                  element={
                    <ProtectedRoute>
                      <Upload />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/results/:id"
                  element={
                    <ProtectedRoute>
                      <Results />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/history"
                  element={
                    <ProtectedRoute>
                      <History />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  }
                />
                {/* 404 Page */}
                <Route path="/404" element={<NotFound />} />
                
                {/* Catch-all redirect */}
                <Route path="*" element={<NotFound />} />
                    </Routes>
                    <BottomNav />
                    <KeyboardShortcutsModal />
                  </KeyboardShortcutsProvider>
                </PlatformStyles>
              </NotificationProvider>
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;