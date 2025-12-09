import { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import './AuthCard.css';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function AuthCard({ onLogin, onRegister, defaultMode = 'login', logoSrc, appName }) {
  const [mode, setMode] = useState(defaultMode === 'register' ? 'register' : 'login');
  const [form, setForm] = useState({
    emailOrUsername: '',
    password: '',
    confirmPassword: '',
  });
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const isRegister = mode === 'register';

  const errors = useMemo(() => {
    const next = {};
    if (!form.emailOrUsername.trim()) {
      next.emailOrUsername = 'Required';
    } else if (form.emailOrUsername.includes('@') && !emailRegex.test(form.emailOrUsername)) {
      next.emailOrUsername = 'Enter a valid email';
    }
    if (!form.password) {
      next.password = 'Required';
    } else if (form.password.length < 8) {
      next.password = 'At least 8 characters';
    }
    if (isRegister) {
      if (!form.confirmPassword) {
        next.confirmPassword = 'Required';
      } else if (form.confirmPassword !== form.password) {
        next.confirmPassword = 'Passwords do not match';
      }
    }
    return next;
  }, [form, isRegister]);

  const isValid = Object.keys(errors).length === 0;

  function handleChange(evt) {
    const { name, value } = evt.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleBlur(evt) {
    const { name } = evt.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  }

  async function handleSubmit(evt) {
    evt.preventDefault();
    setTouched({ emailOrUsername: true, password: true, confirmPassword: true });
    if (!isValid) return;
    setSubmitting(true);
    try {
      if (isRegister) {
        await onRegister?.({
          emailOrUsername: form.emailOrUsername.trim(),
          password: form.password,
        });
      } else {
        await onLogin?.({
          emailOrUsername: form.emailOrUsername.trim(),
          password: form.password,
        });
      }
    } finally {
      setSubmitting(false);
    }
  }

  function switchMode(nextMode) {
    setMode(nextMode);
    setTouched({});
    setForm((prev) => ({ ...prev, password: '', confirmPassword: '' }));
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card" role="dialog" aria-labelledby="auth-card-title">
        {(logoSrc || appName) && (
          <div className="auth-brand">
            {logoSrc ? <img src={logoSrc} alt="" aria-hidden="true" /> : null}
            {appName ? <span className="app-name">{appName}</span> : null}
          </div>
        )}
        <div className="auth-tabs" role="tablist" aria-label="Authentication mode">
          <button
            type="button"
            className={`auth-tab ${!isRegister ? 'active' : ''}`}
            role="tab"
            aria-selected={!isRegister}
            onClick={() => switchMode('login')}
          >
            Login
          </button>
          <button
            type="button"
            className={`auth-tab ${isRegister ? 'active' : ''}`}
            role="tab"
            aria-selected={isRegister}
            onClick={() => switchMode('register')}
          >
            Sign up
          </button>
        </div>

        <h2 id="auth-card-title" className="auth-title">
          {isRegister ? 'Create your account' : 'Welcome back'}
        </h2>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <label className="auth-label" htmlFor="emailOrUsername">
            Email or Username
          </label>
          <input
            id="emailOrUsername"
            name="emailOrUsername"
            type="text"
            inputMode="email"
            autoComplete="username email"
            className={`auth-input ${touched.emailOrUsername && errors.emailOrUsername ? 'has-error' : ''}`}
            placeholder="you@example.com"
            value={form.emailOrUsername}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={Boolean(touched.emailOrUsername && errors.emailOrUsername)}
            aria-describedby={
              touched.emailOrUsername && errors.emailOrUsername ? 'email-error' : undefined
            }
          />
          {touched.emailOrUsername && errors.emailOrUsername ? (
            <div id="email-error" className="auth-error" role="alert">
              {errors.emailOrUsername}
            </div>
          ) : null}

          <label className="auth-label" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete={isRegister ? 'new-password' : 'current-password'}
            className={`auth-input ${touched.password && errors.password ? 'has-error' : ''}`}
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={Boolean(touched.password && errors.password)}
            aria-describedby={touched.password && errors.password ? 'password-error' : undefined}
          />
          {touched.password && errors.password ? (
            <div id="password-error" className="auth-error" role="alert">
              {errors.password}
            </div>
          ) : null}

          {isRegister && (
            <>
              <label className="auth-label" htmlFor="confirmPassword">
                Confirm password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                className={`auth-input ${touched.confirmPassword && errors.confirmPassword ? 'has-error' : ''}`}
                placeholder="••••••••"
                value={form.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={Boolean(touched.confirmPassword && errors.confirmPassword)}
                aria-describedby={
                  touched.confirmPassword && errors.confirmPassword ? 'confirm-error' : undefined
                }
              />
              {touched.confirmPassword && errors.confirmPassword ? (
                <div id="confirm-error" className="auth-error" role="alert">
                  {errors.confirmPassword}
                </div>
              ) : null}
            </>
          )}

          <button className="auth-submit" type="submit" disabled={submitting || !isValid}>
            {submitting ? 'Please wait…' : isRegister ? 'Create account' : 'Log in'}
          </button>

          <div className="auth-links">
            {!isRegister ? (
              <a className="auth-link" href="#forgot" onClick={(e) => e.preventDefault()}>
                Forgot password?
              </a>
            ) : (
              <span />
            )}
            <button
              type="button"
              className="auth-link switch"
              onClick={() => switchMode(isRegister ? 'login' : 'register')}
            >
              {isRegister ? 'Have an account? Log in' : 'New here? Create account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

AuthCard.propTypes = {
  onLogin: PropTypes.func,
  onRegister: PropTypes.func,
  defaultMode: PropTypes.oneOf(['login', 'register']),
  logoSrc: PropTypes.string,
  appName: PropTypes.string,
};
