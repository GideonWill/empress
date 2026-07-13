import { useState, useMemo } from "react";
import { Link } from "wouter";
import { useWishlist } from "@/context/WishlistContext";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Heart, Trash2, Grid3X3, List, ChevronDown, X } from "lucide-react";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/ui/product-card";
import { formatPrice } from "@/lib/currency";
import { useProductStore } from "@/context/ProductStore";
import ShopHeroImg from "@assets/outfit 2.jpeg";

const SORT_OPTIONS = ["Featured", "Price: Low to High", "Price: High to Low", "Newest", "Best Rating"];

export default function FavoritesPage() {
  const { products } = useProductStore();
  const { items: wishlistItems, clearAll } = useWishlist();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("Featured");
  const [showSort, setShowSort] = useState(false);

  const favoriteProducts = useMemo(() => {
    let list = products.filter(p => wishlistItems.some(item => item.id === p.id));

    switch (sortBy) {
      case "Price: Low to High": list.sort((a, b) => a.price - b.price); break;
      case "Price: High to Low": list.sort((a, b) => b.price - a.price); break;
      case "Newest": list = list.filter(p => p.isNew).concat(list.filter(p => !p.isNew)); break;
      case "Best Rating": list.sort((a, b) => b.rating - a.rating); break;
    }
    return list;
  }, [products, wishlistItems, sortBy]);

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <AnnouncementBar />
      <Header />

      <main className="flex-1 bg-white">
        {/* Hero Banner */}
        <section className="relative h-[40vh] min-h-[260px] w-full overflow-hidden bg-black">
          <img
            src={ShopHeroImg}
            alt="Favorites"
            className="absolute inset-0 w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Heart className="w-10 h-10 text-white mb-4 mx-auto" strokeWidth={1.5} />
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 tracking-tight">
                My Favorites
              </h1>
              <p className="text-gray-300 text-sm md:text-base max-w-md mx-auto">
                {favoriteProducts.length > 0
                  ? `You have ${favoriteProducts.length} saved ${favoriteProducts.length === 1 ? "item" : "items"}`
                  : "Your wishlist is empty"}
              </p>
            </motion.div>
            <div className="flex items-center space-x-2 text-sm text-gray-300 font-semibold mt-4">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight size={14} />
              <span className="text-white">Favorites</span>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-10">
          {favoriteProducts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-24"
            >
              <Heart className="w-16 h-16 text-gray-200 mx-auto mb-6" strokeWidth={1} />
              <h2 className="text-2xl font-bold mb-3">No favorites yet</h2>
              <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                Browse our collection and tap the heart icon to save items you love.
              </p>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 bg-black text-white px-10 py-3.5 rounded-full font-bold text-sm uppercase tracking-wide hover:bg-gray-800 transition-colors"
              >
                Start Shopping <ChevronRight size={16} />
              </Link>
            </motion.div>
          ) : (
            <>
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row justify-between items-center bg-[#FAF8F5] p-4 mb-8 gap-4">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <span className="text-sm text-gray-500">
                    {favoriteProducts.length} {favoriteProducts.length === 1 ? "item" : "items"}
                  </span>
                  <button
                    onClick={clearAll}
                    className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={12} /> Clear all
                  </button>
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
                  {/* Sort */}
                  <div className="relative">
                    <button
                      onClick={() => setShowSort(v => !v)}
                      data-testid="button-sort-favorites"
                      className="flex items-center gap-2 text-sm font-medium border border-gray-300 px-4 py-2 hover:border-black transition-colors"
                    >
                      {sortBy} <ChevronDown size={14} className={`transition-transform ${showSort ? "rotate-180" : ""}`} />
                    </button>
                    <AnimatePresence>
                      {showSort && (
                        <motion.div
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 4 }}
                          className="absolute right-0 top-full mt-1 w-52 bg-white border border-gray-200 shadow-lg z-20"
                        >
                          {SORT_OPTIONS.map(opt => (
                            <button
                              key={opt}
                              onClick={() => { setSortBy(opt); setShowSort(false); }}
                              className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${sortBy === opt ? "font-bold" : ""}`}
                            >
                              {opt}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Grid/List toggle */}
                  <div className="hidden sm:flex items-center gap-1 border border-gray-200 p-1">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-1.5 transition-colors ${viewMode === "grid" ? "bg-black text-white" : "text-gray-400 hover:text-black"}`}
                    >
                      <Grid3X3 size={16} />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-1.5 transition-colors ${viewMode === "list" ? "bg-black text-white" : "text-gray-400 hover:text-black"}`}
                    >
                      <List size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Product Grid */}
              {viewMode === "grid" ? (
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                  {favoriteProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      id={product.id}
                      name={product.name}
                      price={formatPrice(product.price)}
                      originalPrice={product.originalPrice ? formatPrice(product.originalPrice) : undefined}
                      image={product.image}
                      onSale={product.onSale}
                      isNew={product.isNew}
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {favoriteProducts.map((product) => (
                    <Link key={product.id} href={`/shop/${product.id}`}>
                      <div className="flex gap-6 border border-gray-100 p-4 hover:border-black transition-colors">
                        <div className="w-24 h-32 flex-shrink-0 bg-gray-50 overflow-hidden">
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex flex-col justify-between flex-1 py-1">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              {product.onSale && <span className="text-[10px] font-bold bg-[#E63946] text-white px-2 py-0.5">Sale</span>}
                              {product.isNew && <span className="text-[10px] font-bold bg-black text-white px-2 py-0.5">New</span>}
                            </div>
                            <h3 className="font-semibold text-base">{product.name}</h3>
                            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{product.description}</p>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {product.originalPrice && <span className="text-sm text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>}
                              <span className="font-bold">{formatPrice(product.price)}</span>
                            </div>
                            <span className="text-xs text-gray-400">{product.category}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
