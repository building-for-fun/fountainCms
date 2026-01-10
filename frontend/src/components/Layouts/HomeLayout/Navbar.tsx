import React from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from '../../ThemeToggle';
import { PrimaryButton } from '../../PrimaryButton';

type NavbarProps = {
  onNavigate?: () => void;
  isMobile?: boolean;
};

const Navbar: React.FC<NavbarProps> = ({ onNavigate, isMobile = false }) => {
  return (
    <nav className={isMobile ? 'drawer-nav' : 'desktop-nav'}>
      <Link onClick={onNavigate} className="nav-link" to="/">
        Home
      </Link>

      <Link onClick={onNavigate} className="nav-link" to="/docs">
        Documentation
      </Link>

      {/* COMPACT THEME TOGGLE (MOBILE ONLY) */}
      {isMobile ? (
        <div className="drawer-theme-toggle">
          <ThemeToggle />
        </div>
      ) : (
        <ThemeToggle />
      )}

      <Link onClick={onNavigate} to="/login">
        <PrimaryButton>Get Started</PrimaryButton>
      </Link>
    </nav>
  );
};

export default Navbar;
