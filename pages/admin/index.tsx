//admin panel home: To list all users
// pages/admin/index.tsx
// pages/admin/index.tsx

import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import Spinner from '@/components/common/spinner';

export default function AdminHome() {
  const { loading, authorized } = useAdminAuth();

  // Show loading spinner while checking access
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner />
      </div>
    );
  }

  // If not authorized, don't render the page (redirect is handled inside the hook)
  if (!authorized) return null;

  // Render admin dashboard
  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-10 text-center">Admin Dashboard</h1>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard href="/admin/users" label="Manage Users" />
        <DashboardCard href="/admin/products" label="Manage Products" />
        <DashboardCard href="/admin/orders" label="Manage Orders" />
        <DashboardCard href="/admin/stores" label="Manage Stores" />
      </section>
    </AdminLayout>
  );
}

// 🔁 Reusable dashboard card
function DashboardCard({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="block bg-white text-center p-6 border rounded-xl shadow hover:shadow-lg transition-all duration-200 ease-in-out hover:scale-[1.02]"
    >
      <span className="text-lg font-semibold text-gray-700">{label}</span>
    </Link>
  );
}
