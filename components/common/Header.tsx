// components/common/Header.tsx
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/components/cart/CartContext';
import api from '@/utils/axiosInstance';
import Link from 'next/link';
import Image from 'next/image';
import { MoreVertical } from 'lucide-react';

export default function Header() {
  const { isAuthenticated, logout } = useAuth();
  const { cartCount } = useCart();

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

  // close dropdown when clicking outside
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

  return (
    <header className="bg-green-800 text-yellow-50 shadow-md z-[50] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold flex items-center gap-2">
          <Image src="/assets/logo.png" alt="Home" width={38} height={38} className="rounded-lg" />
          Nexus E-commerce
        </Link>

        {/* Nav Links */}
        <nav className={`flex-col sm:flex-row sm:flex gap-4 mt-4 sm:mt-0 sm:gap-6 ${mobileNavOpen ? 'flex' : 'hidden sm:flex'}`}>
          <Link href="/" className="hover:bg-yellow-100 px-3 py-1 rounded hover:text-green-700">Home</Link>
          <Link href="/products" className="hover:bg-yellow-100 px-3 py-1 rounded hover:text-green-700">Products</Link>
          <Link href="/about" className="hover:bg-yellow-100 px-3 py-1 rounded hover:text-green-700">About</Link>
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-6 mt-4 sm:mt-0 relative">

          {/* Cart */}
          <Link href="/cart" className="relative flex items-center gap-1 hover:underline">
            <Image src="/assets/icons/cart.svg" alt="Cart" width={24} height={24} />
            <span>Cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Auth */}
          {isAuthenticated ? (
            <div ref={dropdownRef} className="relative flex items-center gap-2">
              {/* User avatar only */}
              {user?.image ? (
                <img
                  src={user.image.startsWith('http') ? user.image : `${process.env.NEXT_PUBLIC_API_BASE_URL}${user.image}`}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover border"
                />
              ) : (
                <Image src="/assets/icons/user.svg" alt="User" width={38} height={38} className="rounded-full border" />
              )}

              {/* Menu icon triggers dropdown */}
              <button
                onClick={() => setShowMenu(prev => !prev)}
                className="p-1 rounded hover:bg-green-700 focus:outline-none"
              >
                <MoreVertical className="w-5 h-5" />
              </button>

              {showMenu && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-green-200 text-green-900 shadow-xl rounded-lg border border-green-200 z-[100]">
                  {user?.Full_Name && (
                    <div className="px-4 py-2 border-b border-green-100 text-sm font-bold text-green-700">
                      {user.Full_Name}
                    </div>
                  )}
                  <Link href="/orders" className="flex items-center gap-2 px-4 py-2 hover:bg-green-100">My Orders</Link>
                  <Link href="/products/create" className="flex items-center gap-2 px-4 py-2 hover:bg-green-100">Add Product</Link>
                  <Link href="/products/mine" className="flex items-center gap-2 px-4 py-2 hover:bg-green-100">My Catalogs</Link>
                  <Link href="/profile" className="flex items-center gap-2 px-4 py-2 hover:bg-green-100">Update Profile</Link>
                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-green-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/register" className="hover:bg-yellow-100 hover:text-green-600 rounded-lg px-3">Signup</Link>
              <Link href="/login" className="hover:bg-yellow-100 hover:text-green-600 bg-green-100 rounded-md text-green-700 px-3">Login</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
