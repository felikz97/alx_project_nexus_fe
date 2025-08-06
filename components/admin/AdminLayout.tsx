// top nav and  layout in admin panel
import TopNav from './TopNav';
import { ReactNode } from 'react';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <TopNav />
      <main className="p-6">{children}</main>
    </div>
  );
}
