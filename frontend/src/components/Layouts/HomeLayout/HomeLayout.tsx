import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

const HomeLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(135deg, var(--color-bg), var(--color-primary-light))',
        overflowX: 'hidden', // ✅ important for mobile
      }}
    >
      <Header />
      <main style={{ flex: 1, width: '100%' }}>{children}</main>
      <Footer />
    </div>
  );
};

export default HomeLayout;
