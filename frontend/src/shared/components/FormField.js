import { useFormContext } from 'react-hook-form';
import { AlertCircle } from 'lucide-react';

function FormField({
  name,
  label,
  type = 'text',
  id,
  placeholder,
  options = [],
  disabled = false,
  rules,
  wrapperClassName = '',
  inputProps = {},
  datalistId,
  datalistOptions = [],
}) {
  const { register, formState, getFieldState } = useFormContext();

  const fieldId = id || name;
  const fieldState = getFieldState(name, formState);
  const hasError = Boolean(fieldState.error) && (fieldState.isTouched || formState.isSubmitted);
  const isValid = !fieldState.error && fieldState.isTouched;

  return (
    <div className={`form-group ${wrapperClassName}`.trim()}>
      {label && <label htmlFor={fieldId}>{label}</label>}

      {type === 'select' ? (
        <select
          id={fieldId}
          {...register(name, rules)}
          disabled={disabled}
          className={`form-select ${hasError ? 'error' : isValid ? 'valid' : ''}`}
          style={{
            color: '#1E293B',
            backgroundColor: 'white',
            fontWeight: '500',
            border: '2px solid #CBD5E1',
            borderRadius: '12px',
            padding: '14px 16px',
            fontSize: '1rem',
            minHeight: '50px',
            position: 'relative',
            zIndex: 10,
          }}
        >
          {options.map((opt) => (
            <option
              key={String(opt.value)}
              value={opt.value}
              style={{
                backgroundColor: 'white',
                color: '#1E293B',
                fontWeight: '500',
                padding: '12px 16px',
                fontSize: '1rem',
                border: 'none',
                outline: 'none',
                minHeight: '40px',
              }}
            >
              {opt.label}
            </option>
          ))}
        </select>
      ) : type === 'checkbox' ? (
        <input
          type="checkbox"
          id={fieldId}
          {...register(name, rules)}
          disabled={disabled}
          className={hasError ? 'error' : ''}
          {...inputProps}
        />
      ) : (
        <>
          <input
            type={type}
            id={fieldId}
            placeholder={placeholder}
            {...register(name, rules)}
            disabled={disabled}
            className={hasError ? 'error' : isValid ? 'valid' : ''}
            list={datalistId}
            aria-autocomplete={datalistId ? 'list' : undefined}
            autoComplete={datalistId ? 'off' : undefined}
            {...inputProps}
          />
          {datalistId && datalistOptions.length > 0 && (
            <datalist id={datalistId}>
              {datalistOptions.map((opt) => (
                <option key={String(opt.value)} value={opt.value}>
                  {opt.label || opt.value}
                </option>
              ))}
            </datalist>
          )}
        </>
      )}

      {hasError && (
        <span className="error-message" role="alert" aria-live="polite">
          <AlertCircle size={16} />
          {fieldState.error?.message}
        </span>
      )}
    </div>
  );
}

export default FormField;
