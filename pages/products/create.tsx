import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import api from '@/utils/axiosInstance';

interface Category {
  id: number;
  name: string;
}

export default function CreateProductPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
  });

  const [userId, setUserId] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Fetch categories and current user
  useEffect(() => {
    api.get('/api/categories/')
      .then(res => setCategories(res.data.results || res.data))
      .catch(() => setError('Failed to load categories.'));

    api.get('/api/users/profile/')
      .then(res => setUserId(res.data.id?.toString()))
      .catch(() => setError('Failed to load user profile.'));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      alert('Only JPG, PNG, WEBP allowed');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert('Max size is 2MB');
      return;
    }

    setImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess(false);

    if (!userId) {
      setError('User not authenticated.');
      setSubmitting(false);
      return;
    }

    try {
      const data = new FormData();
      data.append('name', form.name);
      data.append('description', form.description);
      data.append('price', form.price);
      data.append('stock', form.stock);
      data.append('category', form.category);
      data.append('seller', userId);
      if (image) data.append('image', image);

      await api.post('/api/products/', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setForm({ name: '', description: '', price: '', stock: '', category: '' });
      setImage(null);
      setPreviewUrl(null);
      setSuccess(true);
      setTimeout(() => router.push('/'), 1500);
    } catch (err: any) {
      console.error('Create error:', err.response?.data || err.message);
      setError(err.response?.data?.error || 'Failed to create product.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4 text-green-800">Add New Product</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}
      {success && <p className="text-green-700 mb-4">✅ Product created successfully!</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" value={form.name} onChange={handleChange} placeholder="Product Name" className="w-full p-2 border rounded" required />
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="w-full p-2 border rounded" required />
        <input name="price" value={form.price} onChange={handleChange} placeholder="Price" type="number" className="w-full p-2 border rounded" required />
        <input name="stock" value={form.stock} onChange={handleChange} placeholder="Stock" type="number" className="w-full p-2 border rounded" required />

        <select name="category" value={form.category} onChange={handleChange} className="w-full p-2 border rounded" required>
          <option value="">Select Category</option>
          {categories.map(cat => (
            <option key={cat.id} value={String(cat.id)}>{cat.name}</option>
          ))}
        </select>

        <input type="file" onChange={handleFileChange} className="w-full p-2 border rounded" />
        {previewUrl && (
          <div className="w-40 h-40 border rounded overflow-hidden">
            <img src={previewUrl} alt="Preview" className="object-cover w-full h-full" />
          </div>
        )}

        <button type="submit" disabled={submitting} className="bg-green-700 text-white px-4 py-2 rounded w-full">
          {submitting ? 'Submitting...' : 'Create Product'}
        </button>
      </form>
    </div>
  );
}
