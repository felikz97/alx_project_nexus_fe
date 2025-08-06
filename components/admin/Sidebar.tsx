//components/admin/Sidebar.tsx
// admin sidebar
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { LogOut, Menu } from 'lucide-react';

export default function Sidebar() {
    const router = useRouter();
    const [collapsed, setCollapsed] = useState(false);

    const navItems = [
        { label: 'Dashboard', href: '/admin' },
        { label: 'Users', href: '/admin/users' },
        { label: 'Products', href: '/admin/products' },
        { label: 'Orders', href: '/admin/orders' },
        { label: 'Stores', href: '/admin/stores' },
    ];

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        router.push('/admin/login');
    };

    const isActive = (href: string) => router.pathname === href;

    return (
        <aside className="bg-white shadow-md h-screen p-4 w-64 hidden md:block fixed">
        <div className="mb-8 text-xl font-bold text-center">Admin Panel</div>

        <nav className="flex flex-col gap-2">
            {navItems.map(({ label, href }) => (
            <Link
                key={href}
                href={href}
                className={`px-4 py-2 rounded hover:bg-green-100 transition font-medium ${
                isActive(href) ? 'bg-green-200 text-green-800' : 'text-gray-700'
                }`}
            >
                {label}
            </Link>
            ))}
        </nav>

        <button
            onClick={handleLogout}
            className="mt-10 w-full flex items-center gap-2 justify-center text-red-600 hover:text-red-700 font-medium"
        >
            <LogOut size={18} />
            Logout
        </button>
        </aside>
    );
}
