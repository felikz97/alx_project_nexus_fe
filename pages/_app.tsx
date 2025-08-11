// pages/_app.tsx

// pages/_app.tsx
import { AuthProvider } from "@/context/AuthContext";
import Layout from '@/components/common/Layout';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';

import { Provider } from 'react-redux';
import { store } from '@/components/store/store/store';
import { CartProvider } from '@/components/cart/CartContext';
import { Toaster } from 'react-hot-toast';

import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/router';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();


return (
    <Provider store={store}>
      <AuthProvider>
        <CartProvider>
          <Layout>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={router.route}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <Toaster />
                <Component {...pageProps} />
              </motion.div>
            </AnimatePresence>
          </Layout>
        </CartProvider>
      </AuthProvider>
    </Provider>
  );
}

