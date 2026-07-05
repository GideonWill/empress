import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { TrustBanner } from "@/components/layout/TrustBanner";
import { ProductCard } from "@/components/ui/product-card";
import { CategoryCircle } from "@/components/ui/category-circle";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { PRODUCTS, CATEGORIES } from "@/data/products";

const FEATURED = PRODUCTS.slice(0, 4);
const NEW_ARRIVALS = PRODUCTS.filter(p => p.isNew);

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <AnnouncementBar />
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-[#FAF8F5] relative overflow-hidden">
          <div className="container mx-auto px-4 h-[600px] md:h-[700px] lg:h-[800px] flex flex-col md:flex-row items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex-1 z-10 pt-16 md:pt-0 pb-8 md:pb-0 md:pr-12 lg:pr-24"
            >
              <div className="inline-block border border-black px-4 py-1 mb-6 text-xs font-bold tracking-widest uppercase">
                Since 2010
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-[74px] leading-[1.05] font-bold text-[#111111] mb-6 tracking-tight">
                Timeless<br />Appeal
              </h1>
              <p className="text-base md:text-lg text-gray-500 mb-10 max-w-sm leading-relaxed">
                Enjoy savings of up to 60% all month long on selected premium styles.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/shop"
                  data-testid="button-explore-now"
                  className="inline-flex items-center gap-2 bg-[#111111] text-white px-8 py-4 rounded-full font-bold uppercase tracking-wide hover:bg-gray-800 transition-colors text-sm"
                >
                  Explore Now <ArrowRight size={16} />
                </Link>
                <Link
                  href="/shop"
                  data-testid="button-view-sale"
                  className="inline-flex items-center gap-2 border-2 border-black text-black px-8 py-4 rounded-full font-bold uppercase tracking-wide hover:bg-black hover:text-white transition-colors text-sm"
                >
                  View Sale
                </Link>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="flex-1 h-full w-full relative"
            >
              <div className="absolute inset-0 md:-right-10 lg:-right-20 pt-8 md:pt-0">
                <img
                  src="/images/slipper3.jpeg"
                  alt="Fashion Model"
                  className="w-full h-full object-cover object-top md:object-center"
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
                  price={`$${product.price.toFixed(2)}`}
                  originalPrice={product.originalPrice ? `$${product.originalPrice.toFixed(2)}` : undefined}
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

        {/* Banner / Promo */}
        <section className="py-0">
          <div className="relative bg-[#111111] overflow-hidden">
            <div className="container mx-auto px-4 py-20 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-white text-center md:text-left max-w-lg">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Limited Time</p>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4">
                  Up to 60% Off<br />This Season
                </h2>
                <p className="text-gray-400 mb-8 text-sm leading-relaxed">
                  Shop our curated sale collection — premium pieces at extraordinary prices. Ends soon.
                </p>
                <Link
                  href="/shop"
                  data-testid="button-shop-sale"
                  className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-full font-bold uppercase tracking-wide hover:bg-gray-200 transition-colors text-sm"
                >
                  Shop the Sale <ArrowRight size={16} />
                </Link>
              </div>
              <div className="w-full md:w-80 lg:w-96 aspect-[3/4] bg-gray-800 overflow-hidden flex-shrink-0">
                <img
                  src="/images/slipper4.jpeg"
                  alt="Sale Collection"
                  className="w-full h-full object-cover opacity-80"
                />
              </div>
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
                    price={`$${product.price.toFixed(2)}`}
                    originalPrice={product.originalPrice ? `$${product.originalPrice.toFixed(2)}` : undefined}
                    image={product.image}
                    onSale={product.onSale}
                    isNew={product.isNew}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        <TrustBanner />
      </main>

      <Footer />
    </div>
  );
}
