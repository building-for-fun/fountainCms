import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from '../../ThemeToggle';
import { PrimaryButton } from '../../PrimaryButton';
import { isAuthenticated } from '../../../lib/auth';
import { navbarStyles as s } from './navbar.styles';

type NavbarProps = {
  onNavigate?: () => void;
  isMobile?: boolean;
};

const Navbar: React.FC<NavbarProps> = ({ onNavigate, isMobile = false }) => {
  const { pathname } = useLocation();

  const linkClass = (to: string) => [s.linkBase, pathname === to ? s.linkActive : ''].join(' ');

  return (
    <nav className={isMobile ? s.mobile : s.desktop} aria-label="Primary">
      <div className={isMobile ? s.linksColMobile : s.linksRowDesktop}>
        <Link onClick={onNavigate} className={linkClass('/')} to="/">
          Home
        </Link>
        <Link onClick={onNavigate} className={linkClass('/docs')} to="/docs">
          Documentation
        </Link>
      </div>

      <div className={isMobile ? s.rightMobile : s.rightDesktop}>
        {isMobile ? (
          <div className={s.mobileToggleWrap}>
            <ThemeToggle />
          </div>
        ) : (
          <ThemeToggle />
        )}

        <div className={s.ctaWrap}>
          {isAuthenticated() ? (
            <Link onClick={onNavigate} to="/admin">
              <PrimaryButton>Dashboard</PrimaryButton>
            </Link>
          ) : (
            <Link onClick={onNavigate} to="/login">
              <PrimaryButton>Get Started</PrimaryButton>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
