import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';

export const Header = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* HEADER */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: 'rgba(255,255,255,0.15)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <div className="header-inner">
          {/* LOGO */}
          <Link
            to="/"
            style={{
              fontSize: '1.6rem',
              fontWeight: 800,
              color: 'var(--color-primary)',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            FountainCMS
          </Link>

          {/* DESKTOP NAV */}
          <Navbar />

          {/* MOBILE HAMBURGER */}
          <button
            className="mobile-toggle"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
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

      {/* OVERLAY */}
      {open && (
        <div className="drawer-overlay" onClick={() => setOpen(false)} />
      )}

      {/* LEFT SIDE DRAWER */}
      <aside className={`mobile-drawer ${open ? 'open' : ''}`}>
        <div className="drawer-header">
          <span className="drawer-title">Menu</span>
          <button
            className="drawer-close"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        {/* MOBILE NAV */}
        <Navbar isMobile onNavigate={() => setOpen(false)} />
      </aside>

      <style>{`
        /* HEADER */
        .header-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 14px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .desktop-nav {
          display: flex;
          gap: 20px;
          align-items: center;
        }

        .nav-link {
          color: var(--color-primary);
          font-weight: 600;
          text-decoration: none;
        }

        .mobile-toggle {
          display: none;
          background: transparent;
          border: none;
          cursor: pointer;
          color: var(--color-primary);
        }

        /* OVERLAY */
        .drawer-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.4);
          z-index: 60;
        }
          

        /* DRAWER */
        .mobile-drawer {
          position: fixed;
          top: 0;
          left: 0;
          height: 100%;
          width: 85%;
          max-width: 320px;
          background: var(--color-bg);
          box-shadow: 4px 0 24px rgba(0,0,0,0.2);
          z-index: 70;
          transform: translateX(-100%);
          transition: transform 0.3s ease;
          display: flex;
          flex-direction: column;
          padding: 20px;
        }

        .mobile-drawer.open {
          transform: translateX(0);
        }

        .drawer-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .drawer-title {
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--color-text);
        }

        .drawer-close {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: var(--color-text);
        }

        .drawer-nav {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .drawer-theme-toggle {
        width: fit-content;
        max-width: 160px;
        }

       .drawer-theme-toggle button {
        padding: 6px 10px;
       font-size: 0.85rem;
       border-radius: 10px;
       }


        @media (max-width: 768px) {
          .desktop-nav {
            display: none;
          }

          .mobile-toggle {
            display: block;
          }

          .header-inner {
            padding: 12px 16px;
          }
        }
      `}</style>
    </>
  );
};
