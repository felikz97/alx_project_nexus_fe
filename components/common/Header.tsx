import { useState, useEffect, useRef } from 'react';
import useAuth from '@/hooks/useAuth';
import Link from 'next/link';
import { useCart } from '@/components/cart/CartContext';
import api from '@/utils/axiosInstance';
import Image from 'next/image';
import classNames from 'classnames';
import CartDrawer from '@/components/cart/CartDrawer';

export default function Header() {
  const { isAuthenticated, logout } = useAuth();
  const { cartCount } = useCart();
  const [showMenu, setShowMenu] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      api
        .get('/api/users/profile/')
        .then((res) => setUser(res.data))
        .catch(() => setUser(null));
    }
  }, [isAuthenticated]);

  // Close dropdown on outside click
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
        <div className="flex items-center gap-2">
          <Link href="/" className="text-2xl font-bold flex items-center gap-2">
            <Image src="/assets/logo.png" className="rounded-lg" alt="Home" width={38} height={38} />
            Nexus E-commerce
          </Link>

          {/* Hamburger Menu (Mobile) */}
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="sm:hidden ml-4 relative w-8 h-8 z-50"
            aria-label="Toggle navigation"
          >
            <div className={classNames(
              "absolute w-full h-0.5 bg-yellow-50 transition-transform duration-300",
              mobileNavOpen ? "rotate-45 top-3.5" : "top-2"
            )} />
            <div className={classNames(
              "absolute w-full h-0.5 bg-yellow-50 transition-opacity duration-300",
              mobileNavOpen ? "opacity-0" : "top-3.5"
            )} />
            <div className={classNames(
              "absolute w-full h-0.5 bg-yellow-50 transition-transform duration-300",
              mobileNavOpen ? "-rotate-45 bottom-2" : "bottom-2"
            )} />
          </button>
        </div>

        {/* Nav Links */}
        <nav className={classNames(
          "flex-col sm:flex-row sm:flex gap-4 mt-4 sm:mt-0 sm:gap-6 w-full sm:w-auto",
          mobileNavOpen ? "flex" : "hidden sm:flex"
        )}>
          <Link href="/" className="hover:bg-yellow-100 px-3 py-1 rounded hover:text-green-700">Home</Link>
          <Link href="/products" className="hover:bg-yellow-100 px-3 py-1 rounded hover:text-green-700">Products</Link>
          <Link href="/about" className="hover:bg-yellow-100 px-3 py-1 rounded hover:text-green-700">About</Link>
        </nav>

        {/* Search Bar */}
        <div className="w-full sm:w-auto flex-1 lg:max-w-xl xl:max-w-2xl min-w-[300px] mt-4 sm:mt-0 sm:ml-4">
          <input
            type="text"
            placeholder="Search products..."
            className="w-64 px-3 py-2 rounded border border-green-300 text-green-900"
          />
        </div>

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
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setShowMenu(prev => !prev)}
                className="flex items-center gap-2 focus:outline-none"
              >
                {user?.image ? (
                  <img
                    src={user.image.startsWith('http') ? user.image : `${process.env.NEXT_PUBLIC_API_BASE_URL}${user.image}`}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover border"
                  />
                ) : (
                  <Image
                    src="/assets/icons/user.svg"
                    alt="User"
                    width={28}
                    height={28}
                    className="rounded-full border"
                  />
                )}
                <span className="text-sm font-semibold">account</span>
              </button>

              {/* Dropdown */}
              {showMenu && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-green-200 text-green-900 shadow-xl rounded-lg border border-green-200 z-[100]">
                  {user?.Full_Name && (
                    <div className="px-4 py-2 border-b border-green-100 text-sm font-bold text-green-700">
                      {user.Full_Name}
                    </div>
                  )}
                  <Link href="/orders" className="flex items-center gap-2 px-4 py-2 hover:bg-green-100">
                    <Image src="/assets/icons/orders.svg" alt="Orders" width={20} height={20} />
                    My Orders
                  </Link>
                  <Link href="/products/create" className="flex items-center gap-2 px-4 py-2 hover:bg-green-100">
                    <Image src="/assets/icons/add.svg" alt="Add Product" width={20} height={20} />
                    Add Product
                  </Link>
                  <Link href="/products/mine" className="flex items-center gap-2 px-4 py-2 hover:bg-green-100">
                    <Image src="/assets/icons/catalog.svg" alt="My Catalogs" width={20} height={20} />
                    My Catalogs
                  </Link>
                  <Link href="/profile" className="flex items-center gap-2 px-4 py-2 hover:bg-green-100">
                    <Image src="/assets/icons/settings.svg" alt="Update Profile" width={20} height={20} />
                    Update Profile
                  </Link>
                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-green-100"
                  >
                    <Image src="/assets/icons/logout.svg" alt="Logout" width={20} height={20} />
                    Logout
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
