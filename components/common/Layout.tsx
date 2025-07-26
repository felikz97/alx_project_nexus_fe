import Header from './Header';
import Footer from './Footer';

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <div className="flex flex-col min-h-screen bg-yellow-50 text-green-900">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
