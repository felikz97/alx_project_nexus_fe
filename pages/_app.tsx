// pages/_app.tsx
//import './globals.css';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Layout from '@/components/common/Layout';
import { Provider } from 'react-redux';
import { store } from '@/components/store/store/store';
import { CartProvider } from '@/components/cart/CartContext'; // ✅ import CartProvider

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <CartProvider> {/* ✅ wrap with CartProvider */}
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </CartProvider>
    </Provider>
  );
}

