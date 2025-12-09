import { useState } from 'react';
import { 
  Eye, 
  EyeOff, 
  Calendar, 
  Upload, 
  Check,
  AlertCircle,
  RefreshCw
} from 'lucide-react';

const InsuranceForm = ({
  title,
  subtitle,
  fields = [],
  onSubmit,
  onCancel,
  loading = false,
  className = '',
  showHeader = true,
  submitText = 'Submit',
  cancelText = 'Cancel',
  showCancel = true,
  size = 'medium' // small, medium, large
}) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [showPasswords, setShowPasswords] = useState({});

  const getSizeClasses = (size) => {
    switch (size) {
      case 'small':
        return 'max-w-md';
      case 'large':
        return 'max-w-4xl';
      default:
        return 'max-w-2xl';
    }
  };

  const handleInputChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    const newErrors = {};
    fields.forEach(field => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label} is required`;
      }
      
      if (field.validation && formData[field.name]) {
        const validationResult = field.validation(formData[field.name]);
        if (validationResult !== true) {
          newErrors[field.name] = validationResult;
        }
      }
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSubmit(formData);
    }
  };

  const togglePasswordVisibility = (fieldName) => {
    setShowPasswords(prev => ({
      ...prev,
      [fieldName]: !prev[fieldName]
    }));
  };

  const renderField = (field) => {
    const fieldError = errors[field.name];
    const fieldValue = formData[field.name] || '';

    switch (field.type) {
      case 'text':
      case 'email':
      case 'tel':
        return (
          <div key={field.name} className="space-y-2">
            <label className="block text-sm font-medium text-text-primary">
              {field.label}
              {field.required && <span className="text-danger-500 ml-1">*</span>}
            </label>
            <input
              type={field.type}
              name={field.name}
              value={fieldValue}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              className={`insurance-input ${fieldError ? 'border-danger-500 focus:ring-danger-100' : ''}`}
              disabled={field.disabled}
            />
            {field.helpText && (
              <p className="text-sm text-text-secondary">{field.helpText}</p>
            )}
            {fieldError && (
              <p className="text-sm text-danger-600 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {fieldError}
              </p>
            )}
          </div>
        );

      case 'password':
        return (
          <div key={field.name} className="space-y-2">
            <label className="block text-sm font-medium text-text-primary">
              {field.label}
              {field.required && <span className="text-danger-500 ml-1">*</span>}
            </label>
            <div className="relative">
              <input
                type={showPasswords[field.name] ? 'text' : 'password'}
                name={field.name}
                value={fieldValue}
                onChange={(e) => handleInputChange(field.name, e.target.value)}
                placeholder={field.placeholder}
                className={`insurance-input pr-10 ${fieldError ? 'border-danger-500 focus:ring-danger-100' : ''}`}
                disabled={field.disabled}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility(field.name)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-tertiary hover:text-text-secondary"
              >
                {showPasswords[field.name] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {field.helpText && (
              <p className="text-sm text-text-secondary">{field.helpText}</p>
            )}
            {fieldError && (
              <p className="text-sm text-danger-600 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {fieldError}
              </p>
            )}
          </div>
        );

      case 'select':
        return (
          <div key={field.name} className="space-y-2">
            <label className="block text-sm font-medium text-text-primary">
              {field.label}
              {field.required && <span className="text-danger-500 ml-1">*</span>}
            </label>
            <select
              name={field.name}
              value={fieldValue}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              className={`insurance-select ${fieldError ? 'border-danger-500 focus:ring-danger-100' : ''}`}
              disabled={field.disabled}
            >
              <option value="">{field.placeholder || 'Select an option'}</option>
              {field.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {field.helpText && (
              <p className="text-sm text-text-secondary">{field.helpText}</p>
            )}
            {fieldError && (
              <p className="text-sm text-danger-600 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {fieldError}
              </p>
            )}
          </div>
        );

      case 'textarea':
        return (
          <div key={field.name} className="space-y-2">
            <label className="block text-sm font-medium text-text-primary">
              {field.label}
              {field.required && <span className="text-danger-500 ml-1">*</span>}
            </label>
            <textarea
              name={field.name}
              value={fieldValue}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              rows={field.rows || 3}
              className={`insurance-input ${fieldError ? 'border-danger-500 focus:ring-danger-100' : ''}`}
              disabled={field.disabled}
            />
            {field.helpText && (
              <p className="text-sm text-text-secondary">{field.helpText}</p>
            )}
            {fieldError && (
              <p className="text-sm text-danger-600 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {fieldError}
              </p>
            )}
          </div>
        );

      case 'date':
        return (
          <div key={field.name} className="space-y-2">
            <label className="block text-sm font-medium text-text-primary">
              {field.label}
              {field.required && <span className="text-danger-500 ml-1">*</span>}
            </label>
            <div className="relative">
              <input
                type="date"
                name={field.name}
                value={fieldValue}
                onChange={(e) => handleInputChange(field.name, e.target.value)}
                className={`insurance-input ${fieldError ? 'border-danger-500 focus:ring-danger-100' : ''}`}
                disabled={field.disabled}
              />
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-tertiary pointer-events-none" />
            </div>
            {field.helpText && (
              <p className="text-sm text-text-secondary">{field.helpText}</p>
            )}
            {fieldError && (
              <p className="text-sm text-danger-600 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {fieldError}
              </p>
            )}
          </div>
        );

      case 'file':
        return (
          <div key={field.name} className="space-y-2">
            <label className="block text-sm font-medium text-text-primary">
              {field.label}
              {field.required && <span className="text-danger-500 ml-1">*</span>}
            </label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary-300 transition-colors">
              <Upload className="h-8 w-8 text-text-tertiary mx-auto mb-2" />
              <p className="text-sm text-text-secondary mb-2">
                {field.placeholder || 'Click to upload or drag and drop'}
              </p>
              <input
                type="file"
                name={field.name}
                onChange={(e) => handleInputChange(field.name, e.target.files[0])}
                accept={field.accept}
                className="hidden"
                id={`file-${field.name}`}
                disabled={field.disabled}
              />
              <label
                htmlFor={`file-${field.name}`}
                className="insurance-btn insurance-btn-secondary cursor-pointer"
              >
                Choose File
              </label>
            </div>
            {field.helpText && (
              <p className="text-sm text-text-secondary">{field.helpText}</p>
            )}
            {fieldError && (
              <p className="text-sm text-danger-600 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {fieldError}
              </p>
            )}
          </div>
        );

      case 'checkbox':
        return (
          <div key={field.name} className="space-y-2">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                name={field.name}
                checked={fieldValue}
                onChange={(e) => handleInputChange(field.name, e.target.checked)}
                className="w-4 h-4 text-primary-600 border-border rounded focus:ring-primary-500"
                disabled={field.disabled}
              />
              <span className="text-sm font-medium text-text-primary">
                {field.label}
                {field.required && <span className="text-danger-500 ml-1">*</span>}
              </span>
            </label>
            {field.helpText && (
              <p className="text-sm text-text-secondary ml-7">{field.helpText}</p>
            )}
            {fieldError && (
              <p className="text-sm text-danger-600 flex items-center gap-1 ml-7">
                <AlertCircle className="h-4 w-4" />
                {fieldError}
              </p>
            )}
          </div>
        );

      case 'radio':
        return (
          <div key={field.name} className="space-y-2">
            <label className="block text-sm font-medium text-text-primary">
              {field.label}
              {field.required && <span className="text-danger-500 ml-1">*</span>}
            </label>
            <div className="space-y-2">
              {field.options?.map((option) => (
                <label key={option.value} className="flex items-center gap-3">
                  <input
                    type="radio"
                    name={field.name}
                    value={option.value}
                    checked={fieldValue === option.value}
                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                    className="w-4 h-4 text-primary-600 border-border focus:ring-primary-500"
                    disabled={field.disabled}
                  />
                  <span className="text-sm text-text-primary">{option.label}</span>
                </label>
              ))}
            </div>
            {field.helpText && (
              <p className="text-sm text-text-secondary">{field.helpText}</p>
            )}
            {fieldError && (
              <p className="text-sm text-danger-600 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {fieldError}
              </p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`insurance-card ${getSizeClasses(size)} mx-auto ${className}`}>
      {showHeader && (
        <div className="insurance-card-header">
          <div>
            <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
            {subtitle && (
              <p className="text-sm text-text-secondary mt-1">{subtitle}</p>
            )}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="insurance-card-body">
        <div className="space-y-6">
          {fields.map(renderField)}
        </div>

        <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-border">
          {showCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="insurance-btn insurance-btn-secondary"
              disabled={loading}
            >
              {cancelText}
            </button>
          )}
          
          <button
            type="submit"
            className="insurance-btn insurance-btn-primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Check className="h-4 w-4" />
                {submitText}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InsuranceForm;
