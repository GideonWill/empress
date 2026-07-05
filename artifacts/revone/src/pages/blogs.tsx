import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ChevronRight, Clock, User, Tag, ArrowRight } from "lucide-react";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { TrustBanner } from "@/components/layout/TrustBanner";
import { BLOG_POSTS } from "@/data/products";

const BLOG_CATEGORIES = ["All", "Style Guide", "Trends", "Sustainability", "Occasions", "Buyer's Guide"];

export default function Blogs() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = activeCategory === "All"
    ? BLOG_POSTS
    : BLOG_POSTS.filter(p => p.category === activeCategory);

  const [featured, ...rest] = filtered;

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <AnnouncementBar />
      <Header />

      <main className="flex-1 bg-white">
        {/* Page Header */}
        <div className="bg-[#FAF8F5] py-16 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">The Journal</h1>
            <p className="text-gray-500 max-w-md mx-auto text-sm leading-relaxed mb-4">
              Style stories, buying guides, and fashion insights from the Revone team.
            </p>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <Link href="/" className="hover:text-black transition-colors">Home</Link>
              <ChevronRight size={14} />
              <span className="text-black">Blogs</span>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="border-b border-gray-100 bg-white sticky top-20 z-30">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-2 overflow-x-auto py-4 hide-scrollbar">
              {BLOG_CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  data-testid={`filter-${cat.toLowerCase().replace(/\s/g, "-")}`}
                  className={`flex-shrink-0 px-5 py-2 text-xs font-bold uppercase tracking-wide rounded-full transition-colors ${
                    activeCategory === cat
                      ? "bg-black text-white"
                      : "text-gray-600 hover:text-black border border-gray-200 hover:border-black"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-14">
          {filtered.length === 0 ? (
            <p className="text-center text-gray-500 py-24">No articles in this category yet.</p>
          ) : (
            <>
              {/* Featured Post */}
              {featured && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16 pb-16 border-b border-gray-100"
                >
                  <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
                    <img
                      src={featured.image}
                      alt={featured.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-[10px] font-bold bg-black text-white px-3 py-1 uppercase tracking-widest">{featured.category}</span>
                      <span className="text-xs text-gray-400 flex items-center gap-1"><Clock size={12} /> {featured.readTime}</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl xl:text-4xl font-bold leading-tight mb-4">
                      {featured.title}
                    </h2>
                    <p className="text-gray-500 leading-relaxed mb-6">{featured.excerpt}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-400 mb-8">
                      <span className="flex items-center gap-1.5"><User size={13} /> {featured.author}</span>
                      <span>{featured.date}</span>
                    </div>
                    <Link
                      href={`/blogs/${featured.id}`}
                      data-testid={`link-read-more-${featured.id}`}
                      className="inline-flex items-center gap-2 bg-black text-white px-8 py-3.5 rounded-full font-bold text-sm uppercase tracking-wide hover:bg-gray-800 transition-colors w-fit"
                    >
                      Read Article <ArrowRight size={16} />
                    </Link>
                  </div>
                </motion.div>
              )}

              {/* Rest of articles */}
              {rest.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                  {rest.map((post, i) => (
                    <motion.article
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="group flex flex-col"
                      data-testid={`article-${post.id}`}
                    >
                      <div className="aspect-[16/10] bg-gray-100 overflow-hidden mb-5">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      </div>
                      <div className="flex items-center gap-3 mb-3">
                        <span className="flex items-center gap-1 text-xs text-gray-500">
                          <Tag size={11} /> {post.category}
                        </span>
                        <span className="text-xs text-gray-400">·</span>
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                          <Clock size={11} /> {post.readTime}
                        </span>
                      </div>
                      <h3 className="font-bold text-base md:text-lg leading-snug mb-3 group-hover:text-gray-600 transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-sm text-gray-500 leading-relaxed mb-4 flex-1 line-clamp-3">{post.excerpt}</p>
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <User size={12} />
                          <span>{post.author}</span>
                          <span className="text-gray-300">·</span>
                          <span>{post.date}</span>
                        </div>
                        <Link
                          href={`/blogs/${post.id}`}
                          data-testid={`link-read-more-${post.id}`}
                          className="text-xs font-bold uppercase tracking-wide flex items-center gap-1 hover:gap-2 transition-all"
                        >
                          Read <ArrowRight size={12} />
                        </Link>
                      </div>
                    </motion.article>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Newsletter CTA */}
        <section className="bg-[#111111] text-white py-20 px-4">
          <div className="container mx-auto max-w-xl text-center">
            <h2 className="text-3xl font-bold mb-3">Stay in the loop</h2>
            <p className="text-gray-400 mb-8 text-sm">Get new articles, style tips, and exclusive offers delivered to your inbox.</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Your email address"
                data-testid="input-newsletter-email"
                className="flex-1 bg-transparent border border-gray-600 px-5 py-3.5 text-sm outline-none focus:border-white transition-colors text-white placeholder-gray-500"
              />
              <button
                data-testid="button-newsletter-subscribe"
                className="bg-white text-black font-bold px-8 py-3.5 text-sm uppercase tracking-wide hover:bg-gray-200 transition-colors"
              >
                Subscribe
              </button>
            </div>
            <p className="text-xs text-gray-600 mt-4">No spam. Unsubscribe anytime.</p>
          </div>
        </section>

        <TrustBanner />
      </main>

      <Footer />
    </div>
  );
}
