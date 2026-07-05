import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/ui/product-card";
import { CategoryCircle } from "@/components/ui/category-circle";
import { Link } from "wouter";
import { ChevronRight, Grid3X3, List, ChevronDown, Filter } from "lucide-react";

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
  { id: "5", name: "Minimalist Sweater", price: "$90.00", image: "/images/product-1.png" },
  { id: "6", name: "Cotton Basic Tee", price: "$35.00", image: "/images/product-2.png" },
  { id: "7", name: "Summer Midi Dress", price: "$110.00", image: "/images/product-1.png" },
  { id: "8", name: "Tailored Trousers", price: "$140.00", originalPrice: "$180.00", image: "/images/product-2.png", onSale: true },
  { id: "9", name: "Knitted Cardigan", price: "$130.00", image: "/images/product-1.png" },
];

const SIDEBAR_CATEGORIES = [
  { name: "Accessories", count: 12 },
  { name: "Dresses", count: 34 },
  { name: "Footwear", count: 28 },
  { name: "Jackets", count: 15 },
  { name: "Pants", count: 42 },
  { name: "Shirts", count: 56 },
];

const COLORS = [
  { name: "Black", code: "#000000" },
  { name: "White", code: "#FFFFFF" },
  { name: "Red", code: "#E63946" },
  { name: "Blue", code: "#1D3557" },
  { name: "Beige", code: "#F5F5DC" },
  { name: "Grey", code: "#808080" },
];

export default function Shop() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <AnnouncementBar />
      <Header />
      
      <main className="flex-1 bg-white">
        {/* Page Header */}
        <div className="bg-[#FAF8F5] py-16 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Shop</h1>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <Link href="/" className="hover:text-black">Home</Link>
              <ChevronRight size={14} />
              <span className="text-black">Shop</span>
            </div>
          </div>
        </div>

        {/* Categories Row */}
        <div className="border-b border-gray-100 py-8">
          <div className="container mx-auto px-4">
            <div className="flex overflow-x-auto pb-4 -mx-4 px-4 md:justify-center md:flex-wrap md:overflow-visible gap-6 hide-scrollbar">
              {CATEGORIES.map((category) => (
                <div key={category.name} className="flex-shrink-0 scale-75 origin-top">
                  <CategoryCircle name={category.name} image={category.image} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Sidebar */}
            <aside className="w-full lg:w-1/4 space-y-10">
              {/* Categories */}
              <div>
                <h3 className="font-bold text-lg mb-4">Categories</h3>
                <ul className="space-y-3">
                  {SIDEBAR_CATEGORIES.map(cat => (
                    <li key={cat.name}>
                      <button className="flex justify-between items-center w-full text-left text-gray-600 hover:text-black group">
                        <span className="group-hover:translate-x-1 transition-transform">{cat.name}</span>
                        <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-full">{cat.count}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price Filter */}
              <div>
                <h3 className="font-bold text-lg mb-4">Price</h3>
                <div className="space-y-4">
                  <div className="h-1 bg-gray-200 rounded-full relative">
                    <div className="absolute left-[20%] right-[30%] h-full bg-black rounded-full"></div>
                    <div className="absolute left-[20%] top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-white border-2 border-black rounded-full cursor-pointer"></div>
                    <div className="absolute right-[30%] top-1/2 -translate-y-1/2 translate-x-1/2 w-4 h-4 bg-white border-2 border-black rounded-full cursor-pointer"></div>
                  </div>
                  <div className="flex items-center justify-between gap-4 pt-2">
                    <div className="flex-1">
                      <span className="text-xs text-gray-500 mb-1 block">Min</span>
                      <div className="border border-gray-300 rounded px-3 py-2 flex items-center">
                        <span className="text-gray-500 mr-1">$</span>
                        <input type="text" defaultValue="20" className="w-full outline-none text-sm" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <span className="text-xs text-gray-500 mb-1 block">Max</span>
                      <div className="border border-gray-300 rounded px-3 py-2 flex items-center">
                        <span className="text-gray-500 mr-1">$</span>
                        <input type="text" defaultValue="500" className="w-full outline-none text-sm" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Color Filter */}
              <div>
                <h3 className="font-bold text-lg mb-4">Color</h3>
                <div className="flex flex-wrap gap-3">
                  {COLORS.map(color => (
                    <button 
                      key={color.name}
                      className="w-8 h-8 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                      style={{ backgroundColor: color.code }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <div className="w-full lg:w-3/4">
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row justify-between items-center bg-gray-50 p-4 rounded-lg mb-8 gap-4">
                <div className="flex items-center space-x-4 w-full sm:w-auto justify-between sm:justify-start">
                  <button className="lg:hidden flex items-center gap-2 text-sm font-medium">
                    <Filter size={16} /> Filter
                  </button>
                  <span className="text-sm text-gray-600">Showing 1-9 of 144 items</span>
                </div>
                
                <div className="flex items-center space-x-6 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Sort by:</span>
                    <button className="flex items-center space-x-1 text-sm font-medium">
                      <span>Featured</span>
                      <ChevronDown size={16} />
                    </button>
                  </div>
                  
                  <div className="hidden sm:flex items-center space-x-2 border-l pl-6 border-gray-300">
                    <button className="text-black"><Grid3X3 size={20} /></button>
                    <button className="text-gray-400 hover:text-black"><List size={20} /></button>
                  </div>
                </div>
              </div>

              {/* Product Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                {PRODUCTS.map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))}
              </div>
              
              {/* Pagination */}
              <div className="mt-16 flex justify-center">
                <div className="flex items-center space-x-2">
                  <button className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded hover:border-black hover:bg-black hover:text-white transition-colors">1</button>
                  <button className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded hover:border-black hover:bg-black hover:text-white transition-colors bg-black text-white border-black">2</button>
                  <button className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded hover:border-black hover:bg-black hover:text-white transition-colors">3</button>
                  <span className="px-2">...</span>
                  <button className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded hover:border-black hover:bg-black hover:text-white transition-colors">
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
