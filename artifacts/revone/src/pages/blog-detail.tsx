import { Link, useParams } from "wouter";
import { ChevronRight, Clock, User, ArrowLeft, Star, ShoppingBag } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BLOG_POSTS } from "@/data/products";
import { formatPrice } from "@/lib/currency";
import { useProductStore } from "@/context/ProductStore";

export default function BlogDetail() {
  const { id } = useParams();
  const post = BLOG_POSTS.find((p) => p.id === id);
  const { getProduct } = useProductStore();

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col font-sans bg-white">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center py-20 px-4">
          <h2 className="text-2xl font-bold mb-4">Article Not Found</h2>
          <p className="text-gray-500 mb-6">The article you are looking for does not exist.</p>
          <Link href="/blogs" className="bg-black text-white px-6 py-3 rounded-full font-bold text-sm uppercase tracking-wide hover:bg-gray-800 transition-colors">
            Back to Journal
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  // Find the related product
  const product = getProduct((post as any).relatedProductId || "");

  // Use product image for the hero if available, otherwise fallback to post image
  const heroImage = product ? product.image : post.image;

  return (
    <div className="min-h-screen flex flex-col font-sans bg-white">
      <Header />

      <main className="flex-1 bg-white">
        {/* Full-width Hero Banner at the top */}
        <section className="relative h-[65vh] min-h-[400px] w-full overflow-hidden bg-black">
          <img
            src={heroImage}
            alt={post.title}
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          
          <div className="absolute inset-0 flex flex-col justify-end">
            <div className="container mx-auto px-4 md:px-6 pb-12 max-w-6xl text-white space-y-4">
              {/* Category & Read Time */}
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-extrabold bg-white text-black px-3 py-1 uppercase tracking-widest rounded-sm">
                  {post.category}
                </span>
                <span className="text-xs text-gray-300 font-bold flex items-center gap-1">
                  <Clock size={12} /> {post.readTime}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-5xl font-extrabold leading-tight tracking-tight max-w-3xl">
                {post.title}
              </h1>

              {/* Author & Date */}
              <div className="flex items-center gap-4 text-xs md:text-sm text-gray-300 font-semibold">
                <span className="flex items-center gap-1.5"><User size={14} className="text-gray-400" /> {post.author}</span>
                <span className="text-gray-500">|</span>
                <span>{post.date}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Content & Product Showcase Layout */}
        <div className="container mx-auto max-w-6xl px-4 py-16">
          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Left Column: Article Body */}
            <div className="flex-1 prose prose-gray">
              <div className="mb-8">
                <Link href="/blogs" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-gray-400 hover:text-black transition-colors">
                  <ArrowLeft size={14} /> Back to Journal
                </Link>
              </div>

              <div className="space-y-6">
                {post.content.map((paragraph, index) => (
                  <p key={index} className="text-gray-700 text-base md:text-lg leading-relaxed font-medium">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Right Column: Featured Product Showcase Callout */}
            {product && (
              <aside className="w-full lg:w-96 flex-shrink-0">
                <div className="sticky top-28 bg-[#FAF8F5] border border-gray-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
                  <div>
                    <span className="inline-block bg-black text-white text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-sm mb-3">
                      Featured Product
                    </span>
                    <h3 className="text-xl font-extrabold text-gray-900 leading-tight">
                      {product.name}
                    </h3>
                    <p className="text-lg font-bold text-gray-900 mt-1">{formatPrice(product.price)}</p>
                  </div>

                  {/* Product Mini Image */}
                  <div className="aspect-[4/3] w-full bg-white rounded-2xl overflow-hidden shadow-inner border border-gray-100/55">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} fill="currentColor" className="text-amber-400" />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-gray-500">({product.reviewCount} reviews)</span>
                  </div>

                  {/* Short Description */}
                  <p className="text-xs text-gray-500 leading-relaxed font-medium">
                    {product.description}
                  </p>

                  {/* Action Link */}
                  <Link
                    href={`/shop/${product.id}`}
                    className="flex items-center justify-center gap-2 w-full bg-black text-white py-3.5 rounded-full font-bold text-sm uppercase tracking-wide hover:bg-gray-800 transition-colors shadow-md shadow-black/10"
                  >
                    <ShoppingBag size={15} /> Shop This Product
                  </Link>
                </div>
              </aside>
            )}

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
