import { useEffect, useState } from 'react';
import axios from 'axios';

type Category = {
  id: number;
  name: string;
};

export default function ProductSidebar() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/categories/')
      .then(res => setCategories(res.data.results || res.data));
  }, []);

  return (
    <aside className="w-full md:w-64 bg-white p-4 shadow rounded-md h-fit">
      <h2 className="text-lg font-bold text-green-800 mb-4">Filter by Category</h2>
      <div className="space-y-2">
        {categories.map(cat => (
          <label key={cat.id} className="block">
            <input type="checkbox" className="mr-2 accent-green-700" />
            {cat.name}
          </label>
        ))}
      </div>
    </aside>
  );
}
