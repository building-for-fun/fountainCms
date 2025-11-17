import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import HomeLayout from '../components/Layouts/HomeLayout/HomeLayout';

export default function LoginPage() {
  const [username, setUsername] = useState('admin@example.com');
  const [password, setPassword] = useState('password');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin@example.com' && password === 'password') {
      navigate('/admin');
    } else {
      alert('Invalid credentials');
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
          <form
            onSubmit={handleLogin}
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
            }}
          >
            <div>
              <label htmlFor="username" style={formInputLabelStyle}>
                Email address
              </label>
              <input
                id="email"
                type="email"
                placeholder="Email address"
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
              }}
            >
              Sign In
            </button>
          </form>
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
            <p style={{ fontWeight: 600, opacity: 0.9 }}>Login Info</p>
            <p style={{ opacity: 0.7 }}>admin@example.com</p>
            <p style={{ opacity: 0.7 }}>password</p>
          </div>
        </div>
      </div>
    </HomeLayout>
  );
}
