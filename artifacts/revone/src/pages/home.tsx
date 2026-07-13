import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { TrustBanner } from "@/components/layout/TrustBanner";
import { ProductCard } from "@/components/ui/product-card";
import { CategoryCircle } from "@/components/ui/category-circle";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { formatPrice } from "@/lib/currency";
import { CATEGORIES } from "@/data/products";
import { useProductStore } from "@/context/ProductStore";
import OutfitImg from "@assets/outfit.jpeg";
import W1Img from "@assets/w1.jpeg";

export default function Home() {
  const { products } = useProductStore();
  const FEATURED = products.slice(0, 4);
  const NEW_ARRIVALS = products.filter(p => p.isNew);
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <AnnouncementBar />
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-[#FAF8F5] relative overflow-hidden">
          <div className="container mx-auto px-4 min-h-[500px] md:h-[700px] lg:h-[800px] flex flex-col md:flex-row items-center relative py-12 md:py-0">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex-1 z-10 pt-8 md:pt-0 pb-8 md:pb-0 md:pr-12 lg:pr-24 flex flex-col items-center md:items-start text-center md:text-left"
            >
              <div className="inline-block border border-black px-4 py-1 mb-6 text-xs font-bold tracking-widest uppercase bg-white/85 md:bg-transparent">
                EMPRESS DEALS
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-[74px] leading-[1.05] font-bold text-[#111111] mb-6 tracking-tight">
                Luxury<br />Redefined
              </h1>
              <p className="text-base md:text-lg text-gray-500 mb-10 max-w-sm leading-relaxed mx-auto md:mx-0">
                Premium clothing, luxury shoes, and HD lace frontal wigs.
              </p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <Link
                  href="/shop"
                  data-testid="button-explore-now"
                  className="inline-flex items-center gap-2 bg-[#111111] text-white px-8 py-4 rounded-full font-bold uppercase tracking-wide hover:bg-gray-800 transition-colors text-sm shadow-md"
                >
                  Explore Now <ArrowRight size={16} />
                </Link>
                <Link
                  href="/shop"
                  data-testid="button-view-sale"
                  className="inline-flex items-center gap-2 border-2 border-black text-black px-8 py-4 rounded-full font-bold uppercase tracking-wide hover:bg-black hover:text-white transition-colors text-sm bg-white md:bg-transparent"
                >
                  View Sale
                </Link>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="absolute inset-0 md:relative md:flex-1 h-full w-full z-0 md:z-10"
            >
              <div className="absolute inset-0 md:-right-10 lg:-right-20">
                <img
                  src="/images/hero-image.jpg"
                  alt="Fashion Model"
                  className="w-full h-full object-cover object-center opacity-25 md:opacity-100"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-3">Shop by Categories</h2>
              <p className="text-gray-500 text-sm">Explore the Newest Trends for both Men and Women!</p>
            </div>
            <div className="flex overflow-x-auto pb-4 -mx-4 px-4 md:justify-center md:flex-wrap md:overflow-visible gap-6 md:gap-10 hide-scrollbar">
              {CATEGORIES.map((category) => (
                <div key={category.name} className="flex-shrink-0">
                  <CategoryCircle name={category.name} image={category.image} href={category.href} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-20 bg-white border-t border-gray-100">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-end mb-12">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Handpicked</p>
                <h2 className="text-3xl md:text-4xl font-bold">Featured Products</h2>
              </div>
              <Link
                href="/shop"
                data-testid="link-view-all"
                className="hidden md:inline-flex items-center gap-2 border-b-2 border-black pb-1 font-bold text-sm uppercase tracking-wide hover:text-gray-600 hover:border-gray-600 transition-colors"
              >
                View All <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {FEATURED.map((product) => (
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
            <div className="mt-10 text-center md:hidden">
              <Link
                href="/shop"
                className="inline-block border border-black px-8 py-3 rounded-full font-bold text-sm uppercase tracking-wide hover:bg-black hover:text-white transition-colors"
              >
                View All Products
              </Link>
            </div>
          </div>
        </section>

        {/* Special Collection Banner featuring outfit 3 */}
        <section className="py-0 bg-white">
          <div className="relative overflow-hidden bg-gray-50 flex flex-col md:flex-row items-center border-t border-b border-gray-100">
            <div className="w-full md:w-1/2 aspect-video md:aspect-auto md:h-[450px] overflow-hidden">
              <img
                src={W1Img}
                alt="Empress Collections"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-8 md:p-16 flex-1 text-left space-y-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 bg-amber-500/10 px-2.5 py-1 rounded">
                Seasonal Spotlight
              </span>
              <h3 className="text-2xl md:text-3xl font-extrabold text-black leading-tight">
                The Silhouette Statement
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed max-w-md">
                Indulge in modern luxury with pieces designed to turn heads. Hand-curated silhouettes, premium styling, and signature craftsmanship.
              </p>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 border-b-2 border-black pb-0.5 font-bold text-xs uppercase tracking-widest text-black hover:text-gray-600 transition-colors"
              >
                View Collection <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </section>

        {/* New Arrivals */}
        {NEW_ARRIVALS.length > 0 && (
          <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
              <div className="flex justify-between items-end mb-12">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Just Landed</p>
                  <h2 className="text-3xl md:text-4xl font-bold">New Arrivals</h2>
                </div>
                <Link
                  href="/shop"
                  className="hidden md:inline-flex items-center gap-2 border-b-2 border-black pb-1 font-bold text-sm uppercase tracking-wide hover:text-gray-600 hover:border-gray-600 transition-colors"
                >
                  View All <ArrowRight size={14} />
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
                {NEW_ARRIVALS.map((product) => (
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
            </div>
          </section>
        )}

        
      </main>

      <Footer />
    </div>
  );
}
