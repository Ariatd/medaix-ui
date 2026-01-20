import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  memberSince: string;
  bio?: string;
  phone?: string;
}

interface AuthContextType {
  currentUser: User | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
  clearAllData: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('medaix_user');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (err) {
        console.error('Failed to parse saved user:', err);
        localStorage.removeItem('medaix_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    // --- DEMO MODU BAŞLANGICI ---
    // Eğer Vercel Environment Variables içinde VITE_IS_DEMO = true ise çalışır
    if (import.meta.env.VITE_IS_DEMO === 'true') {
      await new Promise(resolve => setTimeout(resolve, 800)); // Hafif bir bekleme hissi
      
      const demoUser: User = {
        id: 'demo_user_123',
        name: 'Demo User',
        email: email || 'demo@medaix.com',
        avatar: `https://ui-avatars.com/api/?name=Demo+User&background=0066CC&color=fff`,
        memberSince: new Date().toISOString(),
        bio: 'This is a demo account for showcase purposes.',
      };

      setCurrentUser(demoUser);
      localStorage.setItem('medaix_user', JSON.stringify(demoUser));
      return; // Fonksiyondan çık, aşağıdaki gerçek kontrolleri yapma
    }
    // --- DEMO MODU BİTİŞİ ---

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock validation
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    // SIMPLIFIED: Just check basic email structure
    if (!email.includes('@') || !email.includes('.')) {
      throw new Error('Invalid email format');
    }

    // Check if user exists in localStorage (from signup)
    const registeredUsers = JSON.parse(localStorage.getItem('medaix_users') || '[]');
    const foundUser = registeredUsers.find((u: any) => u.email === email);

    if (!foundUser || foundUser.password !== password) {
      throw new Error('Invalid email or password');
    }

    // Remove password before storing in context
    const { password: _, ...userWithoutPassword } = foundUser;
    setCurrentUser(userWithoutPassword);
    localStorage.setItem('medaix_user', JSON.stringify(userWithoutPassword));
  };

  const signup = async (email: string, password: string, name: string): Promise<void> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Validation
    if (!name || !email || !password) {
      throw new Error('All fields are required');
    }

    // SIMPLIFIED: Just check basic email structure
    if (!email.includes('@') || !email.includes('.')) {
      throw new Error('Invalid email format');
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    // Check if user already exists
    const registeredUsers = JSON.parse(localStorage.getItem('medaix_users') || '[]');
    if (registeredUsers.some((u: any) => u.email === email)) {
      throw new Error('Email already registered');
    }

    // Create new user
    const newUser: User & { password: string } = {
      id: 'user_' + Date.now(),
      name,
      email,
      password,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0066CC&color=fff`,
      memberSince: new Date().toISOString(),
    };

    // Save to registered users
    registeredUsers.push(newUser);
    localStorage.setItem('medaix_users', JSON.stringify(registeredUsers));

    // Login the user
    const { password: _, ...userWithoutPassword } = newUser;
    setCurrentUser(userWithoutPassword);
    localStorage.setItem('medaix_user', JSON.stringify(userWithoutPassword));
  };

  const logout = (): void => {
    setCurrentUser(null);
    localStorage.removeItem('medaix_user');
  };

  const updateProfile = async (updates: Partial<User>): Promise<void> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    if (!currentUser) {
      throw new Error('No user logged in');
    }

    const updatedUser = { ...currentUser, ...updates };
    setCurrentUser(updatedUser);
    localStorage.setItem('medaix_user', JSON.stringify(updatedUser));

    // Also update in registered users list
    const registeredUsers = JSON.parse(localStorage.getItem('medaix_users') || '[]');
    const userIndex = registeredUsers.findIndex((u: any) => u.id === updatedUser.id);
    if (userIndex !== -1) {
      registeredUsers[userIndex] = { ...registeredUsers[userIndex], ...updates };
      localStorage.setItem('medaix_users', JSON.stringify(registeredUsers));
    }
  };

  const changePassword = async (oldPassword: string, newPassword: string): Promise<void> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    if (!currentUser) {
      throw new Error('No user logged in');
    }

    if (!oldPassword || !newPassword) {
      throw new Error('Both passwords are required');
    }

    if (newPassword.length < 6) {
      throw new Error('New password must be at least 6 characters');
    }

    // In real app, verify oldPassword with backend
    // For mock, we'll just allow it
    const registeredUsers = JSON.parse(localStorage.getItem('medaix_users') || '[]');
    const userIndex = registeredUsers.findIndex((u: any) => u.id === currentUser.id);

    if (userIndex !== -1) {
      registeredUsers[userIndex].password = newPassword;
      localStorage.setItem('medaix_users', JSON.stringify(registeredUsers));
    }
  };

  const clearAllData = (): void => {
    // Clear all authentication data
    localStorage.removeItem('medaix_user');
    localStorage.removeItem('medaix_users');
    localStorage.removeItem('medaix_uploads');
    localStorage.removeItem('medaix_results');
    localStorage.removeItem('medaix_settings');
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        user: currentUser,
        isAuthenticated: !!currentUser,
        isLoading,
        login,
        signup,
        logout,
        updateProfile,
        changePassword,
        clearAllData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};