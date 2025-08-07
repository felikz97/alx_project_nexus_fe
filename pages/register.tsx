import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { FaUser, FaLock } from "react-icons/fa";
import {RequiredLabel} from '@/utils/required'
export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    username: '',
    Full_Name: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/register/`, form);
      toast.success('Account created! Redirecting to login...');
      setTimeout(() => router.push('/login'), 1500);
    } catch (err) {
      setError('Registration failed');
      toast.error('Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md border border-yellow-200">
        <h2 className="text-3xl font-extrabold text-green-800 mb-6 text-center">
          Create an Account
        </h2>

        {error && (
          <p className="text-red-600 text-sm mb-4 text-center">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {[
            { name: 'username', label: 'Username', type: 'text' },
            { name: 'Full_Name', label: 'Full Name', type: 'text' },
            { name: 'email', label: 'Email', type: 'email' },
          ].map(({ name, label, type }) => (
            <div key={name} className="flex flex-col">
              <RequiredLabel htmlFor={name}>{label}</RequiredLabel>
              <input
                type={type}
                name={name}
                value={(form as any)[name]}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600"
                required
              />
            </div>
          ))}

          {/* Password with toggle */}
          <div className="flex flex-col">
              <label
                htmlFor="password"
                className="mb-1 text-sm font-semibold text-green-900"
              >
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-16 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600"
                  required
                />
                {/* Show/Hide toggle */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-green-700 hover:underline focus:outline-none"
                >
                  
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
          
          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center bg-green-700 hover:bg-green-800 text-white font-semibold py-2 px-4 rounded-md transition disabled:opacity-60"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Creating account...
              </>
            ) : (
              'Register'
            )}
          </button>
        </form>

        <p className="text-sm text-center mt-6 text-gray-700">
          Already have an account?{' '}
          <Link href="/login" className="text-green-700 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </main>
  );
}
