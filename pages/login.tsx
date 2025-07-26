import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8000/api/auth/login/', form);
      localStorage.setItem('access', res.data.access);
      localStorage.setItem('refresh', res.data.refresh);
      router.push('/'); // redirect after login
    } catch (err: any) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      {error && <p className="text-red-600">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="username" onChange={handleChange} value={form.username} placeholder="Username" className="w-full p-2 border rounded" />
        <input name="password" type="password" onChange={handleChange} value={form.password} placeholder="Password" className="w-full p-2 border rounded" />
        <button type="submit" className="bg-green-700 text-white px-4 py-2 rounded">Login</button>
      </form>
    </div>
  );
}
