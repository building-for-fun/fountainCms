import { ChangeEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HomeLayout from '../components/Layouts/HomeLayout/HomeLayout';

export default function LoginPage() {
  const [username, setUsername] = useState<string>('admin@example.com');
  const [password, setPassword] = useState<string>('password');
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
      <div className="flex items-center justify-center  ">
        <div
          className="bg-white rounded-2xl p-10 flex flex-col items-center w-full max-w-md bg-neutral-100/10"
          style={{ width: '40%', minWidth: '350px' }}
        >
          <div className=" w-full flex flex-col items-center text-center">
            <h3 className=" text-2xl md:text-xl mb-2 font-semibold ">
              {"Let's"} get you signed in
            </h3>
          </div>
          <form onSubmit={handleLogin} className="w-full space-y-8 ">
            <div style={{ marginBottom: '20px' }}>
              <label
                htmlFor="username"
                className="block mb-4 text-base font-medium text-white"
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
                className=" w-full h-12 bg-slate-900/50 text-white rounded-lg px-3 py-1 placeholder:text-neutral-200  "
              />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label
                htmlFor="password"
                className="block mb-2 text-base font-medium text-white"
                style={{ marginBottom: '7px' }}
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                required
                className=" w-full h-12 bg-slate-900/50 text-white rounded-lg px-3 py-1 placeholder:text-neutral-200  "
              />
            </div>
            <button
              type="submit"
              className=" w-full h-12 hover:bg-white hover:text-black cursor-pointer transition-all duration-200 ease-in-out hover:scale-95 bg-cyan-600 text-white rounded-lg flex justify-center items-center "
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
