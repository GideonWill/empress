import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ShoppingBag, Heart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { PRODUCTS } from "@/data/products";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  id: string;
  name: string;
  price: string;
  originalPrice?: string;
  image: string;
  onSale?: boolean;
  isNew?: boolean;
}

export function ProductCard({ id, name, price, originalPrice, image, onSale, isNew }: ProductCardProps) {
  const { addItem, isInCart } = useCart();
  const { toggle, isWishlisted } = useWishlist();
  const { toast } = useToast();
  const [adding, setAdding] = useState(false);
  const product = PRODUCTS.find(p => p.id === id);
  const inCart = isInCart(id);
  const wishlisted = isWishlisted(id);

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!product) return;
    const defaultSize = product.sizes[2] || product.sizes[0];
    const defaultColor = product.colors[0];
    addItem(product, defaultSize, defaultColor, 1);
    setAdding(true);
    toast({ title: "Added to cart", description: name });
    setTimeout(() => setAdding(false), 1200);
  }

  function handleWishlist(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!product) return;
    toggle(product);
    toast({
      title: wishlisted ? "Removed from wishlist" : "Added to wishlist",
      description: name,
    });
  }

  return (
    <motion.div
      className="group relative cursor-pointer flex flex-col"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      data-testid={`card-product-${id}`}
    >
      <div className="relative aspect-[3/4] bg-gray-50 mb-4 overflow-hidden">
        <Link href={`/shop/${id}`}>
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {onSale && (
            <span className="bg-[#E63946] text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider">Sale</span>
          )}
          {isNew && (
            <span className="bg-black text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider">New</span>
          )}
        </div>

        {/* Wishlist button */}
        <button
          onClick={handleWishlist}
          data-testid={`wishlist-${id}`}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
        >
          <Heart size={14} className={wishlisted ? "fill-[#E63946] text-[#E63946]" : "text-gray-600"} />
        </button>

        {/* Add to Cart overlay */}
        <div className="absolute bottom-0 left-0 w-full p-3 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={handleAddToCart}
            data-testid={`add-to-cart-${id}`}
            className={`w-full font-semibold py-3 rounded-full flex items-center justify-center gap-2 text-sm transition-colors ${inCart || adding ? "bg-gray-800 text-white" : "bg-black text-white hover:bg-gray-800"}`}
          >
            <ShoppingBag size={16} />
            {adding ? "Added!" : inCart ? "In Cart" : "Add to Cart"}
          </motion.button>
        </div>
      </div>

      <div className="flex flex-col flex-grow px-1">
        <Link href={`/shop/${id}`}>
          <h3 className="text-sm text-gray-800 hover:text-black transition-colors mb-1.5 leading-snug line-clamp-2" data-testid={`text-product-name-${id}`}>{name}</h3>
        </Link>
        <div className="flex items-center gap-2 mt-auto">
          {onSale && originalPrice && (
            <span className="text-sm text-gray-400 line-through">{originalPrice}</span>
          )}
          <span className="text-sm font-bold text-black" data-testid={`text-price-${id}`}>{price}</span>
        </div>
      </div>
    </motion.div>
  );
}
