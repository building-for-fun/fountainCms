import React from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from '../../ThemeToggle';
import { PrimaryButton } from '../../PrimaryButton';
import { Navbar } from './Navbar';

export const Header = () => {
  return (
    <>
      <header
        className=" bg-blue-950 text-white"
        style={{
          padding: '1.5rem 0',
          textAlign: 'center',
          fontWeight: 700,
          fontSize: '2rem',
          letterSpacing: '-1px',
        }}
      >
        FountainCMS
      </header>
      <Navbar />
    </>
  );
};
