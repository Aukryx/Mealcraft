// Système de notifications utilisateur pour MealCraft
// Remplace les console.error par des messages visibles à l'utilisateur

import { useState, useCallback, useEffect } from 'react';

export enum NotificationType {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info'
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number; // en millisecondes
  persistent?: boolean; // ne se ferme pas automatiquement
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Context pour les notifications globales
let globalNotifications: Notification[] = [];
let globalListeners: ((notifications: Notification[]) => void)[] = [];

const notifyListeners = () => {
  globalListeners.forEach(listener => listener([...globalNotifications]));
};

const addGlobalNotification = (notification: Omit<Notification, 'id'>): string => {
  const id = `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const newNotification: Notification = { ...notification, id };
  
  globalNotifications.push(newNotification);
  notifyListeners();
  
  // Auto-remove non-persistent notifications
  if (!notification.persistent) {
    const duration = notification.duration || (notification.type === 'error' ? 7000 : 4000);
    setTimeout(() => {
      removeGlobalNotification(id);
    }, duration);
  }
  
  return id;
};

const removeGlobalNotification = (id: string) => {
  globalNotifications = globalNotifications.filter(n => n.id !== id);
  notifyListeners();
};

// Hook pour utiliser les notifications
export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  useEffect(() => {
    const listener = (newNotifications: Notification[]) => {
      setNotifications(newNotifications);
    };
    
    globalListeners.push(listener);
    listener([...globalNotifications]); // Sync initial
    
    return () => {
      globalListeners = globalListeners.filter(l => l !== listener);
    };
  }, []);
  
  const addNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    return addGlobalNotification(notification);
  }, []);
  
  const removeNotification = useCallback((id: string) => {
    removeGlobalNotification(id);
  }, []);
  
  const clearAll = useCallback(() => {
    globalNotifications = [];
    notifyListeners();
  }, []);
  
  // Méthodes de convenance
  const success = useCallback((title: string, message: string, options?: Partial<Notification>) => {
    return addNotification({
      type: NotificationType.SUCCESS,
      title,
      message,
      ...options
    });
  }, [addNotification]);
  
  const error = useCallback((title: string, message: string, options?: Partial<Notification>) => {
    return addNotification({
      type: NotificationType.ERROR,
      title,
      message,
      duration: 7000, // Erreurs restent plus longtemps
      ...options
    });
  }, [addNotification]);
  
  const warning = useCallback((title: string, message: string, options?: Partial<Notification>) => {
    return addNotification({
      type: NotificationType.WARNING,
      title,
      message,
      ...options
    });
  }, [addNotification]);
  
  const info = useCallback((title: string, message: string, options?: Partial<Notification>) => {
    return addNotification({
      type: NotificationType.INFO,
      title,
      message,
      ...options
    });
  }, [addNotification]);
  
  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    success,
    error,
    warning,
    info
  };
};

// Notifications globales sans hook (pour services)
export const notify = {
  success: (title: string, message: string, options?: Partial<Notification>) => 
    addGlobalNotification({ type: NotificationType.SUCCESS, title, message, ...options }),
  
  error: (title: string, message: string, options?: Partial<Notification>) => 
    addGlobalNotification({ 
      type: NotificationType.ERROR, 
      title, 
      message, 
      duration: 7000,
      ...options 
    }),
  
  warning: (title: string, message: string, options?: Partial<Notification>) => 
    addGlobalNotification({ type: NotificationType.WARNING, title, message, ...options }),
  
  info: (title: string, message: string, options?: Partial<Notification>) => 
    addGlobalNotification({ type: NotificationType.INFO, title, message, ...options }),
};

// Composant de notification individuelle
export const NotificationItem: React.FC<{
  notification: Notification;
  onClose: (id: string) => void;
}> = ({ notification, onClose }) => {
  const getIcon = () => {
    switch (notification.type) {
      case NotificationType.SUCCESS: return '✅';
      case NotificationType.ERROR: return '❌';
      case NotificationType.WARNING: return '⚠️';
      case NotificationType.INFO: return 'ℹ️';
      default: return '📝';
    }
  };
  
  const getBackgroundColor = () => {
    switch (notification.type) {
      case NotificationType.SUCCESS: return 'rgba(76, 175, 80, 0.9)';
      case NotificationType.ERROR: return 'rgba(244, 67, 54, 0.9)';
      case NotificationType.WARNING: return 'rgba(255, 152, 0, 0.9)';
      case NotificationType.INFO: return 'rgba(33, 150, 243, 0.9)';
      default: return 'rgba(96, 125, 139, 0.9)';
    }
  };
  
  return (
    <div
      style={{
        background: getBackgroundColor(),
        color: 'white',
        padding: '1rem',
        borderRadius: '8px',
        margin: '0.5rem 0',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        minWidth: '300px',
        maxWidth: '500px',
        animation: 'slideInRight 0.3s ease-out'
      }}
    >
      <div style={{ fontSize: '1.2rem' }}>{getIcon()}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>
          {notification.title}
        </div>
        <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>
          {notification.message}
        </div>
        {notification.action && (
          <button
            onClick={notification.action.onClick}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: '1px solid rgba(255,255,255,0.3)',
              color: 'white',
              padding: '0.25rem 0.5rem',
              borderRadius: '4px',
              fontSize: '0.7rem',
              cursor: 'pointer',
              marginTop: '0.5rem'
            }}
          >
            {notification.action.label}
          </button>
        )}
      </div>
      {!notification.persistent && (
        <button
          onClick={() => onClose(notification.id)}
          style={{
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            color: 'white',
            padding: '0.25rem',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.8rem'
          }}
        >
          ✕
        </button>
      )}
    </div>
  );
};

// Conteneur de notifications
export const NotificationContainer: React.FC = () => {
  const { notifications, removeNotification } = useNotifications();
  
  if (notifications.length === 0) return null;
  
  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 10000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end'
      }}
    >
      <style jsx>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
      
      {notifications.map(notification => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onClose={removeNotification}
        />
      ))}
    </div>
  );
};
