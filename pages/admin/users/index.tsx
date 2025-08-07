// to list all users
// pages/admin/users/index.tsx

import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import AdminLayout from '@/components/admin/AdminLayout';
import Spinner from '@/components/common/spinner';

type User = {
    id: number;
    username: string;
    email: string;
    is_staff: boolean;
    is_superuser: boolean;
    is_seller: boolean;
    Full_Name: string;
    bio: string;
    mobile: string;
    address: string;
    shop_name: string;
    image: string;
    };

    export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [filtered, setFiltered] = useState<User[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [sortConfig, setSortConfig] = useState<{
        key: keyof User;
        direction: 'asc' | 'desc';
    } | null>(null);

    useEffect(() => {
        const fetchUsers = async () => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            setError('Not authenticated');
            setLoading(false);
            return;
        }

        try {
            const res = await axios.get(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/`,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
            );

            let usersData: User[] = [];

            if (Array.isArray(res.data)) {
            usersData = res.data;
            } else if (Array.isArray(res.data.results)) {
            usersData = res.data.results;
            } else if (res.data.id) {
            usersData = [res.data]; // fallback for single-user response
            } else {
            console.error('Unexpected API format:', res.data);
            setError('Unexpected data format');
            return;
            }

            setUsers(usersData);
            setFiltered(usersData);
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Failed to fetch users');
        } finally {
            setLoading(false);
        }
        };

        fetchUsers();
    }, []);

    useEffect(() => {
        const filtered = users.filter((u) =>
        (u.username?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
        (u.email?.toLowerCase().includes(search.toLowerCase()) ?? false)
        );
        setFiltered(filtered);
        setCurrentPage(1);
    }, [search, users]);

    const sorted = useMemo(() => {
        if (!sortConfig) return filtered;

        return [...filtered].sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
        });
    }, [filtered, sortConfig]);

    const totalPages = Math.ceil(sorted.length / rowsPerPage);
    const pageItems = sorted.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    const requestSort = (key: keyof User) => {
        setSortConfig((prev) =>
        prev?.key === key && prev.direction === 'asc'
            ? { key, direction: 'desc' }
            : { key, direction: 'asc' }
        );
    };

    const handleEdit = (user: User) => {
        console.log('Edit user:', user.id);
        // Add modal or route to edit form
    };

    const handleDelete = (user: User) => {
        console.log('Delete user:', user.id);
        // Add confirm + delete API call
    };

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
            <div>
            {/* Search + Pagination Controls */}
            <div className="mb-4 flex justify-between">
                <input
                type="text"
                placeholder="Search username or email"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border p-2 rounded w-1/3"
                />
                <div>
                Rows per page:
                <select
                    value={rowsPerPage}
                    onChange={(e) => setRowsPerPage(Number(e.target.value))}
                    className="ml-2 border p-1 rounded"
                >
                    {[5, 10, 20, 50].map((n) => (
                    <option key={n} value={n}>
                        {n}
                    </option>
                    ))}
                </select>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border shadow rounded">
                <thead className="bg-gray-100 text-left">
                    <tr>
                    {[
                        'id',
                        'username',
                        'email',
                        'Full_Name',
                        'mobile',
                        'is_staff',
                        'is_seller',
                    ].map((col) => (
                        <th
                        key={col}
                        className="p-3 border cursor-pointer"
                        onClick={() => requestSort(col as keyof User)}
                        >
                        {col.toUpperCase()}
                        {sortConfig?.key === col &&
                            (sortConfig.direction === 'asc' ? ' ▲' : ' ▼')}
                        </th>
                    ))}
                    <th className="p-3 border">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {pageItems.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                        <td className="p-3 border">{user.id}</td>
                        <td className="p-3 border">{user.username}</td>
                        <td className="p-3 border">{user.email}</td>
                        <td className="p-3 border">{user.Full_Name}</td>
                        <td className="p-3 border">{user.mobile}</td>
                        <td className="p-3 border">
                        {user.is_staff ? 'Yes' : 'No'}
                        </td>
                        <td className="p-3 border">
                        {user.is_seller ? 'Yes' : 'No'}
                        </td>
                        <td className="p-3 border space-x-2">
                        <button
                            onClick={() => handleEdit(user)}
                            className="text-blue-600 hover:underline"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => handleDelete(user)}
                            className="text-red-600 hover:underline"
                        >
                            Delete
                        </button>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="mt-4 flex justify-center space-x-2">
                <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="px-3 py-1 border rounded disabled:opacity-50"
                >
                Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-1 border rounded ${
                    currentPage === i + 1 ? 'bg-blue-500 text-white' : ''
                    }`}
                >
                    {i + 1}
                </button>
                ))}
                <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="px-3 py-1 border rounded disabled:opacity-50"
                >
                Next
                </button>
            </div>
            </div>
        )}
        </AdminLayout>
    );
}
