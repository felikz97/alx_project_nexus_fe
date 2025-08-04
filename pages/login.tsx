import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.username.trim()) {
      setError('Username is required');
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post('http://localhost:8000/api/auth/login/', form);
      localStorage.setItem('access', res.data.access);
      localStorage.setItem('refresh', res.data.refresh);
      toast.success('Logged in successfully!');
      setTimeout(() => router.push('/'), 1000);
    } catch (err) {
      setError('Invalid credentials');
      toast.error('Login failed. Check username and password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-yellow-50 px-4">
      <div className="w-full max-w-md bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold text-green-800 mb-6 text-center">Login to Your Account</h2>
        {error && <p className="text-red-600 text-sm mb-4 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { name: 'username', label: 'Username', type: 'text' },
            { name: 'password', label: 'Password', type: 'password' },
          ].map(({ name, label, type }) => (
            <div key={name} className="flex flex-col">
              <label htmlFor={name} className="mb-1 text-sm font-medium text-green-800">
                {label}
              </label>
              <input
                type={type}
                name={name}
                value={(form as any)[name]}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-600"
                required
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-700 text-white py-2 rounded hover:bg-green-800 transition disabled:opacity-60"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Logging in...
              </div>
            ) : (
              'Login'
            )}
          </button>
        </form>

        <div className="mt-4 flex flex-col sm:flex-row justify-between text-sm text-center text-gray-600 gap-2 sm:gap-0">
          <span>
            Don’t have an account?{' '}
            <Link href="/register" className="text-green-700 hover:underline">
              Sign up
            </Link>
          </span>
          <Link href="/users/reset-password" className="text-green-700 hover:underline">
            Forgot password?
          </Link>
        </div>
      </div>
    </div>
  );
}
