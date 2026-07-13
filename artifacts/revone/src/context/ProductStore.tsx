import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { PRODUCTS as DEFAULT_PRODUCTS, type Product } from "@/data/products";

interface ProductStoreContextType {
  products: Product[];
  addProduct: (product: Product) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  updatePrice: (id: string, newPrice: number, newOriginalPrice?: number) => Promise<void>;
  getProduct: (id: string) => Product | undefined;
  isLoading: boolean;
}

const ProductStoreContext = createContext<ProductStoreContextType | null>(null);

export function ProductStoreProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch products from Neon database on mount
  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error("Failed to fetch products");
      const data: Product[] = await res.json();
      
      if (data.length === 0) {
        // Database is empty. Populate it with DEFAULT_PRODUCTS!
        const populated: Product[] = [];
        for (const p of DEFAULT_PRODUCTS) {
          let stock = 15;
          if (p.id === "1") stock = 3;
          if (p.id === "2") stock = 2;
          if (p.id === "3") stock = 0;

          const productWithStock = { ...p, stock };
          
          const createRes = await fetch("/api/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(productWithStock),
          });
          if (createRes.ok) {
            const saved = await createRes.json();
            populated.push(saved);
          }
        }
        setProducts(populated);
      } else {
        setProducts(data);
      }
    } catch (err) {
      console.error("Error loading products from Neon:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const addProduct = useCallback(async (product: Product) => {
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });
      if (res.ok) {
        const saved = await res.json();
        setProducts((prev) => [...prev, saved]);
      } else {
        throw new Error("Failed to save product to database");
      }
    } catch (err) {
      console.error("Error adding product:", err);
      throw err;
    }
  }, []);

  const updateProduct = useCallback(async (id: string, updates: Partial<Product>) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        const updated = await res.json();
        setProducts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, ...updated } : p))
        );
      } else {
        throw new Error("Failed to update product in database");
      }
    } catch (err) {
      console.error("Error updating product:", err);
      throw err;
    }
  }, []);

  const deleteProduct = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
      } else {
        throw new Error("Failed to delete product from database");
      }
    } catch (err) {
      console.error("Error deleting product:", err);
      throw err;
    }
  }, []);

  const updatePrice = useCallback(
    async (id: string, newPrice: number, newOriginalPrice?: number) => {
      const updates: Partial<Product> = {
        price: newPrice,
        originalPrice: newOriginalPrice,
      };
      await updateProduct(id, updates);
    },
    [updateProduct]
  );

  const getProduct = useCallback(
    (id: string) => products.find((p) => p.id === id),
    [products]
  );

  return (
    <ProductStoreContext.Provider
      value={{ products, addProduct, updateProduct, deleteProduct, updatePrice, getProduct, isLoading }}
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
