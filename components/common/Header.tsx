// components/common/Header.tsx
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/components/cart/CartContext';
import api from '@/utils/axiosInstance';
import Link from 'next/link';
import Image from 'next/image';
import { MoreVertical, Menu, X } from 'lucide-react';

export default function Header() {
  const { isAuthenticated, logout } = useAuth();
  const { cartCount } = useCart();
  const router = useRouter();

  const [showMenu, setShowMenu] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isAuthenticated) {
      api.get('/api/users/profile/')
        .then(res => setUser(res.data))
        .catch(() => setUser(null));
    } else {
      setUser(null);
    }
  }, [isAuthenticated]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu]);

  // Handle Cart Click with Login Requirement
  const handleCartClick = () => {
    if (isAuthenticated) {
      router.push('/cart');
    } else {
      router.push(`/login?next=/cart`);
    }
  };

  return (
    <header className="bg-green-800 text-yellow-50 shadow-md sticky top-0 z-[50]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="text-xl sm:text-2xl font-bold flex items-center gap-2">
          <Image src="/assets/logo.png" alt="Home" width={38} height={38} className="rounded-lg" />
          Nexus E-commerce
        </Link>

        {/* Mobile Menu Toggle */}
        <button
          className="sm:hidden p-2 rounded-md hover:bg-green-700 transition"
          onClick={() => setMobileNavOpen(prev => !prev)}
          aria-label="Toggle navigation menu"
        >
          {mobileNavOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Nav Links */}
        <nav
          className={`${
            mobileNavOpen ? 'flex' : 'hidden sm:flex'
          } flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 absolute sm:static top-full left-0 w-full sm:w-auto bg-green-800 sm:bg-transparent shadow-lg sm:shadow-none transition-all`}
        >
          <Link href="/" className="hover:bg-yellow-100 px-3 py-2 rounded hover:text-green-700 transition">Home</Link>
          <Link href="/products" className="hover:bg-yellow-100 px-3 py-2 rounded hover:text-green-700 transition">Products</Link>
          <Link href="/about" className="hover:bg-yellow-100 px-3 py-2 rounded hover:text-green-700 transition">About</Link>
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-6">

          {/* Cart */}
          <button
            onClick={handleCartClick}
            className="relative flex items-center gap-1 hover:underline"
          >
            <Image src="/assets/icons/cart.svg" alt="Cart" width={24} height={24} />
            <span>Cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {cartCount}
              </span>
            )}
          </button>

          {/* Auth */}
          {isAuthenticated ? (
            <div ref={dropdownRef} className="relative flex items-center gap-2">
              {user?.image ? (
                <img
                  src={user.image.startsWith('http') ? user.image : `${process.env.NEXT_PUBLIC_API_BASE_URL}${user.image}`}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover border"
                />
              ) : (
                <Image src="/assets/icons/user.svg" alt="User" width={38} height={38} className="rounded-full border" />
              )}
              <button
                onClick={() => setShowMenu(prev => !prev)}
                className="p-1 rounded hover:bg-green-700 transition"
              >
                <MoreVertical className="w-5 h-5" />
              </button>

              {showMenu && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-green-200 text-green-900 shadow-xl rounded-lg border border-green-200 animate-fadeIn">
                  {user?.Full_Name && (
                    <div className="px-4 py-2 border-b border-green-100 text-sm font-bold text-green-700">
                      {user.Full_Name}
                    </div>
                  )}
                  <Link href="/orders" className="flex items-center gap-2 px-4 py-2 hover:bg-green-100 transition">
                    <Image src="/assets/icons/orders.svg" alt="Orders" width={20} height={20} />
                    My Orders
                  </Link>
                  <Link href="/products/create" className="flex items-center gap-2 px-4 py-2 hover:bg-green-100 transition">
                    <Image src="/assets/icons/add.svg" alt="Add Product" width={20} height={20} />
                    Add Product
                  </Link>
                  <Link href="/products/mine" className="flex items-center gap-2 px-4 py-2 hover:bg-green-100 transition">
                    <Image src="/assets/icons/catalog.svg" alt="My Catalogs" width={20} height={20} />
                    My Catalogs
                  </Link>
                  <Link href="/profile" className="flex items-center gap-2 px-4 py-2 hover:bg-green-100 transition">
                    <Image src="/assets/icons/settings.svg" alt="Update Profile" width={20} height={20} />
                    Update Profile
                  </Link>
                  <button
                    onClick={logout}
                    className="w-full flex text-red-500 items-center gap-2 px-4 py-2 text-left hover:bg-green-100 hover:text-red-600 transition"
                  >
                    <Image src="/assets/icons/logout.svg" alt="Logout" width={20} height={20} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden sm:flex gap-3">
              <Link href="/register" className="hover:bg-yellow-100 hover:text-green-600 rounded-lg px-3 py-1 transition">Signup</Link>
              <Link href="/login" className="hover:bg-yellow-100 hover:text-green-600 bg-green-100 rounded-md text-green-700 px-3 py-1 transition">Login</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
