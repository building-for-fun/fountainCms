import React from 'react'

export const Footer = () => {
  return (
     <footer
      style={{
        background: 'var(--color-primary)',
        color: 'var(--color-surface)',
        textAlign: 'center',
        padding: '1rem 0',
        fontSize: '1rem',
        marginTop: 'auto',
      }}
    >
      &copy; {new Date().getFullYear()} FountainCMS. All rights reserved.
    </footer>
  )
}
