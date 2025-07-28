import Image from 'next/image';

type Product = {
  id: number;
  name: string;
  description: string;
  price: string;
  image?: string;
};

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="bg-white shadow rounded-md flex p-4 gap-4 border-l-4 border-green-600">
      {/* Thumbnail */}
      <div className="min-w-[100px] h-[100px] relative">
        {product.image ? (
          <Image src={product.image} alt={product.name} layout="fill" objectFit="cover" className="rounded" />
        ) : (
          <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center text-sm text-gray-500">
            No Image
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col justify-between">
        <h3 className="text-lg font-semibold text-green-800">{product.name}</h3>
        <p className="text-green-700 text-sm line-clamp-2">{product.description}</p>
        <p className="text-green-900 font-bold">${product.price}</p>
      </div>
    </div>
  );
}
