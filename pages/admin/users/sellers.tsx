// to list all sellers
import { useEffect, useState } from 'react';
import axios from 'axios';
import AdminLayout from '@/components/admin/AdminLayout';

type User = {
  id: number;
  username: string;
  email: string;
  is_seller: boolean;
};

export default function SellerApproval() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');

    axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/sellers/`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setUsers(res.data))
    .finally(() => setLoading(false));
  }, []);

  const toggleSeller = async (id: number) => {
    const token = localStorage.getItem('token');
    await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/sellers/${id}/toggle_seller/`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });

    setUsers(prev =>
      prev.map(user =>
        user.id === id ? { ...user, is_seller: !user.is_seller } : user
      )
    );
  };

  return (
    <AdminLayout>
      <h2 className="text-2xl font-bold mb-4">Seller Approvals</h2>
      {loading ? (
        <p>Loading users...</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr>
              <th className="p-2 border">Username</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Is Seller</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td className="p-2 border">{user.username}</td>
                <td className="p-2 border">{user.email}</td>
                <td className="p-2 border">{user.is_seller ? 'Yes' : 'No'}</td>
                <td className="p-2 border">
                  <button
                    className="bg-green-600 text-white px-3 py-1 rounded"
                    onClick={() => toggleSeller(user.id)}
                  >
                    {user.is_seller ? 'Revoke' : 'Approve'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </AdminLayout>
  );
}
