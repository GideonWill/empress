import { useState } from "react";
import { useParams, Link } from "wouter";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, ChevronRight, Star, Plus, Minus, ArrowLeft, Share2 } from "lucide-react";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { TrustBanner } from "@/components/layout/TrustBanner";
import { ProductCard } from "@/components/ui/product-card";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useToast } from "@/hooks/use-toast";
import { formatPrice } from "@/lib/currency";
import { useProductStore } from "@/context/ProductStore";

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const { getProduct, products } = useProductStore();
  const product = getProduct(id || "");
  const { addItem } = useCart();
  const { toggle, isWishlisted } = useWishlist();
  const { toast } = useToast();
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  const related = products.filter(p => p.id !== id && p.category === product?.category).slice(0, 4);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <AnnouncementBar />
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center py-32 px-4">
          <h1 className="text-3xl font-bold mb-4">Product not found</h1>
          <p className="text-gray-500 mb-8">This product doesn't exist or has been removed.</p>
          <Link href="/shop" className="bg-black text-white px-8 py-3 rounded-full font-bold text-sm uppercase tracking-wide hover:bg-gray-800 transition-colors">
            Back to Shop
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  function handleAddToCart() {
    if (!product) return;
    if (product.stock === 0) {
      toast({ title: "Product is out of stock", variant: "destructive" });
      return;
    }
    if (!selectedSize) {
      toast({ title: "Please select a size", variant: "destructive" });
      return;
    }
    if (product.stock !== undefined && quantity > product.stock) {
      toast({ title: `Only ${product.stock} items left in stock`, variant: "destructive" });
      return;
    }
    const color = selectedColor || product.colors[0];
    addItem(product, selectedSize, color, quantity);
    toast({
      title: "Added to cart",
      description: `${product.name} (${selectedSize}) × ${quantity}`,
    });
  }

  const wishlisted = isWishlisted(product?.id ?? "");

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <AnnouncementBar />
      <Header />

      <main className="flex-1 bg-white">
        {/* Breadcrumb */}
        <div className="border-b border-gray-100 py-4">
          <div className="container mx-auto px-4">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Link href="/" className="hover:text-black transition-colors">Home</Link>
              <ChevronRight size={14} />
              <Link href="/shop" className="hover:text-black transition-colors">Shop</Link>
              <ChevronRight size={14} />
              <span className="text-black truncate max-w-xs">{product.name}</span>
            </div>
          </div>
        </div>

        {/* Product Detail */}
        <section className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">
            {/* Images */}
            <div className="space-y-4">
              <motion.div
                key={activeImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="aspect-[3/4] bg-gray-50 overflow-hidden rounded-none"
              >
                <img
                  src={product.images[activeImage] || product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </motion.div>
              <div className="flex gap-3 overflow-x-auto">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    data-testid={`thumbnail-${i}`}
                    className={`w-20 h-24 flex-shrink-0 overflow-hidden border-2 transition-colors ${activeImage === i ? "border-black" : "border-transparent"}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Info */}
            <div className="flex flex-col gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-semibold uppercase tracking-widest text-gray-500">{product.category}</span>
                  {product.isNew && <span className="text-xs font-bold bg-black text-white px-2 py-0.5 uppercase tracking-wide">New</span>}
                  {product.onSale && <span className="text-xs font-bold bg-[#E63946] text-white px-2 py-0.5 uppercase tracking-wide">Sale</span>}
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-black leading-tight mb-4">{product.name}</h1>

                {/* Rating */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} size={14} className={s <= Math.round(product.rating) ? "fill-black text-black" : "text-gray-300"} />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">{product.rating} ({product.reviewCount} reviews)</span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-bold text-black">{formatPrice(product.price)}</span>
                  {product.originalPrice && (
                    <span className="text-lg text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
                  )}
                  {product.originalPrice && (
                    <span className="text-sm font-bold text-[#E63946]">
                      {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                    </span>
                  )}
                </div>

                {/* Stock status notice */}
                {product.stock !== undefined && (
                  <div className="mt-4">
                    {product.stock === 0 ? (
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-red-50 border border-red-150 text-[11px] font-bold tracking-wide uppercase text-red-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span>
                        Out of Stock
                      </div>
                    ) : product.stock <= 5 ? (
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-amber-50 border border-amber-150 text-[11px] font-bold tracking-wide uppercase text-amber-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>
                        Only {product.stock} left in stock - order soon!
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-emerald-50 border border-emerald-150 text-[11px] font-bold tracking-wide uppercase text-emerald-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        In Stock ({product.stock} available)
                      </div>
                    )}
                  </div>
                )}
              </div>

              <p className="text-gray-600 leading-relaxed">{product.description}</p>

              {/* Color */}
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide mb-3">
                  Color: <span className="font-normal normal-case text-gray-500">{selectedColor || "Select color"}</span>
                </p>
                <div className="flex gap-3 flex-wrap">
                  {product.colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      data-testid={`color-${color}`}
                      title={color}
                      className={`w-9 h-9 rounded-full border-2 transition-all ${selectedColor === color ? "border-black scale-110 shadow-md" : "border-gray-200 hover:border-gray-400"}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              {/* Size */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold uppercase tracking-wide">
                    Size: <span className="font-normal normal-case text-gray-500">{selectedSize || "Select size"}</span>
                  </p>
                  <button className="text-xs text-gray-500 underline hover:text-black">Size Guide</button>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      data-testid={`size-${size}`}
                      className={`min-w-[44px] h-11 px-3 border text-sm font-medium transition-all ${selectedSize === size ? "bg-black text-white border-black" : "bg-white text-black border-gray-300 hover:border-black"}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity + Add to Cart */}
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-300">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    disabled={product.stock === 0}
                    data-testid="qty-minus"
                    className="w-11 h-11 flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-50"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-12 text-center font-semibold text-sm" data-testid="qty-value">{product.stock === 0 ? 0 : quantity}</span>
                  <button
                    onClick={() => setQuantity(q => product.stock !== undefined ? Math.min(product.stock, q + 1) : q + 1)}
                    disabled={product.stock === 0 || (product.stock !== undefined && quantity >= product.stock)}
                    data-testid="qty-plus"
                    className="w-11 h-11 flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-50"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <motion.button
                  whileTap={product.stock === 0 ? undefined : { scale: 0.97 }}
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  data-testid="button-add-to-cart"
                  className={`flex-1 h-11 rounded-full font-bold text-sm uppercase tracking-wide flex items-center justify-center gap-2 transition-colors ${
                    product.stock === 0 
                      ? "bg-gray-150 text-gray-400 cursor-not-allowed border border-gray-200" 
                      : "bg-black text-white hover:bg-gray-800"
                  }`}
                >
                  <ShoppingBag size={18} />
                  {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                </motion.button>

                <button
                  onClick={() => toggle(product)}
                  data-testid="button-wishlist"
                  className="w-11 h-11 border border-gray-300 rounded-full flex items-center justify-center hover:border-black transition-colors"
                >
                  <Heart size={18} className={wishlisted ? "fill-[#E63946] text-[#E63946]" : ""} />
                </button>
              </div>

              <Link
                href="/cart"
                onClick={handleAddToCart}
                data-testid="button-buy-now"
                className="w-full border-2 border-black text-black h-11 rounded-full font-bold text-sm uppercase tracking-wide flex items-center justify-center gap-2 hover:bg-black hover:text-white transition-colors"
              >
                Buy Now
              </Link>

              {/* Details */}
              <div className="border-t border-gray-100 pt-6">
                <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide">Product Details</h3>
                <ul className="space-y-2">
                  {product.details.map((d, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="w-1 h-1 rounded-full bg-black mt-2 flex-shrink-0" />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Share */}
              <div className="flex items-center gap-3 text-sm text-gray-500 pt-2">
                <Share2 size={16} />
                <span>Share this product</span>
              </div>
            </div>
          </div>
        </section>

        {/* Related Products */}
        {related.length > 0 && (
          <section className="container mx-auto px-4 py-16 border-t border-gray-100">
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-2">You May Also Like</h2>
                <p className="text-gray-500 text-sm">More pieces from {product.category}</p>
              </div>
              <Link href="/shop" className="hidden md:inline-flex items-center gap-1 text-sm font-bold uppercase tracking-wide border-b-2 border-black hover:text-gray-600 hover:border-gray-600 transition-colors">
                <ArrowLeft size={14} /> Back to Shop
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {related.map(p => <ProductCard key={p.id} {...p} price={formatPrice(p.price)} originalPrice={p.originalPrice ? formatPrice(p.originalPrice) : undefined} />)}
            </div>
          </section>
        )}

      </main>

      <Footer />
    </div>
  );
}
