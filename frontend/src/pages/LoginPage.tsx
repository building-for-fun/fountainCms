import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HomeLayout from '../components/Layouts/HomeLayout';

export default function LoginPage() {
  const [username, setUsername] = useState('admin@example.com');
  const [password, setPassword] = useState('password');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin@example.com' && password === 'password') {
      navigate('/admin');
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <HomeLayout>
      <div className="flex items-center justify-center">
        <div
          className="bg-white rounded-lg shadow-lg p-10 flex flex-col items-center w-full max-w-md"
          style={{ width: '40%', minWidth: '350px' }}
        >
          <h2 className="text-3xl font-bold mb-8 text-[#f59e42]">Sign In</h2>
          <form onSubmit={handleLogin} className="w-full space-y-8">
            <div style={{ marginBottom: '20px' }}>
              <label
                htmlFor="username"
                className="block mb-4 text-base font-medium text-[#1e293b]"
                style={{ marginBottom: '7px' }}
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                placeholder="Email address"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full rounded-lg bg-white px-5 py-3 text-base border border-[#f59e42] text-[#1e293b] placeholder-[#f59e42] focus:outline-none focus:ring-2 focus:ring-[#1e293b] focus:ring-offset-2 focus:ring-offset-[#f59e42]"
              />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label
                htmlFor="password"
                className="block mb-2 text-base font-medium text-[#1e293b]"
                style={{ marginBottom: '7px' }}
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-lg bg-white px-5 py-3 text-base border border-[#f59e42] text-[#1e293b] placeholder-[#f59e42] focus:outline-none focus:ring-2 focus:ring-[#1e293b] focus:ring-offset-2 focus:ring-offset-[#f59e42]"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-lg bg-[#f59e42] py-3 text-lg font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#1e293b] focus:ring-offset-2 focus:ring-offset-[#f59e42] text-white"
            >
              Sign In
            </button>
          </form>
          <div className="mt-6 bg-black/40 px-4 py-2 rounded text-sm text-center space-y-1 select-none w-full">
            <p className="text-indigo-200">Login Info</p>
            <p className="text-indigo-100">admin@example.com</p>
            <p className="text-indigo-100">password</p>
          </div>
        </div>
      </div>
    </HomeLayout>
  );
}
