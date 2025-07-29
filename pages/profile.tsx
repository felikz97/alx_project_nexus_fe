import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import api from '@/utils/axiosInstance';

export default function ProfilePage() {
  const router = useRouter();

  const [form, setForm] = useState({
    username: '',
    email: '',
    address: '',
    mobile: '',
    is_seller: false,
    image: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/users/profile/')
      .then(res => {
        setForm(res.data);
        if (res.data.image) setPreview(res.data.image);
        setLoading(false);
      })
      .catch(() => {
        // Not authenticated or failed
        router.push('/login');  // ⬅️ redirect to login
      });
  }, []);

  if (loading) return <p className="p-6">Loading...</p>;

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => data.append(k, typeof v === 'boolean' ? String(v) : v));
    if (imageFile) data.append('image', imageFile);

    try {
      const res = await api.put('/api/users/profile/', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setForm(res.data);
      setMessage(' Profile updated');
    } catch {
      setMessage(' Failed to update profile.');
    }
  };

  const becomeSeller = () => {
    api.put('/api/users/profile/', { is_seller: true })
      .then(res => setForm(res.data))
      .catch(() => setMessage('Failed to become seller.'));
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold text-green-800 mb-6">Your Profile</h1>

      {message && <p className="mb-4 text-green-700">{message}</p>}

      <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-4 items-center text-sm">
        <label className="text-right">Username:</label>
        <input name="username" value={form.username} onChange={handleChange} className="col-span-2 p-2 border rounded" />

        <label className="text-right">Email:</label>
        <input name="email" value={form.email} onChange={handleChange} className="col-span-2 p-2 border rounded" />

        <label className="text-right">Mobile:</label>
        <input name="mobile" value={form.mobile || ''} onChange={handleChange} className="col-span-2 p-2 border rounded" />

        <label className="text-right">Address:</label>
        <input name="address" value={form.address || ''} onChange={handleChange} className="col-span-2 p-2 border rounded" />

        <label className="text-right">Image:</label>
        <input type="file" onChange={handleImage} className="col-span-2 p-2 border rounded" />

        {preview && (
          <>
            <label className="text-right">Preview:</label>
            <img src={preview} alt="Preview" className="w-20 h-20 rounded border col-span-2" />
          </>
        )}

        <div className="col-span-3 mt-4">
          {!form.is_seller && (
            <button
              type="button"
              onClick={becomeSeller}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded mr-4"
            >
              Become a Seller
            </button>
          )}

          <button
            type="submit"
            className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded"
          >
            Save Profile
          </button>
        </div>
      </form>
    </div>
  );
}
