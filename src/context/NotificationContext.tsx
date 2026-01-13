import React, { createContext, useContext, useState, useCallback } from 'react';

export type NotificationType = 'success' | 'warning' | 'info';

export interface Notification {
  id: string;
  message: string;
  type: NotificationType;
  timestamp: number;
  isRead: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (message: string, type: NotificationType) => void;
  markAsRead: (id: string) => void;
  clearAll: () => void;
  deleteNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('medaix_notifications');
    return saved ? JSON.parse(saved) : [];
  });

  const addNotification = useCallback((message: string, type: NotificationType) => {
    const newNotification: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      message,
      type,
      timestamp: Date.now(),
      isRead: false,
    };

    setNotifications((prev) => {
      const updated = [newNotification, ...prev];
      localStorage.setItem('medaix_notifications', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) => {
      const updated = prev.map((n) => (n.id === id ? { ...n, isRead: true } : n));
      localStorage.setItem('medaix_notifications', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
    localStorage.setItem('medaix_notifications', JSON.stringify([]));
  }, []);

  const deleteNotification = useCallback((id: string) => {
    setNotifications((prev) => {
      const updated = prev.filter((n) => n.id !== id);
      localStorage.setItem('medaix_notifications', JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, markAsRead, clearAll, deleteNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
};
