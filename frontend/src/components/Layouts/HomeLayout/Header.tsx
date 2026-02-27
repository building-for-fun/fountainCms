import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import { headerStyles as s } from './header.styles';

export const Header = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <header className={s.header}>
        <div className={s.inner}>
          <Link to="/" className={`${s.logoWrap} ${s.logoHover}`}>
            <span className={s.spark} />
            <span className={s.logo}>FountainCMS</span>
          </Link>

          <Navbar />

          <button
            className={s.mobileBtn}
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            type="button"
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 6h18M3 12h18M3 18h18"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </header>

      {open && (
        <button
          className={s.overlay}
          onClick={() => setOpen(false)}
          aria-label="Close overlay"
          type="button"
        />
      )}

      <aside
        className={[s.drawer, open ? s.drawerOpen : s.drawerClosed].join(' ')}
        aria-hidden={!open}
      >
        <div className={s.drawerHeader}>
          <span className={s.drawerTitle}>Menu</span>
          <button
            className={s.drawerClose}
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            type="button"
          >
            ✕
          </button>
        </div>

        <div className={s.drawerBody}>
          <Navbar isMobile onNavigate={() => setOpen(false)} />
        </div>
      </aside>
    </>
  );
};
