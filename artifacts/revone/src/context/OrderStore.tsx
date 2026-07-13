import { createContext, useContext, useState, useCallback } from "react";

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  size?: string;
  image?: string;
}

export interface Order {
  id: string;
  reference: string;
  customer: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  date: string;
  status: "Pending" | "Processing" | "Delivered" | "Cancelled";
  paymentStatus: "Paid" | "Pending" | "Refunded";
  paymentMethod: string;
  total: number;
  items: OrderItem[];
}

interface OrderStoreContextType {
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order["status"]) => void;
  getOrderByRef: (ref: string) => Order | undefined;
}

const STORAGE_KEY = "empress-orders";

function loadOrders(): Order[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // ignore
  }
  return [];
}

function saveOrders(orders: Order[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
}

const OrderStoreContext = createContext<OrderStoreContextType | null>(null);

export function OrderStoreProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(loadOrders);

  const addOrder = useCallback((order: Order) => {
    setOrders(prev => {
      // Prevent duplicates by reference
      if (prev.some(o => o.reference === order.reference)) return prev;
      const updated = [order, ...prev];
      saveOrders(updated);
      return updated;
    });
  }, []);

  const updateOrderStatus = useCallback((orderId: string, status: Order["status"]) => {
    setOrders(prev => {
      const updated = prev.map(o => o.id === orderId ? { ...o, status } : o);
      saveOrders(updated);
      return updated;
    });
  }, []);

  const getOrderByRef = useCallback((ref: string) => {
    return orders.find(o => o.reference === ref);
  }, [orders]);

  return (
    <OrderStoreContext.Provider value={{ orders, addOrder, updateOrderStatus, getOrderByRef }}>
      {children}
    </OrderStoreContext.Provider>
  );
}

export function useOrderStore() {
  const ctx = useContext(OrderStoreContext);
  if (!ctx) throw new Error("useOrderStore must be used inside OrderStoreProvider");
  return ctx;
}
