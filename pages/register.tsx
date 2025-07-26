import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: '', Full_Name:'', email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/api/auth/register/', form);
      router.push('/login');
    } catch (err: any) {
      setError('Registration failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
      {error && <p className="text-red-600">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="username" onChange={handleChange} value={form.username} placeholder="Username" className="w-full p-2 border rounded" />
        <input name="email" onChange={handleChange} value={form.email} placeholder="Email" className="w-full p-2 border rounded" />
        <input name="password" type="password" onChange={handleChange} value={form.password} placeholder="Password" className="w-full p-2 border rounded" />
        <button type="submit" className="bg-green-700 text-white px-4 py-2 rounded">Register</button>
      </form>
    </div>
  );
}
