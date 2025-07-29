import { useState } from 'react';
import useAuth from '@/hooks/useAuth';
import Link from 'next/link';



export default function Header() {
  const { isAuthenticated, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  // Toggle menu visibility
  const toggleMenu = () => setShowMenu(!showMenu);

  return (
    <header className="bg-green-800 text-yellow-50 shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold cursor-pointer">🛒 E-Shop</Link>

        {/* Search */}
        <div className="flex-1 mx-6">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full max-w-md px-3 py-2 rounded border border-green-300 text-green-900"
          />
        </div>

        {/* Right side nav */}
        <div className="flex items-center space-x-6">
          <Link href="/cart" className="hover:underline">🛒 Cart</Link>

          {isAuthenticated ? (
            <div className="relative">
              <button onClick={() => setShowMenu(!showMenu)} className="text-xl">
                👤v
              </button>
              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-green-900 shadow-lg rounded z-50">
                  <Link href="/products/create" className="block px-4 py-2 hover:bg-green-100">➕ Add Product</Link>
                  <Link href="/profile" className="block px-4 py-2 hover:bg-green-100">🛠 Update Profile</Link>
                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 hover:bg-green-100"
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/register" className="hover:underline">Signup</Link>
              <Link href="/login" className="hover:underline">Login</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
