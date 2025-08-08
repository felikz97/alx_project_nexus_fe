//pages/products/edit/.tsx
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import api from '@/utils/axiosInstance';

interface Category {
  id: number;
  name: string;
}

export default function EditProductPage() {
  const router = useRouter();
  const { id } = router.query;

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedShoeSizes, setSelectedShoeSizes] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const toggleItem = <T,>(list: T[], value: T): T[] =>
    list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

  // Auth check
  useEffect(() => {
    const token = localStorage.getItem('access');
    if (!token) {
      router.push('/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  // Load product
  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/api/products/${id}/`);
        const product = res.data;
        setForm({
          name: product.name,
          description: product.description,
          price: product.price,
          stock: product.stock,
          category: product.category?.toString() || '',
        });
        setSelectedSizes(product.sizes || []);
        setSelectedColors(product.colors || []);
        setSelectedShoeSizes(product.shoe_sizes || []);
        if (product.image) {
          const imgUrl = product.image.startsWith('http')
            ? product.image
            : `${process.env.NEXT_PUBLIC_API_BASE_URL}${product.image}`;
          setPreviewUrl(imgUrl);
        }
      } catch (err) {
        setMessage('Failed to load product.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // Load categories
  useEffect(() => {
    api.get('/api/categories/')
      .then(res => setCategories(res.data.results || res.data))
      .catch(() => setMessage('Failed to load categories.'));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    try {
      const data = new FormData();
      Object.entries(form).forEach(([key, value]) => data.append(key, value));
      if (image) data.append('image', image);
      data.append('sizes', JSON.stringify(selectedSizes));
      data.append('colors', JSON.stringify(selectedColors));
      data.append('shoe_sizes', JSON.stringify(selectedShoeSizes));

      await api.patch(`/api/products/${id}/`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setMessage(' Product updated.');
      setTimeout(() => router.push('/'), 1500);
    } catch (err) {
      setMessage('Update failed.');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.delete(`/api/products/${id}/`);
      alert(' Product deleted.');
      router.push('/');
    } catch (err) {
      alert(' Failed to delete product.');
    }
  };

  if (!isAuthenticated || loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow rounded">
    
      <h1 className="text-2xl font-bold mb-4 text-green-800">Edit Product</h1>
      {message && <p className="mb-4 text-sm text-green-700">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" value={form.name} onChange={handleChange} placeholder="Name" className="w-full p-2 border rounded" required />
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="w-full p-2 border rounded" required />
        <input name="price" value={form.price} onChange={handleChange} placeholder="Price" type="number" className="w-full p-2 border rounded" required />
        <input name="stock" value={form.stock} onChange={handleChange} placeholder="Stock" type="number" className="w-full p-2 border rounded" required />

        <select name="category" value={form.category} onChange={handleChange} className="w-full p-2 border rounded" required>
          <option value="">Select Category</option>
          {categories.map(cat => (
            <option key={cat.id} value={String(cat.id)}>{cat.name}</option>
          ))}
        </select>

        {/* Sizes */}
        <div>
          <label className="block mb-1 font-medium">Sizes</label>
          <div className="flex gap-2 flex-wrap">
            {['Small', 'Medium', 'Large', 'XL'].map(size => (
              <button
                type="button"
                key={size}
                className={`px-3 py-1 border rounded ${
                  selectedSizes.includes(size) ? 'bg-green-700 text-white' : 'bg-gray-100'
                }`}
                onClick={() => setSelectedSizes(prev => toggleItem(prev, size))}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Shoe Sizes */}
        <div>
          <label className="block mb-1 font-medium">Shoe Sizes</label>
          <div className="flex gap-2 flex-wrap">
            {[29, 30, 32, 34, 36, 37, 38, 40, 41, 42].map(size => (
              <button
                type="button"
                key={size}
                className={`px-3 py-1 border rounded ${
                  selectedShoeSizes.includes(size) ? 'bg-green-700 text-white' : 'bg-gray-100'
                }`}
                onClick={() => setSelectedShoeSizes(prev => toggleItem(prev, size))}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Colors */}
        <div>
          <label className="block mb-1 font-medium">Colors</label>
          <div className="flex gap-2 flex-wrap">
            {['Red', 'Black', 'White', 'Blue', 'Green', 'Gray'].map(color => (
              <button
                type="button"
                key={color}
                className={`px-3 py-1 border rounded ${
                  selectedColors.includes(color) ? 'bg-green-700 text-white' : 'bg-gray-100'
                }`}
                onClick={() => setSelectedColors(prev => toggleItem(prev, color))}
              >
                {color}
              </button>
            ))}
          </div>
        </div>

        {/* Image Upload */}
        <input type="file" onChange={handleFileChange} className="w-full p-2 border rounded" />
        {previewUrl && (
          <div className="w-32 h-32 border rounded overflow-hidden">
            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
          </div>
        )}

        <button type="submit" className="w-full py-2 bg-green-700 text-white rounded">
          Update Product
        </button>

        <button
          type="button"
          onClick={handleDelete}
          className="w-full py-2 bg-red-600 text-white rounded hover:bg-red-700 mt-2"
        >
          Delete Product
        </button>
      </form>
    </div>
  );
}
