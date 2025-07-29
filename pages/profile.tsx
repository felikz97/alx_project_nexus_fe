import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function ProfilePage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: '', email: '', is_seller: false });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

useEffect(() => {
  const fetchProfile = async () => {
    const token = localStorage.getItem('access');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const res = await axios.get('http://localhost:8000/api/users/profile/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setForm(res.data);
    } catch {
      setMessage('Failed to load profile.');
    } finally {
      setLoading(false);
    }
  };

  fetchProfile();
}, []);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const token = localStorage.getItem('access');

    try {
      await axios.put('http://localhost:8000/api/users/profile/', form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage(' Profile updated!');
    } catch {
      setMessage(' Failed to update profile.');
    }
  };

  const becomeSeller = () => {
    setForm(prev => ({ ...prev, is_seller: true }));
    setMessage(' You are now a seller!');
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold text-green-800 mb-4">Your Profile</h1>
      {message && <p className="mb-4 text-green-700">{message}</p>}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Username"
            className="w-full p-2 border rounded"
          />
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full p-2 border rounded"
          />

          <button
            type="button"
            onClick={becomeSeller}
            className={`px-4 py-2 rounded text-white ${
              form.is_seller ? 'bg-gray-500 cursor-default' : 'bg-yellow-500 hover:bg-yellow-600'
            }`}
            disabled={form.is_seller}
          >
            {form.is_seller ? ' You are a Seller' : 'Become a Seller'}
          </button>

          <button type="submit" className="bg-green-700 text-white px-4 py-2 rounded block w-full mt-4">
            Save Profile
          </button>
        </form>
      )}
    </div>
  );
}
