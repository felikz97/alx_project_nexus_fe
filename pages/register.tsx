import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: '', Full_Name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/api/auth/register/', form);
      toast.success('Account created! Redirecting to login...');
      setTimeout(() => router.push('/login'), 1500);
    } catch (err) {
      setError('Registration failed');
      toast.error('Registration failed. Try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-yellow-50 px-4">
      <div className="w-full max-w-md bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold text-green-800 mb-6 text-center">Create an Account</h2>
        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { name: 'username', label: 'Username', type: 'text' },
            { name: 'Full_Name', label: 'Full Name', type: 'text' },
            { name: 'email', label: 'Email', type: 'email' },
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

          <button type="submit" className="w-full bg-green-700 text-white py-2 rounded hover:bg-green-800 transition">
            Register
          </button>
        </form>

        <p className="text-sm text-center mt-4 text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="text-green-700 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
