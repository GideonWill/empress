import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { TrustBanner } from "@/components/layout/TrustBanner";
import { ProductCard } from "@/components/ui/product-card";
import { CategoryCircle } from "@/components/ui/category-circle";
import { Link } from "wouter";

const CATEGORIES = [
  { name: "Women", image: "/images/category-women.png" },
  { name: "New Arrival", image: "/images/category-new.png" },
  { name: "Men", image: "/images/category-men.png" },
  { name: "Footwear", image: "/images/category-footwear.png" },
  { name: "Kids", image: "/images/category-kids.png" },
  { name: "Deal Zone", image: "/images/category-deal.png" },
  { name: "Accessories", image: "/images/category-accessories.png" },
];

const PRODUCTS = [
  { id: "1", name: "Elegant Black Dress", price: "$120.00", image: "/images/product-1.png" },
  { id: "2", name: "Classic White Button Down", price: "$65.00", image: "/images/product-2.png" },
  { id: "3", name: "Classic Leather Jacket", price: "$195.00", originalPrice: "$250.00", image: "/images/product-1.png", onSale: true },
  { id: "4", name: "Premium Denim Jeans", price: "$85.00", image: "/images/product-2.png" },
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <AnnouncementBar />
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-[#FAF8F5] relative overflow-hidden">
          <div className="container mx-auto px-4 h-[600px] md:h-[700px] lg:h-[800px] flex flex-col md:flex-row items-center">
            <div className="flex-1 z-10 pt-16 md:pt-0 pb-8 md:pb-0 md:pr-12 lg:pr-24">
              <div className="inline-block border border-black px-4 py-1 mb-6 text-xs font-bold tracking-widest uppercase">
                Since 2010
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-[74px] leading-[1.1] font-bold text-[#111111] mb-6 tracking-tight">
                Timeless<br />Appeal
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-md leading-relaxed">
                Enjoy savings of up to 60% all month long on selected premium styles.
              </p>
              <Link href="/shop" className="inline-block bg-[#111111] text-white px-10 py-4 rounded-full font-bold uppercase tracking-wide hover:bg-gray-800 transition-colors">
                Explore Now
              </Link>
            </div>
            <div className="flex-1 h-full w-full relative">
              <div className="absolute inset-0 md:-right-10 lg:-right-20 pt-8 md:pt-0">
                <img 
                  src="/images/hero-model.png" 
                  alt="Fashion Model" 
                  className="w-full h-full object-cover object-top md:object-center"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Shop by Categories</h2>
              <p className="text-gray-500">Explore our wide range of premium fashion categories</p>
            </div>
            
            <div className="flex overflow-x-auto pb-8 -mx-4 px-4 md:justify-center md:flex-wrap md:overflow-visible gap-6 md:gap-8 hide-scrollbar">
              {CATEGORIES.map((category) => (
                <div key={category.name} className="flex-shrink-0">
                  <CategoryCircle name={category.name} image={category.image} />
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
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Products</h2>
                <p className="text-gray-500">Discover our most loved pieces this season</p>
              </div>
              <Link href="/shop" className="hidden md:inline-block border-b-2 border-black pb-1 font-bold text-sm uppercase tracking-wide hover:text-gray-600 hover:border-gray-600 transition-colors">
                View All
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {PRODUCTS.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
            
            <div className="mt-10 text-center md:hidden">
              <Link href="/shop" className="inline-block border border-black px-8 py-3 rounded-full font-bold text-sm uppercase tracking-wide hover:bg-black hover:text-white transition-colors">
                View All Products
              </Link>
            </div>
          </div>
        </section>

        <TrustBanner />
      </main>
      
      <Footer />
    </div>
  );
}
