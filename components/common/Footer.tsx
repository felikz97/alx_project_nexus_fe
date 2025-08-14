import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-gree-100 text-green-900 border-t border-green-300 px-4 py-8">
      <div className=" max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        
        {/* Optional Logo */}
        <div className="flex items-center gap-2">
          <Image
            src="/assets/logo.png"
            alt="logo"
            width={36}
            height={32}
            className="rounded-lg"
          />
          <span className="text-lg font-semibold">Nexus E-commerce</span>
        </div>

        {/* Social Media Icons */}
        <div className="flex gap-4 items-center">
          <Image
            src="/assets/facebook.png"
            alt="Facebook"
            width={30}
            height={30}
            className="rounded-full cursor-pointer hover:opacity-80 transition"
            onClick={() => window.open('https://facebook.com', '_blank', 'noopener,noreferrer')}
          />

          <Image
            src="/assets/twitter.svg"
            alt="Twitter"
            width={30}
            height={30}
            className="cursor-pointer hover:opacity-80 transition"
            onClick={() => window.open('https://x.com/FelikzK254', '_blank', 'noopener,noreferrer')}
          />

          <Image
            src="/assets/instagram.png"
            alt="Instagram"
            width={30}
            height={30}
            className="cursor-pointer hover:opacity-80 transition"
            onClick={() => window.open('https://instagram.com', '_blank', 'noopener,noreferrer')}
          />

          <Image
            src="/assets/linkedin.svg"
            alt="LinkedIn"
            width={30}
            height={30}
            className="cursor-pointer hover:opacity-80 transition"
            onClick={() => window.open('https://www.linkedin.com/in/felix-kipkemoi-a272b12b8/', '_blank', 'noopener,noreferrer')}
          />
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
          © {new Date().getFullYear()} Nexus E-commerce. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
