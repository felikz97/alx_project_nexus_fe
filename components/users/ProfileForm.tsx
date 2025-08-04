import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '@/utils/axiosInstance';

interface Props {
  initialData: any;
  onSaved: (updatedData: any) => void;
}

export default function ProfileForm({ initialData, onSaved }: Props) {
  const [form, setForm] = useState({
    ...initialData,
    shop_name: initialData.shop_name || '',
    bio: initialData.bio || '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(form.image || null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => {
    if (v !== undefined && v !== null) {
        data.append(k, String(v));
    }
    });
    if (imageFile) data.append('image', imageFile);

    try {
      const res = await api.put('/api/users/profile/', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Profile updated!');
      onSaved(res.data);
    } catch {
      toast.error('Failed to update profile.');
    }
  };

  const becomeSeller = () => {
    api
      .put('/api/users/profile/', { is_seller: true })
      .then((res) => {
        setForm(res.data);
        toast.success('You are now a seller!');
        onSaved(res.data);
      })
      .catch(() => toast.error('Failed to become seller.'));
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 shadow rounded space-y-5">
      {[
        { label: 'Username', name: 'username', type: 'text', readOnly: true },
        { label: 'Email', name: 'email', type: 'email', readOnly: true },
        { label: 'Mobile', name: 'mobile', type: 'text' },
        { label: 'Address', name: 'address', type: 'text' },
      ].map(({ label, name, type, readOnly }) => (
        <div key={name} className="flex flex-col">
          <label className="text-sm font-medium text-green-800 mb-1">{label}</label>
          <input
            type={type}
            name={name}
            value={(form as any)[name]}
            onChange={handleChange}
            readOnly={readOnly}
            className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-600 disabled:bg-gray-100"
          />
        </div>
      ))}

      {form.is_seller && (
        <>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-green-800 mb-1">Shop Name</label>
            <input
              type="text"
              name="shop_name"
              value={form.shop_name}
              onChange={handleChange}
              className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-green-800 mb-1">Shop Bio</label>
            <textarea
              name="bio"
              rows={3}
              value={form.bio}
              onChange={handleChange}
              className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>
        </>
      )}

      <div className="flex flex-col">
        <label className="text-sm font-medium text-green-800 mb-1">Profile Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImage}
          className="border border-gray-300 p-2 rounded"
        />
      </div>

      {preview && (
        <div className="flex justify-center">
          <img src={preview} alt="Preview" className="w-24 h-24 rounded-full object-cover border" />
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 mt-4">
        {!form.is_seller && (
          <button
            type="button"
            onClick={becomeSeller}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
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
        {form.is_seller && (
            <div className="text-sm text-yellow-700 font-semibold text-center bg-yellow-100 border border-yellow-300 rounded p-2 mb-4">
                🏷 You are registered as a Seller
            </div>
            )}
      </div>
    </form>
  );
}
