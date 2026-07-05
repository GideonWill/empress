import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { TrustBanner } from "@/components/layout/TrustBanner";
import { Link } from "wouter";
import { ChevronRight, FileText } from "lucide-react";

export default function Blogs() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <AnnouncementBar />
      <Header />
      
      <main className="flex-1 bg-white">
        {/* Page Header */}
        <div className="bg-[#FAF8F5] py-16 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">News</h1>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <Link href="/" className="hover:text-black">Home</Link>
              <ChevronRight size={14} />
              <span className="text-black">News</span>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-24">
          <div className="max-w-2xl mx-auto text-center py-16 px-4 bg-gray-50 rounded-2xl border border-gray-100">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold mb-4">No articles found</h2>
            <p className="text-gray-500 mb-8">
              We're currently working on creating exciting content for you. Please check back later.
            </p>
            <Link href="/shop" className="inline-block bg-[#111111] text-white px-8 py-3 rounded-full font-bold text-sm uppercase tracking-wide hover:bg-gray-800 transition-colors">
              Continue Shopping
            </Link>
          </div>
        </div>

        <TrustBanner />
      </main>
      
      <Footer />
    </div>
  );
}
