import { createContext, useContext, useState, useCallback } from "react";
import type { Product } from "@/data/products";

interface WishlistContextType {
  items: Product[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  toggle: (product: Product) => void;
  isWishlisted: (productId: string) => boolean;
  clearAll: () => void;
  totalItems: number;
}

const WishlistContext = createContext<WishlistContextType | null>(null);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Product[]>([]);

  const addItem = useCallback((product: Product) => {
    setItems(prev => prev.some(p => p.id === product.id) ? prev : [...prev, product]);
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems(prev => prev.filter(p => p.id !== productId));
  }, []);

  const toggle = useCallback((product: Product) => {
    setItems(prev =>
      prev.some(p => p.id === product.id)
        ? prev.filter(p => p.id !== product.id)
        : [...prev, product]
    );
  }, []);

  const isWishlisted = useCallback((productId: string) => items.some(p => p.id === productId), [items]);

  const clearAll = useCallback(() => {
    setItems([]);
  }, []);

  return (
    <WishlistContext.Provider value={{ items, addItem, removeItem, toggle, isWishlisted, clearAll, totalItems: items.length }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
