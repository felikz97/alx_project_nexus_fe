import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function ResetPasswordConfirm() {
  const router = useRouter();
  const { uid, token } = router.query;

  const [form, setForm] = useState({ new_password: '', confirm_password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.new_password !== form.confirm_password) {
      toast.error("Passwords don't match");
      return;
    }

    try {
      setLoading(true);
      await axios.post(`http://localhost:8000/api/auth/reset-password-confirm/`, {
        uid,
        token,
        new_password: form.new_password,
      });

      toast.success('Password updated!');
      setTimeout(() => router.push('/login'), 1500);
    } catch (err) {
      toast.error('Reset failed. Link may be invalid or expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-yellow-50 px-4">
      <div className="w-full max-w-md bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold text-green-800 mb-6 text-center">
          Set a New Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { name: 'new_password', label: 'New Password' },
            { name: 'confirm_password', label: 'Confirm Password' },
          ].map(({ name, label }) => (
            <div key={name} className="flex flex-col">
              <label className="mb-1 text-sm font-medium text-green-800">{label}</label>
              <input
                type="password"
                name={name}
                value={(form as any)[name]}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-700 text-white py-2 rounded hover:bg-green-800 transition disabled:opacity-60"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Saving...
              </div>
            ) : (
              'Reset Password'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
