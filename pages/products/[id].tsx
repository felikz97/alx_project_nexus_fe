import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import AddToCartButton from '@/components/common/AddToCartButton';

type Product = {
  id: number;
  name: string;
  description: string;
  price: string;
  image?: string;
  stock: number;
  sizes?: string[];
  colors?: string[];
  seller?: {
    id: number;
    username: string;
  };
};

export default function ProductDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    axios
      .get(`http://localhost:8000/api/products/${id}/`)
      .then(res => setProduct(res.data))
      .catch(err => console.error('Error loading product:', err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="p-6">Loading...</p>;
  if (!product) return <p className="p-6 text-red-600">Product not found.</p>;

  const imageUrl = product.image?.startsWith('http')
    ? product.image
    : `http://localhost:8000${product.image}`;

  return (
    <div className="max-w-4xl mx-auto p-6 flex flex-col md:flex-row gap-6">
      
      {/* Product Image */}
      <div className="relative w-full md:w-1/2 h-80">
        {product.image ? (
          <Image
            src={imageUrl}
            alt={product.name}
            layout="fill"
            objectFit="cover"
            className="rounded"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center text-gray-500">
            No Image
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex flex-col justify-between md:w-1/2">
        <div>
          <h1 className="text-3xl font-bold text-green-800 mb-2">{product.name}</h1>
          <p className="text-green-700 mb-4">{product.description}</p>
          <p className="text-2xl font-bold text-green-900 mb-1">Ksh {product.price}</p>
          <p className="text-sm text-gray-600 mb-2">
            Stock available: <span className="font-semibold">{product.stock}</span>
          </p>

          {/* Sizes */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-3">
              <h2 className="text-sm font-semibold text-green-800">Available Sizes:</h2>
              <div className="flex gap-2 mt-1 flex-wrap">
                {product.sizes.map((size, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 border rounded text-sm text-green-900 bg-green-100"
                  >
                    {size}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Colors */}
          {product.colors && product.colors.length > 0 && (
            <div className="mb-3">
              <h2 className="text-sm font-semibold text-green-800">Colors:</h2>
              <div className="flex gap-2 mt-1 flex-wrap">
                {product.colors.map((color, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 border rounded text-sm text-green-900 bg-green-100"
                  >
                    {color}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Seller Info */}
          {product.seller?.username && (
            <p className="text-sm text-gray-500 mt-1">
              Sold by:{' '}
              <span className="font-semibold text-green-700">
                {product.seller.username}
              </span>
            </p>
          )}
        </div>

        <div className="mt-6">
          <AddToCartButton productId={product.id} />
        </div>
      </div>
    </div>
  );
}
