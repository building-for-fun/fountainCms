import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function InternalServerErrorPage() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <span className="text-7xl animate-spin mb-4" role="img" aria-label="Explosion">
        💥
      </span>
      <h1 className="text-4xl font-bold mb-2">500 - Server Oopsie!</h1>
      <p className="text-lg mb-4">Something broke on our end. Our team of hamsters is on it!</p>
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        onClick={() => navigate('/')}
      >
        Back to Safety
      </button>
    </div>
  );
}
