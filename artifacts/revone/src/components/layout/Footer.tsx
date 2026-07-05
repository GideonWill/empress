import { Link } from "wouter";
import Logo from "@assets/revone-logo.svg";
import { SiFacebook, SiX, SiInstagram, SiYoutube, SiVisa, SiMastercard, SiAmericanexpress, SiPaypal, SiDiscover } from "react-icons/si";

export function Footer() {
  return (
    <footer className="bg-[#111111] text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <img src={Logo} alt="Empress" className="h-8 invert brightness-0 invert" style={{ filter: "invert(1)" }} />
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              AdornThemes is a premium Shopify theme developer creating beautiful, high-converting e-commerce experiences.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center hover:bg-white hover:text-black transition-colors"><SiFacebook size={16} /></a>
              <a href="#" className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center hover:bg-white hover:text-black transition-colors"><SiX size={16} /></a>
              <a href="#" className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center hover:bg-white hover:text-black transition-colors"><SiInstagram size={16} /></a>
              <a href="#" className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center hover:bg-white hover:text-black transition-colors"><SiYoutube size={16} /></a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-6">Information</h3>
            <ul className="space-y-4">
              <li><Link href="/" className="text-gray-400 hover:text-white transition-colors text-sm">About Us</Link></li>
              <li><Link href="/" className="text-gray-400 hover:text-white transition-colors text-sm">Our Brands</Link></li>
              <li><Link href="/" className="text-gray-400 hover:text-white transition-colors text-sm">My Account</Link></li>
              <li><Link href="/" className="text-gray-400 hover:text-white transition-colors text-sm">My Orders</Link></li>
              <li><Link href="/" className="text-gray-400 hover:text-white transition-colors text-sm">Store Location</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-6">Customer Services</h3>
            <ul className="space-y-4">
              <li><Link href="/" className="text-gray-400 hover:text-white transition-colors text-sm">Help & FAQs</Link></li>
              <li><Link href="/" className="text-gray-400 hover:text-white transition-colors text-sm">Returns & Conditions</Link></li>
              <li><Link href="/" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy Policy</Link></li>
              <li><Link href="/" className="text-gray-400 hover:text-white transition-colors text-sm">Terms & Conditions</Link></li>
              <li><Link href="/" className="text-gray-400 hover:text-white transition-colors text-sm">Support Center</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-6">Newsletter</h3>
            <p className="text-gray-400 text-sm mb-4">
              Sign up for our newsletter to receive updates on exclusive offers and new arrivals.
            </p>
            <form className="mb-6 flex flex-col gap-3">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="w-full bg-transparent border border-gray-700 rounded-none px-4 py-3 text-sm focus:outline-none focus:border-white transition-colors"
              />
              <button 
                type="submit" 
                className="w-full bg-white text-black font-bold py-3 rounded-none uppercase tracking-wide text-sm hover:bg-gray-200 transition-colors"
              >
                Subscribe
              </button>
            </form>
            <div className="flex space-x-3 text-gray-500">
              <SiVisa size={24} />
              <SiMastercard size={24} />
              <SiAmericanexpress size={24} />
              <SiPaypal size={24} />
              <SiDiscover size={24} />
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>© 2025, Empress. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
