import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

const HomeLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    className="bg-gradient-to-br from-blue-950 via-blue-900 to-blue-700"
    style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Inter, sans-serif',
    }}
  >
    <Header />

    <main style={{ flex: 1, padding: '2rem 0' }}>{children}</main>
    <Footer />
  </div>
);

export default HomeLayout;
