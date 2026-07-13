import { useState, useMemo, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { useWishlist } from "@/context/WishlistContext";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Grid3X3, List, ChevronDown, Filter, X } from "lucide-react";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { TrustBanner } from "@/components/layout/TrustBanner";
import { ProductCard } from "@/components/ui/product-card";
import { CategoryCircle } from "@/components/ui/category-circle";
import { CATEGORIES } from "@/data/products";
import { formatPrice } from "@/lib/currency";
import { useProductStore } from "@/context/ProductStore";
import ShopHeroImg from "@assets/outfit 2.jpeg";

const COLORS = [
  { name: "Black", code: "#000000" },
  { name: "White", code: "#FFFFFF" },
  { name: "Red", code: "#E63946" },
  { name: "Blue", code: "#1D3557" },
  { name: "Beige", code: "#F5F5DC" },
  { name: "Grey", code: "#808080" },
  { name: "Brown", code: "#4B3A2A" },
  { name: "Gold", code: "#FFD700" },
];

const SORT_OPTIONS = ["Featured", "Price: Low to High", "Price: High to Low", "Newest", "Best Rating"];

function hexToRgb(hex: string) {
  const cleanHex = hex.replace("#", "");
  const bigint = parseInt(cleanHex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return { r, g, b };
}

function colorDistance(color1: string, color2: string) {
  try {
    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);
    return Math.sqrt(
      Math.pow(rgb1.r - rgb2.r, 2) +
      Math.pow(rgb1.g - rgb2.g, 2) +
      Math.pow(rgb1.b - rgb2.b, 2)
    );
  } catch {
    return Infinity;
  }
}

export default function Shop() {
  const { products } = useProductStore();
  const CATEGORY_NAMES = useMemo(() => ["All", ...Array.from(new Set(products.map(p => p.category)))], [products]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [location] = useLocation();
  const { items: wishlistItems } = useWishlist();
  const [wishlistOnly, setWishlistOnly] = useState(false);
  const [sortBy, setSortBy] = useState("Featured");
  const [showSort, setShowSort] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [customColor, setCustomColor] = useState("#ffffff");
  const [useCustomColor, setUseCustomColor] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(500);
  const [onSaleOnly, setOnSaleOnly] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const productsRef = useRef<HTMLDivElement>(null);

  function handleCategoryClick(categoryName: string) {
    if (categoryName === "New Arrival") {
      setSelectedCategory("All");
      setOnSaleOnly(false);
      setSortBy("Newest");
    } else if (categoryName === "Deal Zone") {
      setSelectedCategory("All");
      setOnSaleOnly(true);
    } else {
      setSelectedCategory(categoryName);
      setOnSaleOnly(false);
    }
    // Scroll to products section
    setTimeout(() => {
      productsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }

  const [currentSearch, setCurrentSearch] = useState(window.location.search);

  useEffect(() => {
    const handleUrlChange = () => {
      setCurrentSearch(window.location.search);
    };

    window.addEventListener("popstate", handleUrlChange);

    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function (...args) {
      originalPushState.apply(this, args);
      handleUrlChange();
    };

    history.replaceState = function (...args) {
      originalReplaceState.apply(this, args);
      handleUrlChange();
    };

    return () => {
      window.removeEventListener("popstate", handleUrlChange);
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
    };
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(currentSearch);
    const catParam = params.get("category");
    const wishlistParam = params.get("wishlist");

    if (wishlistParam === "true") {
      setWishlistOnly(true);
      setSelectedCategory("All");
      setOnSaleOnly(false);
    } else {
      setWishlistOnly(false);
      if (catParam) {
        if (["Clothing", "Shoes", "Wigs"].includes(catParam)) {
          setSelectedCategory(catParam);
          setOnSaleOnly(false);
        } else if (catParam === "Sale") {
          setSelectedCategory("All");
          setOnSaleOnly(true);
        } else if (catParam === "New") {
          setSelectedCategory("All");
          setOnSaleOnly(false);
          setSortBy("Newest");
        }
      } else {
        setSelectedCategory("All");
        setOnSaleOnly(false);
      }
    }
  }, [currentSearch]);

  function toggleColor(code: string) {
    setSelectedColors(prev =>
      prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
    );
  }

  function toggleSize(size: string) {
    setSelectedSizes(prev =>
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  }

  const filtered = useMemo(() => {
    let list = [...products];
    if (wishlistOnly) {
      list = list.filter(p => wishlistItems.some(item => item.id === p.id));
    }
    if (selectedCategory !== "All") {
      list = list.filter(p => p.category === selectedCategory);
    }
    if (useCustomColor) {
      list = list.filter(p => p.colors.some(c => colorDistance(c, customColor) < 120));
    } else if (selectedColors.length > 0) {
      list = list.filter(p => p.colors.some(c => selectedColors.includes(c)));
    }
    if (selectedSizes.length > 0) {
      list = list.filter(p => p.sizes.some(s => selectedSizes.includes(s)));
    }
    list = list.filter(p => p.price >= priceMin && p.price <= priceMax);
    if (onSaleOnly) list = list.filter(p => p.onSale);

    switch (sortBy) {
      case "Price: Low to High": list.sort((a, b) => a.price - b.price); break;
      case "Price: High to Low": list.sort((a, b) => b.price - a.price); break;
      case "Newest": list = list.filter(p => p.isNew).concat(list.filter(p => !p.isNew)); break;
      case "Best Rating": list.sort((a, b) => b.rating - a.rating); break;
    }
    return list;
  }, [products, wishlistOnly, wishlistItems, selectedCategory, selectedColors, useCustomColor, customColor, selectedSizes, priceMin, priceMax, onSaleOnly, sortBy]);

  const activeFilterCount = (wishlistOnly ? 1 : 0) + (selectedCategory !== "All" ? 1 : 0) + (useCustomColor ? 1 : selectedColors.length) + selectedSizes.length + (onSaleOnly ? 1 : 0);

  function clearFilters() {
    setSelectedCategory("All");
    setSelectedColors([]);
    setUseCustomColor(false);
    setSelectedSizes([]);
    setPriceMin(0);
    setPriceMax(500);
    setOnSaleOnly(false);
    if (wishlistOnly) {
      history.pushState(null, "", "/shop");
    }
  }

  const SidebarContent = () => (
    <div className="space-y-8">
      {/* Categories */}
      <div>
        <h3 className="font-bold text-sm uppercase tracking-widest mb-4 text-gray-800">Categories</h3>
        <ul className="space-y-1">
          {CATEGORY_NAMES.map(cat => (
            <li key={cat}>
              <button
                onClick={() => setSelectedCategory(cat)}
                data-testid={`filter-category-${cat.toLowerCase()}`}
                className={`flex justify-between items-center w-full text-left py-2 px-3 text-sm transition-colors rounded ${selectedCategory === cat ? "bg-black text-white font-semibold" : "text-gray-600 hover:text-black hover:bg-gray-50"}`}
              >
                <span>{cat}</span>
                <span className={`text-xs ${selectedCategory === cat ? "text-gray-300" : "text-gray-400"}`}>
                  {cat === "All" ? products.length : products.filter((p: any) => p.category === cat).length}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Sale Toggle */}
      <div className="border-t border-gray-100 pt-6">
        <label className="flex items-center justify-between cursor-pointer">
          <span className="font-bold text-sm uppercase tracking-widest text-gray-800">On Sale Only</span>
          <div
            onClick={() => setOnSaleOnly(v => !v)}
            data-testid="toggle-sale"
            className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${onSaleOnly ? "bg-black" : "bg-gray-200"}`}
          >
            <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-transform ${onSaleOnly ? "translate-x-5" : "translate-x-0.5"}`} />
          </div>
        </label>
      </div>

      {/* Price Filter */}
      <div className="border-t border-gray-100 pt-6">
        <h3 className="font-bold text-sm uppercase tracking-widest mb-4 text-gray-800">Price Range</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Min ($)</label>
            <input
              type="number"
              value={priceMin}
              onChange={e => setPriceMin(Number(e.target.value))}
              data-testid="input-price-min"
              min={0}
              max={priceMax}
              className="w-full border border-gray-300 px-3 py-2 text-sm outline-none focus:border-black transition-colors"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Max ($)</label>
            <input
              type="number"
              value={priceMax}
              onChange={e => setPriceMax(Number(e.target.value))}
              data-testid="input-price-max"
              min={priceMin}
              max={1000}
              className="w-full border border-gray-300 px-3 py-2 text-sm outline-none focus:border-black transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Color Filter */}
      <div className="border-t border-gray-100 pt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-sm uppercase tracking-widest text-gray-800">Color</h3>
          {useCustomColor && (
            <button 
              onClick={() => setUseCustomColor(false)}
              className="text-[10px] text-gray-450 hover:text-black uppercase tracking-wider font-bold"
            >
              Reset Custom
            </button>
          )}
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          {COLORS.map(color => (
            <button
              key={color.name}
              onClick={() => {
                setUseCustomColor(false);
                toggleColor(color.code);
              }}
              data-testid={`filter-color-${color.name.toLowerCase()}`}
              title={color.name}
              className={`w-9 h-9 rounded-full border-2 transition-all ${!useCustomColor && selectedColors.includes(color.code) ? "border-black scale-110 shadow-md" : "border-gray-200 hover:border-gray-400"}`}
              style={{ backgroundColor: color.code }}
            />
          ))}

          {/* Custom Color Picker Button */}
          <div className="relative w-9 h-9">
            <button
              title="Choose Custom Color"
              onClick={() => {
                setSelectedColors([]);
                setUseCustomColor(true);
              }}
              className={`w-9 h-9 rounded-full border-2 transition-all overflow-hidden flex items-center justify-center ${useCustomColor ? "border-black scale-110 shadow-md" : "border-gray-200 hover:border-gray-400"}`}
              style={{ 
                background: "linear-gradient(45deg, #ff0055, #00ff55, #0055ff, #ffcc00)" 
              }}
            >
              <div 
                className="w-5 h-5 rounded-full border border-white"
                style={{ backgroundColor: useCustomColor ? customColor : "transparent" }}
              />
            </button>
            <input 
              type="color"
              value={customColor}
              onChange={(e) => {
                setSelectedColors([]);
                setCustomColor(e.target.value);
                setUseCustomColor(true);
              }}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
        </div>

        {useCustomColor && (
          <p className="text-[11px] text-gray-500 mt-2 font-medium">
            Filtering products close to custom color: <span className="font-bold text-black">{customColor}</span>
          </p>
        )}
      </div>

      {/* Size Filter */}
      <div className="border-t border-gray-100 pt-6">
        <h3 className="font-bold text-sm uppercase tracking-widest mb-4 text-gray-800">Size</h3>
        <div className="flex flex-wrap gap-2">
          {["XS", "S", "M", "L", "XL", "XXL"].map(size => (
            <button
              key={size}
              onClick={() => toggleSize(size)}
              data-testid={`filter-size-${size.toLowerCase()}`}
              className={`min-w-10 h-10 flex items-center justify-center text-xs font-semibold border transition-all ${selectedSizes.includes(size) ? "bg-black text-white border-black font-bold" : "bg-white text-gray-800 border-gray-200 hover:border-gray-400"}`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {activeFilterCount > 0 && (
        <button
          onClick={clearFilters}
          data-testid="button-clear-filters"
          className="w-full border border-gray-300 py-2.5 text-sm font-semibold uppercase tracking-wide hover:border-black transition-colors flex items-center justify-center gap-2"
        >
          <X size={14} /> Clear All Filters
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <AnnouncementBar />
      <Header />

      <main className="flex-1 bg-white">
        {/* Hero Banner */}
        <section className="relative h-[45vh] min-h-[280px] w-full overflow-hidden bg-black">
          <img
            src={ShopHeroImg}
            alt="Shop All"
            className="absolute inset-0 w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 tracking-tight">
              {wishlistOnly ? "My Favorites" : "Shop All"}
            </h1>
            <div className="flex items-center space-x-2 text-sm text-gray-300 font-semibold">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight size={14} />
              <span className="text-white">{wishlistOnly ? "Favorites" : "Shop"}</span>
            </div>
          </div>
        </section>

        {/* Category Circles */}
        <div className="border-b border-gray-100 py-8">
          <div className="container mx-auto px-4">
            <div className="flex overflow-x-auto pb-2 -mx-4 px-4 md:justify-center md:flex-wrap md:overflow-visible gap-4 md:gap-6 hide-scrollbar">
              {CATEGORIES.map((category) => (
                <div
                  key={category.name}
                  className="flex-shrink-0 scale-[0.8] origin-top -my-2 cursor-pointer"
                  onClick={() => handleCategoryClick(category.name)}
                >
                  <CategoryCircle name={category.name} image={category.image} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div ref={productsRef} className="container mx-auto px-4 py-10" id="products-section">
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <SidebarContent />
            </aside>

            {/* Mobile Sidebar Drawer */}
            <AnimatePresence>
              {sidebarOpen && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 z-[60] lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                  />
                  <motion.div
                    initial={{ x: "-100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "-100%" }}
                    transition={{ type: "tween", duration: 0.3 }}
                    className="fixed top-0 left-0 bottom-0 w-80 bg-white z-[70] overflow-y-auto lg:hidden"
                  >
                    <div className="flex items-center justify-between p-5 border-b border-gray-100">
                      <h2 className="font-bold text-sm uppercase tracking-widest">Filters</h2>
                      <button onClick={() => setSidebarOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                        <X size={18} />
                      </button>
                    </div>
                    <div className="p-5">
                      <SidebarContent />
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row justify-between items-center bg-[#FAF8F5] p-4 mb-8 gap-4">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <button
                    onClick={() => setSidebarOpen(true)}
                    data-testid="button-mobile-filter"
                    className="lg:hidden flex items-center gap-2 text-sm font-semibold border border-gray-300 px-4 py-2 hover:border-black transition-colors"
                  >
                    <Filter size={15} />
                    Filters
                    {activeFilterCount > 0 && (
                      <span className="bg-black text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">{activeFilterCount}</span>
                    )}
                  </button>
                  <span className="text-sm text-gray-500">
                    {filtered.length} {filtered.length === 1 ? "product" : "products"}
                  </span>
                  {activeFilterCount > 0 && (
                    <button onClick={clearFilters} className="hidden lg:flex items-center gap-1 text-xs text-gray-400 hover:text-black transition-colors">
                      <X size={12} /> Clear filters
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
                  {/* Sort */}
                  <div className="relative">
                    <button
                      onClick={() => setShowSort(v => !v)}
                      data-testid="button-sort"
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
                              data-testid={`sort-option-${opt.toLowerCase().replace(/\s/g, "-")}`}
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
                      data-testid="button-grid-view"
                      className={`p-1.5 transition-colors ${viewMode === "grid" ? "bg-black text-white" : "text-gray-400 hover:text-black"}`}
                    >
                      <Grid3X3 size={16} />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      data-testid="button-list-view"
                      className={`p-1.5 transition-colors ${viewMode === "list" ? "bg-black text-white" : "text-gray-400 hover:text-black"}`}
                    >
                      <List size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Active filter chips */}
              {activeFilterCount > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedCategory !== "All" && (
                    <span className="flex items-center gap-1.5 bg-black text-white text-xs px-3 py-1.5 rounded-full">
                      {selectedCategory}
                      <button onClick={() => setSelectedCategory("All")} className="hover:text-gray-300"><X size={11} /></button>
                    </span>
                  )}
                  {selectedColors.map(c => (
                    <span key={c} className="flex items-center gap-1.5 border border-gray-300 text-xs px-3 py-1.5 rounded-full">
                      <span className="w-3 h-3 rounded-full border border-gray-200" style={{ backgroundColor: c }} />
                      Color
                      <button onClick={() => toggleColor(c)} className="hover:text-red-500"><X size={11} /></button>
                    </span>
                  ))}
                  {onSaleOnly && (
                    <span className="flex items-center gap-1.5 bg-[#E63946] text-white text-xs px-3 py-1.5 rounded-full">
                      On Sale
                      <button onClick={() => setOnSaleOnly(false)} className="hover:text-red-200"><X size={11} /></button>
                    </span>
                  )}
                </div>
              )}

              {/* Product Grid */}
              {filtered.length === 0 ? (
                <div className="text-center py-24">
                  <p className="text-gray-500 mb-4">No products match your filters.</p>
                  <button onClick={clearFilters} className="bg-black text-white px-8 py-3 rounded-full text-sm font-bold uppercase tracking-wide hover:bg-gray-800 transition-colors">
                    Clear Filters
                  </button>
                </div>
              ) : viewMode === "grid" ? (
                <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
                  {filtered.map((product) => (
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
                  {filtered.map((product) => (
                    <Link key={product.id} href={`/shop/${product.id}`} data-testid={`list-item-${product.id}`}>
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
            </div>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
