// to list all users
// pages/admin/users/index.tsx
// pages/admin/users/index.tsx

import { useEffect, useState } from 'react';
import axios from 'axios';
import AdminLayout from '@/components/admin/AdminLayout';
import Spinner from '@/components/common/spinner';

type User = {
    id: number;
    username: string;
    email: string;
    is_staff: boolean;
    };

    export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
            const token = localStorage.getItem('accessToken');
            const res = await axios.get('http://localhost:8000/api/users/', {
                headers: {
                Authorization: `Bearer ${token}`,
                },
            });

            console.log('Fetched users:', res.data); // <-- check what this is

            setUsers(res.data);
            } catch (err) {
            setError('Failed to fetch users.');
            } finally {
            setLoading(false);
            }
        };

        fetchUsers();
        }, []);

    return (
        <AdminLayout>
        <h1 className="text-2xl font-bold mb-6">All Users</h1>

        {loading ? (
            <div className="flex justify-center items-center h-64">
            <Spinner />
            </div>
        ) : error ? (
            <p className="text-red-500">{error}</p>
        ) : (
            <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300 shadow rounded">
                <thead className="bg-gray-100 text-left">
                <tr>
                    <th className="p-3 border">ID</th>
                    <th className="p-3 border">Username</th>
                    <th className="p-3 border">Email</th>
                    <th className="p-3 border">Is Staff</th>
                </tr>
                </thead>
                <tbody>
                {users.map(user => (
                    <tr key={user.id} className="hover:bg-gray-50">
                    <td className="p-3 border">{user.id}</td>
                    <td className="p-3 border">{user.username}</td>
                    <td className="p-3 border">{user.email}</td>
                    <td className="p-3 border">{user.is_staff ? 'Yes' : 'No'}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        )}
        </AdminLayout>
    );
}
