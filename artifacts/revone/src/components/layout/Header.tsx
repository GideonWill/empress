import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { Search, User, Heart, ShoppingBag, Menu, X, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "@assets/revone-logo.svg";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { PRODUCTS } from "@/data/products";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Products", href: "/shop", badge: "SALE" },
  { label: "Pages", href: "/blogs" },
  { label: "Blogs", href: "/blogs" },
];

export function Header() {
  const { totalItems } = useCart();
  const { totalItems: wishlistCount } = useWishlist();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(PRODUCTS.slice(0, 0));
  const searchRef = useRef<HTMLInputElement>(null);
  const [location] = useLocation();

  useEffect(() => { setMenuOpen(false); }, [location]);

  useEffect(() => {
    if (searchOpen) setTimeout(() => searchRef.current?.focus(), 100);
  }, [searchOpen]);

  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const q = searchQuery.toLowerCase();
      setSearchResults(PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
      ).slice(0, 5));
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  useEffect(() => {
    if (menuOpen || searchOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen, searchOpen]);

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          {/* Mobile menu button */}
          <div className="flex-1 flex items-center md:hidden">
            <button
              onClick={() => setMenuOpen(true)}
              data-testid="button-mobile-menu"
              className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {/* Logo */}
          <div className="flex-1 md:flex-none flex justify-center md:justify-start">
            <Link href="/">
              <img src={Logo} alt="Empress" className="h-6 md:h-8" />
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex flex-1 justify-center space-x-8">
            {NAV_LINKS.map(link => (
              <div key={link.label} className="relative">
                <Link
                  href={link.href}
                  data-testid={`nav-${link.label.toLowerCase()}`}
                  className={`text-sm font-semibold tracking-wide hover:text-gray-600 transition-colors uppercase ${location === link.href ? "text-black" : "text-gray-800"}`}
                >
                  {link.label}
                </Link>
                {link.badge && (
                  <span className="absolute -top-3 -right-7 bg-[#E63946] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm leading-none">
                    {link.badge}
                  </span>
                )}
              </div>
            ))}
          </nav>

          {/* Icons */}
          <div className="flex-1 flex items-center justify-end space-x-4 md:space-x-5">
            <button
              onClick={() => setSearchOpen(true)}
              data-testid="button-search"
              className="hover:text-gray-600 transition-colors p-1"
            >
              <Search className="w-5 h-5" />
            </button>

            <button className="hidden md:block hover:text-gray-600 transition-colors p-1">
              <User className="w-5 h-5" />
            </button>

            <Link href="/shop" className="relative hover:text-gray-600 transition-colors p-1" data-testid="button-wishlist">
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-black text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-medium">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link href="/cart" className="relative hover:text-gray-600 transition-colors p-1" data-testid="button-cart">
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <motion.span
                  key={totalItems}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1.5 -right-2 bg-black text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-medium"
                >
                  {totalItems}
                </motion.span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-[60]"
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed top-0 left-0 bottom-0 w-80 bg-white z-[70] flex flex-col overflow-y-auto"
            >
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <img src={Logo} alt="Empress" className="h-7" />
                <button
                  onClick={() => setMenuOpen(false)}
                  data-testid="button-close-menu"
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <nav className="flex-1 p-6">
                <ul className="space-y-1">
                  {NAV_LINKS.map(link => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="flex items-center justify-between py-3.5 px-3 text-base font-semibold uppercase tracking-wide hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <span>{link.label}</span>
                        <div className="flex items-center gap-2">
                          {link.badge && (
                            <span className="bg-[#E63946] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm">{link.badge}</span>
                          )}
                          <ChevronRight size={16} className="text-gray-400" />
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>

                <div className="border-t border-gray-100 mt-6 pt-6 space-y-1">
                  <Link href="/cart" className="flex items-center gap-3 py-3.5 px-3 text-sm font-semibold hover:bg-gray-50 rounded-lg transition-colors">
                    <ShoppingBag size={18} />
                    Cart
                    {totalItems > 0 && (
                      <span className="ml-auto bg-black text-white text-[10px] px-2 py-0.5 rounded-full font-bold">{totalItems}</span>
                    )}
                  </Link>
                  <button className="flex items-center gap-3 w-full py-3.5 px-3 text-sm font-semibold hover:bg-gray-50 rounded-lg transition-colors">
                    <User size={18} />
                    My Account
                  </button>
                </div>
              </nav>

              <div className="p-6 border-t border-gray-100">
                <p className="text-xs text-gray-400 text-center">© 2025 Empress. All rights reserved.</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Search Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white z-[80] flex flex-col"
          >
            <div className="border-b border-gray-100">
              <div className="container mx-auto px-4 h-20 flex items-center gap-4">
                <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <input
                  ref={searchRef}
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search products…"
                  data-testid="input-search"
                  className="flex-1 text-lg outline-none bg-transparent"
                />
                <button
                  onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
                  data-testid="button-close-search"
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="container mx-auto px-4 py-8 flex-1 overflow-y-auto">
              {searchQuery.length > 1 && searchResults.length === 0 && (
                <p className="text-gray-500 text-center py-12">No results for "{searchQuery}"</p>
              )}
              {searchResults.length > 0 && (
                <div className="max-w-2xl mx-auto">
                  <p className="text-xs text-gray-400 uppercase tracking-widest mb-4 font-semibold">Products</p>
                  <div className="space-y-2">
                    {searchResults.map(p => (
                      <Link
                        key={p.id}
                        href={`/shop/${p.id}`}
                        onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
                        data-testid={`search-result-${p.id}`}
                        className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <div className="w-14 h-16 bg-gray-100 flex-shrink-0 overflow-hidden">
                          <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{p.name}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{p.category} · ${p.price.toFixed(2)}</p>
                        </div>
                        <ChevronRight size={16} className="ml-auto text-gray-400" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              {searchQuery.length <= 1 && (
                <div className="max-w-2xl mx-auto">
                  <p className="text-xs text-gray-400 uppercase tracking-widest mb-4 font-semibold">Popular Searches</p>
                  <div className="flex flex-wrap gap-3">
                    {["Dresses", "Jackets", "Denim", "Shoes", "Accessories", "New Arrivals"].map(term => (
                      <button
                        key={term}
                        onClick={() => setSearchQuery(term)}
                        className="px-4 py-2 border border-gray-200 text-sm hover:border-black hover:bg-gray-50 transition-colors rounded-full"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
