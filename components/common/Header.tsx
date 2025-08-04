import { useState } from 'react';
import useAuth from '@/hooks/useAuth';
import Link from 'next/link';
import { useCart } from '@/components/cart/CartContext';

export default function Header() {
  const { isAuthenticated, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const { cartCount } = useCart();

  return (
    <header className="bg-green-800 text-yellow-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        
        {/* Left: Logo & Nav */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 w-full">
          <Link href="/" className="text-2xl font-bold mb-2 sm:mb-0">
            🛒 E-Shop Nexus
          </Link>
          <nav className="flex flex-wrap gap-2 sm:gap-4">
            <Link href="/" className="hover:bg-yellow-100 px-3 py-1 rounded hover:text-green-700">Home</Link>
            <Link href="/products" className="hover:bg-yellow-100 px-3 py-1 rounded hover:text-green-700">Products</Link>
            <Link href="/about" className="hover:bg-yellow-100 px-3 py-1 rounded hover:text-green-700">About Us</Link>
          </nav>
        </div>

        {/* Center: Search */}
        <div className="w-full flex-1 min-w-[300px] sm:max-w-xl xl:max-w-2xl">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full px-3 py-2 rounded border border-green-300 text-green-900"
          />
        </div>

        {/* Right: Auth + Cart */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-x-4 gap-y-2 sm:gap-y-0 sm:flex-nowrap">
          
          {/* Auth Controls */}
          {isAuthenticated ? (
            <div className="relative">
              <button onClick={() => setShowMenu(!showMenu)} className="text-sm font-semibold">
                👤 User
              </button>
              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-green-900 shadow-lg rounded z-50">
                  <Link href="/orders" className="block px-4 py-2 hover:bg-green-100">📦 My Orders</Link>
                  <Link href="/products/create" className="block px-4 py-2 hover:bg-green-100">➕ Add Product</Link>
                  <Link href="/products/mine" className="block px-4 py-2 hover:bg-green-100">📂 My Catalogs</Link>
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
            <div className="flex gap-x-2">
              <Link href="/register" className="hover:underline">Signup</Link>
              <Link href="/login" className="hover:underline">Login</Link>
            </div>
          )}
          
          {/* Cart */}
          <Link href="/cart" className="flex items-center gap-x-1 hover:underline">
            <span className="relative">
              🛒
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </span>
            <span>Cart</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
