import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function UnauthorizedPage() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <span className="text-7xl animate-pulse mb-4" role="img" aria-label="Lock">
        🔒
      </span>
      <h1 className="text-4xl font-bold mb-2">401 - Access Denied!</h1>
      <p className="text-lg mb-4">Looks like you need a secret password... or maybe a magic key?</p>
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        onClick={() => navigate('/')}
      >
        Go Home
      </button>
    </div>
  );
}
