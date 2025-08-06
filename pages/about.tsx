import Image from 'next/image';
import Head from 'next/head';
import { motion } from 'framer-motion';

export default function AboutPage() {
    return (
        <>
        <Head>
            <title>How It Works | E-Shop</title>
        </Head>

        <section className="bg-white py-12 px-4 sm:px-6 lg:px-8">
            <motion.div
            className="max-w-6xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            >
            <h1 className="text-4xl font-bold text-center text-green-800 mb-10">
                How to Use E-Shop
            </h1>

            <div className="grid gap-12 sm:grid-cols-1 md:grid-cols-2">
                <AnimatedStep
                image="/assets/signup.png"
                title="1. Create an Account"
                description="Register in seconds using your email. Access your dashboard to manage your profile, orders, and preferences."
                delay={0.1}
                />
                <AnimatedStep
                image="/assets/browse.png"
                title="2. Browse Products"
                description="Explore categories or use the smart search to find what you need. Read product reviews and compare prices."
                delay={0.2}
                />
                <AnimatedStep
                image="/assets/cart.png"
                title="3. Add to Cart & Checkout"
                description="Securely add items to your cart and complete your purchase with multiple payment and shipping options."
                delay={0.3}
                />
                <AnimatedStep
                image="/assets/track-order.png"
                title="4. Track Your Orders"
                description="Easily track your order status in real-time. Receive delivery updates by email or SMS."
                delay={0.4}
                />
            </div>

            <motion.div
                className="mt-16 text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                <h2 className="text-2xl font-semibold text-green-700 mb-4">
                Why Shop With Us?
                </h2>
                <p className="max-w-2xl mx-auto text-gray-700 mb-6">
                At E-Shop, we prioritize convenience, quality, and speed. 
                Whether you’re buying essentials or the latest trends, we 
                ensure a smooth, secure, and satisfying shopping journey.
                </p>
                <a
                href="/products"
                className="inline-block mt-4 bg-green-700 text-white px-6 py-2 rounded hover:bg-green-800 transition"
                >
                Start Shopping
                </a>
            </motion.div>
            </motion.div>
        </section>
        </>
    );
    }

    function AnimatedStep({
    image,
    title,
    description,
    delay = 0,
    }: {
    image: string;
    title: string;
    description: string;
    delay?: number;
    }) {
    return (
        <motion.div
        className="flex flex-col items-center text-center px-4"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay }}
        >
        <div className="w-24 h-24 mb-4 relative">
            <Image
            src={image}
            alt={title}
            layout="fill"
            objectFit="contain"
            className="drop-shadow-md"
            />
        </div>
        <h3 className="text-lg font-semibold text-green-800 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
        </motion.div>
    );
}
