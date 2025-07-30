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
};

export default function ProductDetailPage() {
    const router = useRouter();
    const { id } = router.query;

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
        axios
            .get(`http://localhost:8000/api/products/${id}/`)
            .then(res => setProduct(res.data))
            .catch(err => console.error('Error loading product:', err))
            .finally(() => setLoading(false));
        }
    }, [id]);

    if (loading) return <p className="p-6">Loading...</p>;
    if (!product) return <p className="p-6 text-red-600">Product not found.</p>;

    const imageUrl = product.image?.startsWith('http')
    ? product.image
    : `http://localhost:8000${product.image}`;

    return (
        <div className="max-w-4xl mx-auto p-6 flex flex-col md:flex-row gap-6">
        <div className="relative w-full md:w-1/2 h-80">
            {product.image ? (
            <Image src={imageUrl} alt={product.name} layout="fill" objectFit="cover" className="rounded" />
            ) : (
            <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center text-gray-500">
                No Image
            </div>
            )}
        </div>

        <div className="flex flex-col justify-between md:w-1/2">
            <h1 className="text-3xl font-bold text-green-800 mb-2">{product.name}</h1>
            <p className="text-green-700 mb-4">{product.description}</p>
            <p className="text-2xl font-bold text-green-900">Ksh {product.price}</p>

            <AddToCartButton productId={product.id} />
        </div>
        </div>
    );
}
