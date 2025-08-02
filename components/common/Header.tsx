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
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-left justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold cursor-pointer align-left">🛒 E-Shop Nexus</Link>

        {/* Navigation Links */}
        <div className="flex items-center space-x-6">
          <Link href="/" className="hover:bg-yellow-100 px-3 py-2 rounded hover:text-green-600">Home</Link>
          <Link href="/products" className="hover:bg-yellow-100 px-3 py-2 rounded hover:text-green-600 ">Products</Link>
          <Link href="/about" className="hover:bg-yellow-100 px-3 py-2 rounded hover:text-green-600" >About Us</Link>
        </div>

        {/* Search Bar */}
        <div className="flex-1 mx-6">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full max-w-md px-3 py-2 rounded border border-green-300 text-green-900"
          />
        </div>

        {/* Right-side controls */}
        <div className="flex items-center space-x-6">
          {/* Cart with badge */}
          <Link href="/cart" className="relative hover:underline">
            🛒 Cart
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Auth controls */}
          {isAuthenticated ? (
            <div className="relative">
              <button onClick={() => setShowMenu(!showMenu)} className="fa-solid fa-user text-xl"  > User </button>
              {showMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white text-green-900 shadow-lg rounded z-50">
                    <Link href="/orders" className="block px-4 py-2 hover:bg-green-100">
                      📦 My Orders
                    </Link>
                    <Link href="/products/create" className="block px-4 py-2 hover:bg-green-100">
                      ➕ Add Product
                    </Link>
                    <Link href="/products/mine" className="block px-4 py-2 hover:bg-green-100">
                      📂 My Catalogs
                    </Link>
                    <Link href="/profile" className="block px-4 py-2 hover:bg-green-100">
                      🛠 Update Profile
                    </Link>
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
