import React from 'react';
import { Link, useLocation } from '@tanstack/react-router';

const navItems = [
  { to: '/', icon: '🏠', label: 'Home' },
  { to: '/docs', icon: '📄', label: 'Docs' },
  { to: '/admin', icon: '🛠️', label: 'Admin' },
];

export default function Sidebar() {
  const location = useLocation();
  return (
    <nav
      style={{
        width: 64,
        background: '#fff',
        borderRight: '1px solid #e5e7eb',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '1rem 0',
        minHeight: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 100,
      }}
    >
      {navItems.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          title={item.label}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: 48,
            height: 48,
            margin: '0.5rem 0',
            borderRadius: 12,
            background: location.pathname === item.to ? '#6366f1' : 'transparent',
            color: location.pathname === item.to ? '#fff' : '#6366f1',
            fontSize: 24,
            textDecoration: 'none',
            transition: 'background 0.2s, color 0.2s',
          }}
        >
          <span>{item.icon}</span>
          <span style={{ fontSize: 10, marginTop: 2 }}>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}
