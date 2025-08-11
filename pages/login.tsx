import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { FaUser, FaLock } from "react-icons/fa";
import { useAuth } from '@/context/AuthContext'; // ✅ use our global auth context

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth(); //  get login function from context
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
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/login/`,
        form
      );

      // Instead of directly setting localStorage, update global context
      login(res.data.access, res.data.refresh);

      toast.success('Logged in successfully!');
      router.push('/products'); // no need for setTimeout anymore
    } catch (err) {
      setError('Invalid credentials');
      toast.error('Login failed. Check username and password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-200 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md border border-green-100">
        <h2 className="text-3xl font-extrabold text-green-800 mb-6 text-center">
          Login to Your Account
        </h2>

        {error && (
          <p className="text-red-600 text-sm mb-4 text-center">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {[
            { name: 'username', label: 'Username', type: 'text' },
            { name: 'password', label: 'Password', type: 'password' },
          ].map(({ name, label, type }) => {
            const Icon = name === 'username' ? FaUser : name === 'password' ? FaLock : null;

            return (
              <div key={name} className="flex flex-col">
                <label
                  htmlFor={name}
                  className="mb-1 text-sm font-semibold text-green-900"
                >
                  {label}
                </label>

                <div className="relative">
                  {Icon && (
                    <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  )}
                  <input
                    type={type}
                    name={name}
                    id={name}
                    value={(form as any)[name]}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600"
                    required
                  />
                </div>
              </div>
            );
          })}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center bg-green-700 hover:bg-green-800 text-white font-semibold py-2 px-4 rounded-md transition disabled:opacity-60"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </button>
        </form>

        <div className="mt-6 space-y-2 text-sm text-center text-gray-700">
          <p>
            Don’t have an account?{' '}
            <Link href="/register" className="text-green-700 hover:underline">
              Sign up
            </Link>
          </p>
          <p>
            <Link
              href="/users/reset-password"
              className="text-green-700 hover:underline"
            >
              Forgot password?
            </Link>
          </p>
          <p>
            <Link
              href="/admin/login"
              className="text-green-700 hover:underline"
            >
              Admin Login
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
