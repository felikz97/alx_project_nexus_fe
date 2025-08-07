// manage all stores
import { useEffect, useState } from 'react';
import axios from 'axios';
import AdminLayout from '@/components/admin/AdminLayout';

type Store = {
  id: number;
  owner_name: string;
  shop_name: string;
  is_active: boolean;
};

export default function StoreManagement() {
  const [stores, setStores] = useState<Store[]>([]);

  const fetchStores = async () => {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/stores/`);
    setStores(res.data);
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const toggleStoreStatus = async (id: number) => {
    await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/stores/${id}/toggle_status/`);
    fetchStores();
  };

  return (
    <AdminLayout>
      <h2 className="text-2xl font-bold mb-4">Stores</h2>

      <table className="w-full border">
        <thead>
          <tr>
            <th className="p-2 border">Store</th>
            <th className="p-2 border">Owner</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {stores.map(store => (
            <tr key={store.id}>
              <td className="p-2 border">{store.shop_name}</td>
              <td className="p-2 border">{store.owner_name}</td>
              <td className="p-2 border">{store.is_active ? 'Active' : 'Inactive'}</td>
              <td className="p-2 border">
                <button
                  className="bg-blue-600 text-white px-3 py-1 rounded"
                  onClick={() => toggleStoreStatus(store.id)}
                >
                  {store.is_active ? 'Deactivate' : 'Activate'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminLayout>
  );
}
