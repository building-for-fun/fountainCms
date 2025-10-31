import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <span className="text-7xl animate-bounce mb-4" role="img" aria-label="Lost">
        🧭
      </span>
      <h1 className="text-4xl font-bold mb-2">404 - Lost in Space!</h1>
      <p className="text-lg mb-4">
        Oops! The page you are looking for has wandered off. Maybe it joined the circus?
      </p>
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        onClick={() => navigate('/')}
      >
        Take Me Home
      </button>
    </div>
  );
}
