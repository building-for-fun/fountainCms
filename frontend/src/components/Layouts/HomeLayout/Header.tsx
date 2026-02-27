import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import './Header.css';

export const Header = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="main-header">
        <div className="header-inner">
          <Link to="/" className="logo">
            FountainCMS
          </Link>

          {/* Desktop Navbar (hidden on mobile via CSS) */}
          <Navbar />

          {/* Mobile hamburger (shown on mobile via CSS) */}
          <button className="mobile-toggle" onClick={() => setOpen(true)} aria-label="Open menu">
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </header>

      {open && <div className="drawer-overlay" onClick={() => setOpen(false)} />}

      <aside className={`mobile-drawer ${open ? 'open' : ''}`}>
        <div className="drawer-header">
          <span className="drawer-title">Menu</span>
          <button className="drawer-close" onClick={() => setOpen(false)} aria-label="Close menu">
            ✕
          </button>
        </div>

        <Navbar isMobile onNavigate={() => setOpen(false)} />
      </aside>
    </>
  );
};
