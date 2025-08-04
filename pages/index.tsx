import ProductGridWithSidebar from '@/components/ProductGridWithSidebar';
export default function HomePage() {
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
        <div className="bg-black/50 p-6 sm:p-10 rounded-lg max-w-md sm:max-w-xl">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">Welcome to E-Shop</h1>
          <p className="text-yellow-100 text-sm sm:text-base">
            Discover our latest products and enjoy seamless online shopping.
          </p>
        </div>
      </section>

      {/* Product Grid & Sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <h2 className="text-xl sm:text-2xl font-bold mb-6">🛍 Featured Products</h2>
        <ProductGridWithSidebar />
      </div>
    </div>
  );
}
