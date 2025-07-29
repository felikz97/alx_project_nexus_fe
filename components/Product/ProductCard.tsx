import Image from 'next/image';
import Link from 'next/link';

import { useEffect, useState } from 'react';
type Product = {
  id: number;
  name: string;
  description: string;
  price: string;
  image?: string;
};

export default function ProductCard({ product }: { product: Product }) {
  // Fallback to full URL if image is a relative path
  const imageUrl = product.image?.startsWith('http')
    ? product.image
    : `http://localhost:8000${product.image}`;

  return (
    <Link href={`/products/${product.id}`}>
      <a className="block"> {/* wraps the whole card */}
        <div className="bg-white shadow-md rounded-md flex p-4 gap-4 border-l-4 border-green-600">
          {/* Thumbnail */}
          <div className="relative min-w-[100px] h-[100px]">
            {product.image ? (
              <Image
                src={imageUrl}
                alt={product.name}
                layout="fill"
                objectFit="cover"
                className="rounded"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center text-sm text-gray-500">
                No Image
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-between flex-grow">
            <h3 className="text-lg font-semibold text-green-800">{product.name}</h3>
            <p className="text-green-700 text-sm line-clamp-2">{product.description}</p>
            <p className="text-green-900 font-bold">${product.price}</p>
          </div>
        </div>
    </a>
</Link>
  );
}
