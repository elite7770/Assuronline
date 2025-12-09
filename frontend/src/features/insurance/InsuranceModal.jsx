import { useEffect, useRef } from 'react';
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

const InsuranceModal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  size = 'medium', // small, medium, large, xl
  type = 'default', // default, success, warning, danger, info
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  className = '',
  footer,
  loading = false
}) => {
  const modalRef = useRef(null);

  const getSizeClasses = (size) => {
    switch (size) {
      case 'small':
        return 'max-w-md';
      case 'large':
        return 'max-w-4xl';
      case 'xl':
        return 'max-w-6xl';
      default:
        return 'max-w-2xl';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-6 w-6 text-success-600" />;
      case 'warning':
        return <AlertTriangle className="h-6 w-6 text-warning-600" />;
      case 'danger':
        return <AlertCircle className="h-6 w-6 text-danger-600" />;
      case 'info':
        return <Info className="h-6 w-6 text-primary-600" />;
      default:
        return null;
    }
  };

  const getTypeClasses = (type) => {
    switch (type) {
      case 'success':
        return 'border-l-4 border-success-500';
      case 'warning':
        return 'border-l-4 border-warning-500';
      case 'danger':
        return 'border-l-4 border-danger-500';
      case 'info':
        return 'border-l-4 border-primary-500';
      default:
        return '';
    }
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (closeOnEscape && e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, closeOnEscape, onClose]);

  // Focus management
  useEffect(() => {
    if (isOpen && modalRef.current) {
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0];
      if (firstElement) {
        firstElement.focus();
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-150"
        onClick={closeOnOverlayClick ? onClose : undefined}
      />

      {/* Modal */}
      <div
        ref={modalRef}
        className={`relative bg-surface border border-border rounded-modal shadow-modal w-full ${getSizeClasses(size)} ${className} animate-scale-in`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        aria-describedby={subtitle ? 'modal-subtitle' : undefined}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className={`insurance-card-header ${getTypeClasses(type)}`}>
            <div className="flex items-center gap-3">
              {getTypeIcon(type)}
              <div className="flex-1">
                {title && (
                  <h3 id="modal-title" className="text-lg font-semibold text-text-primary">
                    {title}
                  </h3>
                )}
                {subtitle && (
                  <p id="modal-subtitle" className="text-sm text-text-secondary mt-1">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>
            
            {showCloseButton && (
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center transition-colors"
                aria-label="Close modal"
              >
                <X className="h-4 w-4 text-neutral-600" />
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className="insurance-card-body">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="insurance-loading-spinner mx-auto mb-4" />
                <p className="text-text-secondary">Loading...</p>
              </div>
            </div>
          ) : (
            children
          )}
        </div>

        {/* Footer */}
        {footer && (
          <div className="insurance-card-footer">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default InsuranceModal;
