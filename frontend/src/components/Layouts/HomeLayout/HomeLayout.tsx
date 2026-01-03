import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

const HomeLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    className="mx-auto min-h-screen flex flex-col"
    style={{
      background: 'linear-gradient(135deg, var(--color-bg) 0%, var(--color-primary-light) 100%)',
    }}
  >
    <Header />
    <main>{children}</main>
    <Footer />
  </div>
);

export default HomeLayout;
