// pages/ index.tsx
import ProductSidebar from '@/components/Product/ProductSidebar';
import ProductGridWithSidebar from '@/components/ProductGridWithSidebar';
import { motion } from 'framer-motion';
import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/home')
  }, [router])
  return (
    <div className="text-green-900 bg-yellow-50 min-h-screen">
      {/* Hero Section */}
      <section
        className="relative bg-green-900 text-yellow-50 min-h-[60vh] flex flex-col justify-center items-center text-center px-4 sm:px-6"
        style={{
          backgroundImage: 'url("/assets/hero-bg.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-black/50 p-6 sm:p-10 rounded-lg w-full max-w-3xl"
        >
          <motion.h1
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="text-2xl sm:text-4xl font-bold mb-4 text-center mx-auto sm:whitespace-nowrap"
          >
            Welcome to Nexus E-commerce
          </motion.h1>
          <p className="text-yellow-100 text-sm sm:text-base">
            Discover our latest products and enjoy seamless online shopping.
          </p>
        </motion.div>
      </section>

      {/* Product Grid & Sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <h2 className="text-xl sm:text-2xl font-bold mb-6">🛍 Featured Products</h2>
        <ProductGridWithSidebar />
      </div>
    </div>
  );
}
