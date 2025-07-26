type Category = { id: number; name: string };

type Props = {
  search: string;
  setSearch: (val: string) => void;
  categories: Category[];
  selected: number[];
  toggleCategory: (id: number) => void;
};

export default function ProductFilters({ search, setSearch, categories, selected, toggleCategory }: Props) {
  return (
    <div className="mb-6">
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-md p-2 border border-green-300 rounded mb-4"
        
      />

      {/* Category Checkboxes */}
      <div className="flex flex-wrap gap-4">
        {categories.map(cat => (
          <label key={cat.id} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={selected.includes(cat.id)}
              onChange={() => toggleCategory(cat.id)}
              className="accent-green-700"
            />
            <span>{cat.name}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
