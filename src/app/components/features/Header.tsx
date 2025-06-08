import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="py-4 px-6 md:px-12 lg:px-24">
      <nav className="container mx-auto flex justify-between items-center">
        {/* Logo and Main Nav */}
        <div className="flex items-center gap-8">
          {/* Link ke halaman Home */}
          <Link href="/landing" className="flex items-center gap-2">
            <Image
              src="/images/logo.png"
              alt="CatDoc AI Logo"
              width={40}
              height={40}
            />
            <span className="text-xl font-bold text-[#FFFF]">CatDoc AI</span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            {/* Link ke halaman Home */}
            <Link href="/landing" className="text-lg font-medium text-[#00695c] hover:text-[#004d40]">
              Home
            </Link>
            {/* Link ke halaman About */}
            <Link href="/about" className="text-lg font-medium text-[#00695c] hover:text-[#004d40]">
              About
            </Link>
          </div>
        </div>
        
        {/* Admin Login Button */}
        <div>
          <Link href="/login" className="px-6 py-2 bg-[#00796b] text-white rounded-full shadow-md hover:bg-[#004d40] transition-colors">
            Login Admin
          </Link>
        </div>
      </nav>
    </header>
  );
}
