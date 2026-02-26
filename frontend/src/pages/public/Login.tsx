import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import HomeLayout from '../../components/Layouts/HomeLayout/HomeLayout';
import { login as persistLogin, isAuthenticated } from '../../lib/auth';
import { fetchAuthConfig, login as apiLogin, type AuthConfig } from '../../api/auth';

export default function Login() {
  const [username, setUsername] = useState('admin@example.com');
  const [password, setPassword] = useState('password');
  const [authConfig, setAuthConfig] = useState<AuthConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/admin', { replace: true });
      return;
    }
    const errorParam = searchParams.get('error');
    if (errorParam) {
      setError(
        errorParam === 'callback_failed'
          ? 'SSO sign-in failed. Please try again.'
          : errorParam === 'missing_params'
            ? 'Missing authorization parameters.'
            : 'An error occurred. Please try again.'
      );
    }
    fetchAuthConfig()
      .then(setAuthConfig)
      .catch(() => setAuthConfig({ mode: 'local' }))
      .finally(() => setLoading(false));
  }, [navigate, searchParams]);

  const handleLocalLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await apiLogin(username, password);
      persistLogin({
        id: res.user.id,
        email: res.user.email,
        role: res.user.role ?? 'Super Admin',
        token: res.token,
      });
      navigate('/admin', { replace: true });
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message: string }).message)
          : 'Invalid credentials';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSsoRedirect = () => {
    if (authConfig?.loginUrl) {
      window.location.href = authConfig.loginUrl;
    }
  };

  const formInputLabelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: '0.5rem',
    fontSize: '0.9rem',
    fontWeight: 500,
    color: 'var(--color-text)',
    opacity: 0.8,
  };

  const formInputStyle: React.CSSProperties = {
    background: 'rgba(255, 255, 255, 0.2)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '8px',
    width: '100%',
    padding: '0.85rem 1rem',
    fontSize: '1rem',
    color: 'var(--color-text)',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'all 0.3s ease',
  };

  if (loading) {
    return (
      <HomeLayout>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
          <p style={{ color: 'var(--color-text)', opacity: 0.8 }}>Loading...</p>
        </div>
      </HomeLayout>
    );
  }

  const isLocal = authConfig?.mode === 'local';
  const showSso =
    (authConfig?.mode === 'oauth2' || authConfig?.mode === 'saml') && authConfig?.loginUrl;

  return (
    <HomeLayout>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem 1rem',
        }}
      >
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(15px)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.2)',
            padding: '2.5rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            maxWidth: '420px',
            minWidth: '320px',
          }}
        >
          <h2
            style={{
              fontSize: '2.25rem',
              fontWeight: 700,
              marginBottom: '2rem',
              color: 'var(--color-primary)',
            }}
          >
            Sign In
          </h2>

          {error && (
            <div
              style={{
                width: '100%',
                marginBottom: '1rem',
                padding: '0.75rem',
                background: 'rgba(220, 53, 69, 0.2)',
                borderRadius: '8px',
                color: 'var(--color-text)',
                fontSize: '0.9rem',
              }}
            >
              {error}
            </div>
          )}

          {showSso && (
            <>
              <button
                type="button"
                onClick={handleSsoRedirect}
                className="primary-button-animated"
                style={{
                  width: '100%',
                  borderRadius: '8px',
                  background: 'var(--color-primary)',
                  padding: '0.85rem',
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: 'var(--color-surface)',
                  border: 'none',
                  cursor: 'pointer',
                  marginBottom: isLocal ? '1rem' : 0,
                }}
              >
                Sign in with SSO
              </button>
              {isLocal && (
                <p style={{ margin: '1rem 0', opacity: 0.8, fontSize: '0.9rem' }}>
                  or sign in with email
                </p>
              )}
            </>
          )}

          {isLocal && (
            <form
              onSubmit={handleLocalLogin}
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
              }}
            >
              <div>
                <label htmlFor="email" style={formInputLabelStyle}>
                  Email or username
                </label>
                <input
                  id="email"
                  type="text"
                  placeholder="Email or username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  style={formInputStyle}
                  className="glass-input"
                />
              </div>
              <div>
                <label htmlFor="password" style={formInputLabelStyle}>
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={formInputStyle}
                  className="glass-input"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="primary-button-animated"
                style={{
                  width: '100%',
                  borderRadius: '8px',
                  background: 'var(--color-primary)',
                  padding: '0.85rem',
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: 'var(--color-surface)',
                  border: 'none',
                  cursor: submitting ? 'wait' : 'pointer',
                }}
              >
                {submitting ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          )}

          {isLocal && (
            <div
              style={{
                marginTop: '1.5rem',
                background: 'rgba(var(--color-primary-rgb), 0.1)',
                padding: '1rem',
                borderRadius: '8px',
                fontSize: '0.9rem',
                textAlign: 'center',
                width: '100%',
                boxSizing: 'border-box',
                color: 'var(--color-primary)',
              }}
            >
              <p style={{ fontWeight: 600, opacity: 0.9 }}>Default login</p>
              <p style={{ opacity: 0.7 }}>admin@example.com or admin</p>
              <p style={{ opacity: 0.7 }}>password</p>
            </div>
          )}
        </div>
      </div>
    </HomeLayout>
  );
}
