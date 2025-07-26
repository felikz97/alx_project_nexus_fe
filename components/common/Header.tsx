import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-green-800 text-yellow-50 shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <span className="text-2xl font-bold cursor-pointer">🛍 E-Shop</span>
        </Link>

        {/* Search */}
        <div className="flex-1 mx-6">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full max-w-md px-3 py-2 rounded border border-green-300 text-green-900"
          />
        </div>

        {/* Auth Links */}
        <nav className="space-x-6">
          <Link href="/register" className="hover:underline">Signup</Link>
          <Link href="/login" className="hover:underline">Login</Link>
        </nav>
      </div>
    </header>
  );
}
