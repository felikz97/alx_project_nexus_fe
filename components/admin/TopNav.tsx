// admin Navigation bar

// components/admin/TopNav.tsx

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Menu, X } from 'lucide-react';

/**
 * TopNav renders the admin panel's top navigation bar.
 * Includes responsive design, logout logic, and mobile menu toggle.
 */
export default function TopNav() {
    const router = useRouter();
    const [menuOpen, setMenuOpen] = useState(false);

    /**
     * Logs the admin out by clearing tokens and redirecting to login.
     */
    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        router.push('/admin/login');
    };

    // Reusable navigation links
    const navLinks = [
        { label: 'Dashboard', href: '/admin' },
        { label: 'Users', href: '/admin/users' },
        { label: 'Products', href: '/admin/products' },
        { label: 'Orders', href: '/admin/orders' },
        { label: 'Stores', href: '/admin/stores' },
    ];

    /**
     * Renders a link with active route highlighting.
     */
    const NavLink = ({ href, label }: { href: string; label: string }) => (
        <Link
        href={href}
        className={`hover:underline ${
            router.pathname === href ? 'underline text-yellow-300 font-semibold' : ''
        }`}
        onClick={() => setMenuOpen(false)}
        >
        {label}
        </Link>
    );

    return (
        <header className="bg-green-800 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            {/* Admin Title / Logo */}
            <h1 className="text-xl font-bold">Admin Panel</h1>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex gap-6 items-center">
            {navLinks.map(link => (
                <NavLink key={link.href} href={link.href} label={link.label} />
            ))}
            <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
            >
                Logout
            </button>
            </nav>

            {/* Mobile Menu Toggle Button */}
            <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden focus:outline-none"
            aria-label="Toggle Menu"
            >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
        </div>

        {/* Mobile Dropdown Navigation */}
        {menuOpen && (
            <div className="md:hidden bg-green-900 text-white px-4 pb-4 space-y-2">
            {navLinks.map(link => (
                <NavLink key={link.href} href={link.href} label={link.label} />
            ))}
            <button
                onClick={() => {
                handleLogout();
                setMenuOpen(false);
                }}
                className="block w-full text-left py-1 hover:text-red-300"
            >
                Logout
            </button>
            </div>
        )}
        </header>
    );
}
