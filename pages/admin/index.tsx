// /pages/admin/index.tsx
import { useEffect, useState } from 'react';
import { getUsers, updateUser } from '../../utils/api';

type User = {
  id: number;
  username: string;
  email: string;
  is_seller: boolean;
  is_staff: boolean;
};

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUsers()
      .then(res => setUsers(res.data))
      .catch(err => console.error('Error loading users:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleToggleRole = (userId: number, field: 'is_seller' | 'is_staff') => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    const updated = { ...user, [field]: !user[field] };

    updateUser(userId, updated)
      .then(() => {
        setUsers(prev =>
          prev.map(u => (u.id === userId ? { ...u, [field]: !u[field] } : u))
        );
      })
      .catch(err => alert('Update failed'));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      {loading ? (
        <p>Loading users...</p>
      ) : (
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-green-700 text-white">
              <th className="p-2">ID</th>
              <th className="p-2">Username</th>
              <th className="p-2">Email</th>
              <th className="p-2">Seller</th>
              <th className="p-2">Staff</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-t border-gray-300">
                <td className="p-2">{user.id}</td>
                <td className="p-2">{user.username}</td>
                <td className="p-2">{user.email}</td>
                <td className="p-2 text-center">{user.is_seller ? '✅' : '❌'}</td>
                <td className="p-2 text-center">{user.is_staff ? '✅' : '❌'}</td>
                <td className="p-2 flex gap-2">
                  <button
                    className="px-2 py-1 bg-blue-600 text-white rounded"
                    onClick={() => handleToggleRole(user.id, 'is_seller')}
                  >
                    Toggle Seller
                  </button>
                  <button
                    className="px-2 py-1 bg-purple-600 text-white rounded"
                    onClick={() => handleToggleRole(user.id, 'is_staff')}
                  >
                    Toggle Staff
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
