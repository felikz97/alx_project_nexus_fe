// pages/admin/users/login.tsx
// allow admin users to login

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Spinner from '@/components/common/spinner';

export default function AdminLoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [checkingAuth, setCheckingAuth] = useState(true);
    const router = useRouter();

    // Redirect to dashboard if already logged in
    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
        router.replace('/admin');
        } else {
        setCheckingAuth(false);
        }
    }, [router]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
        const response = await axios.post('http://localhost:8000/api/token/', {
            username,
            password,
        });

        const { access, refresh } = response.data;

        localStorage.setItem('accessToken', access);
        localStorage.setItem('refreshToken', refresh);

        // Validate user is staff/admin
        const userRes = await axios.get('http://localhost:8000/api/users/me/', {
            headers: {
            Authorization: `Bearer ${access}`,
            },
        });

        const user = userRes.data;

        if (user.is_staff || user.is_superuser) {
            router.push('/admin');
        } else {
            setError('Access denied: You are not an admin.');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
        }
        } catch (err) {
        console.error(err);
        setError('Invalid credentials or server error.');
        }
    };

    if (checkingAuth) {
        return (
        <div className="flex items-center justify-center h-screen">
            <Spinner />
        </div>
        );
    }

    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="w-full max-w-md p-6 bg-white border rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-center mb-6">Admin Login</h1>

            <form onSubmit={handleLogin} className="space-y-4">
            <div>
                <label htmlFor="username" className="block text-sm font-medium mb-1">
                Username
                </label>
                <input
                id="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
                />
            </div>

            <div>
                <label htmlFor="password" className="block text-sm font-medium mb-1">
                Password
                </label>
                <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
                />
            </div>

            {error && (
                <p className="text-sm text-center text-red-600">{error}</p>
            )}

            <button
                type="submit"
                className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-2 px-4 rounded transition"
            >
                Log In
            </button>
            </form>
        </div>
        </main>
    );
}
