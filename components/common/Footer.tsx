import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-yellow-100 text-green-900 border-t border-green-300 px-4 py-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        
        {/* Optional Logo */}
        <div className="flex items-center gap-2">
          <Image
            src="/assets/logo.png"
            alt="E-Shop Logo"
            width={32}
            height={32}
            className="rounded"
          />
          <span className="text-lg font-semibold">E-Shop</span>
        </div>

        {/* Social Media Icons */}
        <div className="flex gap-4 items-center">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <Image src="/assets/facebook.svg" alt="Facebook" width={20} height={20} />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <Image src="/assets/twitter.svg" alt="Twitter" width={20} height={20} />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <Image src="/assets/instagram.svg" alt="Instagram" width={20} height={20} />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
            <Image src="/assets/linkedin.svg" alt="LinkedIn" width={20} height={20} />
          </a>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          <Link href="/about" className="hover:underline">About</Link>
          <Link href="/contact" className="hover:underline">Contact</Link>
          <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
          <Link href="/terms" className="hover:underline">Terms of Service</Link>
        </div>

        {/* Copyright */}
        <div className="text-xs text-center md:text-right">
          © {new Date().getFullYear()} E-Shop. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
