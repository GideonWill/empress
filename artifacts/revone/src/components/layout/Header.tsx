import { Link } from "wouter";
import { Search, User, Heart, ShoppingBag, Menu } from "lucide-react";
import Logo from "@assets/revone-logo.svg";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex-1 flex items-center md:hidden">
          <button className="p-2 -ml-2">
            <Menu className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 md:flex-none flex justify-center md:justify-start">
          <Link href="/">
            <img src={Logo} alt="Revone" className="h-6 md:h-8" />
          </Link>
        </div>

        <nav className="hidden md:flex flex-1 justify-center space-x-8">
          <Link href="/" className="text-sm font-semibold tracking-wide hover:text-gray-600 transition-colors uppercase">Home</Link>
          <Link href="/shop" className="text-sm font-semibold tracking-wide hover:text-gray-600 transition-colors uppercase">Shop</Link>
          <div className="relative">
            <Link href="/shop" className="text-sm font-semibold tracking-wide hover:text-gray-600 transition-colors uppercase">Products</Link>
            <span className="absolute -top-3 -right-6 bg-[#E63946] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm leading-none">SALE</span>
          </div>
          <Link href="/" className="text-sm font-semibold tracking-wide hover:text-gray-600 transition-colors uppercase">Pages</Link>
          <Link href="/blogs" className="text-sm font-semibold tracking-wide hover:text-gray-600 transition-colors uppercase">Blogs</Link>
        </nav>

        <div className="flex-1 flex items-center justify-end space-x-4 md:space-x-6">
          <button className="hover:text-gray-600 transition-colors">
            <Search className="w-5 h-5" />
          </button>
          <button className="hidden md:block hover:text-gray-600 transition-colors">
            <User className="w-5 h-5" />
          </button>
          <button className="relative hover:text-gray-600 transition-colors">
            <Heart className="w-5 h-5" />
            <span className="absolute -top-1.5 -right-2 bg-black text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-medium">0</span>
          </button>
          <button className="relative hover:text-gray-600 transition-colors">
            <ShoppingBag className="w-5 h-5" />
            <span className="absolute -top-1.5 -right-2 bg-black text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-medium">0</span>
          </button>
        </div>
      </div>
    </header>
  );
}
