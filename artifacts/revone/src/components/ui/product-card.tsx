import { Link } from "wouter";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";

interface ProductCardProps {
  id: string;
  name: string;
  price: string;
  originalPrice?: string;
  image: string;
  onSale?: boolean;
}

export function ProductCard({ id, name, price, originalPrice, image, onSale }: ProductCardProps) {
  return (
    <motion.div 
      className="group relative cursor-pointer flex flex-col"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <div className="relative aspect-[3/4] bg-gray-100 mb-4 overflow-hidden">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        
        {onSale && (
          <div className="absolute top-3 left-3 bg-[#E63946] text-white text-xs font-bold px-2 py-1 uppercase tracking-wider">
            Sale
          </div>
        )}
        
        <div className="absolute bottom-0 left-0 w-full p-4 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <button className="w-full bg-black text-white font-medium py-3 rounded-full flex items-center justify-center gap-2 hover:bg-gray-800">
            <ShoppingBag size={18} />
            Add to Cart
          </button>
        </div>
      </div>
      
      <div className="flex flex-col flex-grow">
        <Link href={`/shop/${id}`}>
          <h3 className="text-sm text-gray-800 hover:text-black transition-colors mb-1 truncate">{name}</h3>
        </Link>
        <div className="flex items-center gap-2 mt-auto">
          {onSale && originalPrice && (
            <span className="text-sm text-gray-500 line-through">{originalPrice}</span>
          )}
          <span className="text-sm font-bold text-black">{price}</span>
        </div>
      </div>
    </motion.div>
  );
}
