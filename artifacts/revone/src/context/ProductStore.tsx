import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { PRODUCTS as DEFAULT_PRODUCTS, type Product } from "@/data/products";

interface ProductStoreContextType {
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updatePrice: (id: string, newPrice: number, newOriginalPrice?: number) => void;
  getProduct: (id: string) => Product | undefined;
}

const ProductStoreContext = createContext<ProductStoreContextType | null>(null);

const STORAGE_KEY = "empress-products-store";

function loadProducts(): Product[] {
  let list: Product[] = [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as Product[];
      const storedIds = new Set(parsed.map((p) => p.id));
      list = [
        ...parsed,
        ...DEFAULT_PRODUCTS.filter((p) => !storedIds.has(p.id)),
      ];
    } else {
      list = [...DEFAULT_PRODUCTS];
    }
  } catch {
    list = [...DEFAULT_PRODUCTS];
  }

  return list.map((p) => {
    if (p.stock !== undefined) return p;
    // Set mock stock levels to demonstrate low stock notices:
    if (p.id === "1") return { ...p, stock: 3 }; // low stock
    if (p.id === "2") return { ...p, stock: 2 }; // low stock
    if (p.id === "3") return { ...p, stock: 0 }; // out of stock
    return { ...p, stock: 15 }; // regular stock
  });
}

export function ProductStoreProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(loadProducts);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  }, [products]);

  const addProduct = useCallback((product: Product) => {
    setProducts((prev) => [...prev, product]);
  }, []);

  const updateProduct = useCallback((id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const updatePrice = useCallback(
    (id: string, newPrice: number, newOriginalPrice?: number) => {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === id
            ? {
                ...p,
                price: newPrice,
                ...(newOriginalPrice !== undefined
                  ? { originalPrice: newOriginalPrice }
                  : {}),
              }
            : p
        )
      );
    },
    []
  );

  const getProduct = useCallback(
    (id: string) => products.find((p) => p.id === id),
    [products]
  );

  return (
    <ProductStoreContext.Provider
      value={{ products, addProduct, updateProduct, deleteProduct, updatePrice, getProduct }}
    >
      {children}
    </ProductStoreContext.Provider>
  );
}

export function useProductStore() {
  const ctx = useContext(ProductStoreContext);
  if (!ctx) throw new Error("useProductStore must be used inside ProductStoreProvider");
  return ctx;
}
