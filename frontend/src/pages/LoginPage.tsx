import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="max-w-md bg-[#f59e42] text-white flex flex-col justify-center items-center px-8 py-12 min-h-screen shadow-lg">
        <div className="flex items-center gap-2 mb-10">
          <h1 className="text-xl font-semibold select-none text-white">YourApp</h1>
        </div>
        <h2 className="text-3xl font-bold mb-8 text-white">Sign In</h2>
        <form onSubmit={handleLogin} className="w-full space-y-8">
          <div>
            <label htmlFor="username" className="block mb-2 text-base font-medium text-[#1e293b]">
              Email address
            </label>
            <input
              id="email"
              type="email"
              placeholder="Email address"
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full rounded-lg bg-white px-5 py-3 text-base border border-[#f59e42] text-[#1e293b] placeholder-[#f59e42] focus:outline-none focus:ring-2 focus:ring-[#1e293b] focus:ring-offset-2 focus:ring-offset-[#f59e42]"
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-2 text-base font-medium text-[#1e293b]">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg bg-white px-5 py-3 text-base border border-[#f59e42] text-[#1e293b] placeholder-[#f59e42] focus:outline-none focus:ring-2 focus:ring-[#1e293b] focus:ring-offset-2 focus:ring-offset-[#f59e42]"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-[#f59e42] py-3 text-lg font-semibold  transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#1e293b] focus:ring-offset-2 focus:ring-offset-[#f59e42] text-white"
          >
            Sign In
          </button>
        </form>
      </aside>
      {/* Right gradient area */}
      <div className="flex-1 flex flex-col justify-center items-center px-10 min-h-screen">
        <h1 className="text-2xl font-bold mb-4 text-indigo-100">Welcome to Our Demo 🚀</h1>
        <p className="text-indigo-200 max-w-md text-center">
          The credentials are already populated for you. Just click <strong>Sign In</strong> on the
          left ✌️
        </p>
        <div className="mt-6 bg-black/40 px-4 py-2 rounded text-sm text-center space-y-1 select-none">
          <p className="text-indigo-200">Login Info</p>
          <p className="text-indigo-100">admin@example.com</p>
          <p className="text-indigo-100">password</p>
        </div>
      </div>
    </div>
  );
}
