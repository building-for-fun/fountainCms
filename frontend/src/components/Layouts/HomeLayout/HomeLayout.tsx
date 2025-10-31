import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

const HomeLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Inter, sans-serif',
      background: 'linear-gradient(135deg, var(--color-bg) 0%, var(--color-primary-light) 100%)',
      color: 'var(--color-text)',
    }}
  >
   <Header/>
   
    <main style={{ flex: 1, padding: '2rem 0' }}>{children}</main>
   <Footer/>
  </div>
);

export default HomeLayout;
