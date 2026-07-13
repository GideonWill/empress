import { Link } from "wouter";
import Logo from "@assets/empress-logo.png";
import { SiFacebook, SiX, SiInstagram, SiYoutube } from "react-icons/si";
import Outfit2Img from "@assets/outfit 2.jpeg";
import { TrustBanner } from "@/components/layout/TrustBanner";

export function Footer() {
  return (
    <footer 
      className="relative bg-[#111111] text-white pt-16 pb-8 overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: `url("${Outfit2Img}")` }}
    >
      {/* Dark overlay backdrop to keep text readable and look premium */}
      <div className="absolute inset-0 bg-black/85 backdrop-blur-[3px] z-0" />

      {/* Trust badges row */}
      <div className="relative z-10 border-b border-gray-800/60 pb-8 mb-12">
        <TrustBanner />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div className="space-y-6">
            <img 
              src={Logo} 
              alt="Empress" 
              className="h-20 object-contain" 
              style={{ filter: "sepia(0.6) saturate(3) hue-rotate(5deg) brightness(0.7) contrast(1.2)" }}
            />
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Empress is a luxury storefront dedicated to premium women's apparel, luxury footwear, and high-definition lace frontal wigs.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center hover:bg-white hover:text-black transition-colors"><SiFacebook size={16} /></a>
              <a href="#" className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center hover:bg-white hover:text-black transition-colors"><SiX size={16} /></a>
              <a href="#" className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center hover:bg-white hover:text-black transition-colors"><SiInstagram size={16} /></a>
              <a href="#" className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center hover:bg-white hover:text-black transition-colors"><SiYoutube size={16} /></a>
            </div>
          </div>

          <div className="flex flex-col justify-start md:pt-4">
            <ul className="space-y-4">
              <li><Link href="/" className="text-gray-400 hover:text-white transition-colors text-sm font-semibold">Home</Link></li>
              <li><Link href="/shop" className="text-gray-400 hover:text-white transition-colors text-sm font-semibold">Shop All</Link></li>
              <li><Link href="/blogs" className="text-gray-400 hover:text-white transition-colors text-sm font-semibold">Blogs</Link></li>
              <li><Link href="/track" className="text-gray-400 hover:text-white transition-colors text-sm font-semibold">Track Order</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 relative">
          <p>© 2025, Empress. All rights reserved.</p>

          {/* Outfit 2 Showcase in the bottom corner */}
          <div className="mt-6 md:mt-0 md:absolute md:bottom-0 md:right-0 flex items-center gap-3 bg-black/50 border border-gray-800/80 p-2 rounded-xl backdrop-blur-md">
            <img 
              src={Outfit2Img} 
              alt="Empress Look II" 
              className="w-10 h-14 object-cover rounded-lg border border-gray-700/50"
            />
            <div className="text-left">
              <p className="text-[10px] font-bold text-gray-450 uppercase tracking-widest">Empress Style</p>
              <p className="text-xs font-semibold text-white mt-0.5">Outfit II Showcase</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
