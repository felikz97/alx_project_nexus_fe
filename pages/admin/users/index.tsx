// to list all users
// pages/admin/users/index.tsx
import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import axios from 'axios';

type User = {
  id: number;
  username: string;
  email: string;
  is_seller: boolean;
  is_staff: boolean;
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/users/')
      .then(res => setUsers(res.data))
      .catch(err => console.error('Failed to fetch users:', err));
  }, []);

  return (
    <AdminLayout>
      <h1 className="text-xl font-semibold text-green-700 mb-4">All Users</h1>
      <table className="w-full table-auto border">
        <thead>
          <tr className="bg-green-100">
            <th className="p-2 border">Username</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Seller?</th>
            <th className="p-2 border">Staff?</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td className="p-2 border">{u.username}</td>
              <td className="p-2 border">{u.email}</td>
              <td className="p-2 border">{u.is_seller ? 'Yes' : 'No'}</td>
              <td className="p-2 border">{u.is_staff ? 'Yes' : 'No'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminLayout>
  );
}
