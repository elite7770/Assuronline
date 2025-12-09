import { useState, useEffect, useCallback } from 'react';
import { 
  CheckCircle, 
  AlertCircle, 
  AlertTriangle, 
  Info, 
  X,
  Bell
} from 'lucide-react';

const InsuranceNotification = ({
  id,
  title,
  message,
  type = 'info', // success, warning, danger, info
  duration = 5000,
  position = 'top-right', // top-right, top-left, bottom-right, bottom-left, top-center, bottom-center
  showIcon = true,
  showCloseButton = true,
  onClose,
  onClick,
  className = '',
  persistent = false
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  const getTypeIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-success-600" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-warning-600" />;
      case 'danger':
        return <AlertCircle className="h-5 w-5 text-danger-600" />;
      case 'info':
        return <Info className="h-5 w-5 text-primary-600" />;
      default:
        return <Bell className="h-5 w-5 text-primary-600" />;
    }
  };

  const getTypeClasses = (type) => {
    switch (type) {
      case 'success':
        return 'border-l-4 border-success-500 bg-success-50';
      case 'warning':
        return 'border-l-4 border-warning-500 bg-warning-50';
      case 'danger':
        return 'border-l-4 border-danger-500 bg-danger-50';
      case 'info':
        return 'border-l-4 border-primary-500 bg-primary-50';
      default:
        return 'border-l-4 border-primary-500 bg-primary-50';
    }
  };

  const getPositionClasses = (position) => {
    switch (position) {
      case 'top-left':
        return 'top-4 left-4';
      case 'top-center':
        return 'top-4 left-1/2 transform -translate-x-1/2';
      case 'top-right':
        return 'top-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'bottom-center':
        return 'bottom-4 left-1/2 transform -translate-x-1/2';
      case 'bottom-right':
        return 'bottom-4 right-4';
      default:
        return 'top-4 right-4';
    }
  };

  const handleClose = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      if (onClose) {
        onClose(id);
      }
    }, 150);
  }, [onClose, id]);

  const handleClick = () => {
    if (onClick) {
      onClick(id);
    }
  };

  // Auto-close after duration
  useEffect(() => {
    if (!persistent && duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, persistent, handleClose]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed z-50 ${getPositionClasses(position)} ${className} ${
        isExiting ? 'animate-slide-out' : 'animate-slide-in'
      }`}
    >
      <div
        className={`insurance-card p-4 max-w-sm w-full cursor-pointer transition-all duration-150 hover:shadow-card-hover ${getTypeClasses(type)}`}
        onClick={handleClick}
      >
        <div className="flex items-start gap-3">
          {/* Icon */}
          {showIcon && (
            <div className="flex-shrink-0 mt-0.5">
              {getTypeIcon(type)}
            </div>
          )}

          {/* Content */}
          <div className="flex-1 min-w-0">
            {title && (
              <h4 className="text-sm font-semibold text-text-primary mb-1">
                {title}
              </h4>
            )}
            {message && (
              <p className="text-sm text-text-secondary">
                {message}
              </p>
            )}
          </div>

          {/* Close button */}
          {showCloseButton && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleClose();
              }}
              className="flex-shrink-0 w-6 h-6 rounded-lg bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center transition-colors"
              aria-label="Close notification"
            >
              <X className="h-3 w-3 text-neutral-600" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Notification Container Component
const InsuranceNotificationContainer = ({ 
  notifications = [], 
  onRemove,
  position = 'top-right',
  maxNotifications = 5,
  className = ''
}) => {
  const getPositionClasses = (position) => {
    switch (position) {
      case 'top-left':
        return 'top-4 left-4';
      case 'top-center':
        return 'top-4 left-1/2 transform -translate-x-1/2';
      case 'top-right':
        return 'top-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'bottom-center':
        return 'bottom-4 left-1/2 transform -translate-x-1/2';
      case 'bottom-right':
        return 'bottom-4 right-4';
      default:
        return 'top-4 right-4';
    }
  };

  const visibleNotifications = notifications.slice(0, maxNotifications);

  return (
    <div className={`fixed z-50 ${getPositionClasses(position)} ${className}`}>
      <div className="space-y-2">
        {visibleNotifications.map((notification, index) => (
          <InsuranceNotification
            key={notification.id || index}
            {...notification}
            onClose={onRemove}
          />
        ))}
      </div>
    </div>
  );
};

// Toast Notification Hook
const useInsuranceNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (notification) => {
    const id = Date.now().toString();
    const newNotification = {
      id,
      ...notification,
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    return id;
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const showSuccess = (title, message, options = {}) => {
    return addNotification({
      type: 'success',
      title,
      message,
      ...options,
    });
  };

  const showWarning = (title, message, options = {}) => {
    return addNotification({
      type: 'warning',
      title,
      message,
      ...options,
    });
  };

  const showError = (title, message, options = {}) => {
    return addNotification({
      type: 'danger',
      title,
      message,
      ...options,
    });
  };

  const showInfo = (title, message, options = {}) => {
    return addNotification({
      type: 'info',
      title,
      message,
      ...options,
    });
  };

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    showSuccess,
    showWarning,
    showError,
    showInfo,
  };
};

export default InsuranceNotification;
export { InsuranceNotificationContainer, useInsuranceNotifications };
