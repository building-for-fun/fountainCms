import React from 'react';
import { Link } from 'react-router-dom';
import { PrimaryButton } from '../../PrimaryButton';
import ThemeToggle from '../../ThemeToggle';

export const Navbar = () => {
  return (
    <nav
      className=" bg-transparent text-white"
      style={{
        padding: '0.75rem 0',
        display: 'flex',
        justifyContent: 'center',
        gap: '2rem',
      }}
    >
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <Link
          to="/"
          className=" text-lg hover:scale-95 transition-all duration-300 flex justify-center items-center ease-in-out bg-gradient-to-br h-[42px] from-cyan-700 via-cyan-600 to-purple-200 text-white px-5 py-1 rounded-lg cursor-pointer"
        >
          Home
        </Link>
        <Link
          to="/docs"
          className=" text-lg hover:scale-95 transition-all duration-300 flex justify-center items-center ease-in-out bg-gradient-to-br h-[42px] from-cyan-700 via-cyan-600 to-purple-200 text-white px-5 py-1 rounded-lg cursor-pointer"
        >
          Documentation
        </Link>
        <ThemeToggle />
        <Link to="/login">
          <PrimaryButton>Get Started</PrimaryButton>
        </Link>
      </div>
    </nav>
  );
};
