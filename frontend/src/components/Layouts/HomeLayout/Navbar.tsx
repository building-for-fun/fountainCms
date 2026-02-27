import React from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from '../../ThemeToggle';
import { PrimaryButton } from '../../PrimaryButton';
import { isAuthenticated } from '../../../lib/auth';
import './Navbar.css';

type NavbarProps = {
  onNavigate?: () => void;
  isMobile?: boolean;
};

const Navbar: React.FC<NavbarProps> = ({ onNavigate, isMobile = false }) => {
  return (
    <nav className={isMobile ? 'drawer-nav' : 'desktop-nav'}>
      <div className="nav-left">
        <Link onClick={onNavigate} className="nav-link" to="/">
          Home
        </Link>
        <Link onClick={onNavigate} className="nav-link" to="/docs">
          Documentation
        </Link>
      </div>

      <div className="nav-right">
        {isMobile ? (
          <div className="drawer-theme-toggle">
            <ThemeToggle />
          </div>
        ) : (
          <ThemeToggle />
        )}

        {isAuthenticated() ? (
          <Link onClick={onNavigate} to="/admin">
            <PrimaryButton className="enhanced-button">Dashboard</PrimaryButton>
          </Link>
        ) : (
          <Link onClick={onNavigate} to="/login">
            <PrimaryButton className="enhanced-button">Get Started</PrimaryButton>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
