import React from 'react'
import { Link } from 'react-router-dom'
import ThemeToggle from '../../ThemeToggle'
import { PrimaryButton } from '../../PrimaryButton'

export const Header = () => {
  return (
    <>
     <header
      style={{
        background: 'var(--color-primary)',
        color: 'var(--color-surface)',
        padding: '1.5rem 0',
        textAlign: 'center',
        fontWeight: 700,
        fontSize: '2rem',
        letterSpacing: '-1px',
      }}
    >
      FountainCMS
    </header>
    {/* Navigation */}
    <nav
      style={{
        background: 'var(--color-surface)',
        boxShadow: 'var(--shadow-sm)',
        padding: '0.75rem 0',
        display: 'flex',
        justifyContent: 'center',
        gap: '2rem',
      }}
    >
      <Link
        to="/"
        style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 600 }}
      >
        Home
      </Link>
      <Link
        to="/docs"
        style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 600 }}
      >
        Documentation
      </Link>
      <Link
        to="/login"
        style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 600 }}
      >
        Login
      </Link>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <ThemeToggle />
        <PrimaryButton>Get Started</PrimaryButton>
      </div>
    </nav>
    </>
  )
}
