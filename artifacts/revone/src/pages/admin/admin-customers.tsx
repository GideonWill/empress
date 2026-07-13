import { useState, useMemo } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { formatPrice } from "@/lib/currency";
import { Search, Mail, Phone, ShoppingBag, X, FileText, CreditCard, ShieldCheck, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useOrderStore } from "@/context/OrderStore";
import type { Order } from "@/context/OrderStore";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  firstOrderDate: string;
  totalOrders: number;
  totalSpent: number;
  orders: Order[];
}

const STATUS_COLORS: Record<string, string> = {
  Delivered: "bg-emerald-500/10 text-emerald-400",
  Processing: "bg-blue-500/10 text-blue-400",
  Pending: "bg-amber-500/10 text-amber-400",
  Cancelled: "bg-red-500/10 text-red-400",
};

const PAY_STATUS_COLORS: Record<string, string> = {
  Paid: "bg-emerald-500/10 text-emerald-400",
  Refunded: "bg-orange-500/10 text-orange-400",
  Pending: "bg-amber-500/10 text-amber-400",
};

export default function AdminCustomers() {
  const { orders } = useOrderStore();
  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Derive customers from orders — group by email
  const customers = useMemo(() => {
    const map = new Map<string, Customer>();
    orders.forEach((order, idx) => {
      const existing = map.get(order.email);
      if (existing) {
        existing.totalOrders += 1;
        existing.totalSpent += order.total;
        existing.orders.push(order);
      } else {
        map.set(order.email, {
          id: `C-${String(idx + 1).padStart(3, "0")}`,
          name: order.customer,
          email: order.email,
          phone: order.phone,
          firstOrderDate: order.date,
          totalOrders: 1,
          totalSpent: order.total,
          orders: [order],
        });
      }
    });
    return Array.from(map.values());
  }, [orders]);

  const filtered = customers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  );

  return (
    <AdminLayout>
      <div className="space-y-6 relative h-full">
        <div>
          <h2 className="text-2xl font-extrabold text-white">Customers</h2>
          <p className="text-gray-500 text-sm mt-1">
            {customers.length} total customers
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search by name, email, or phone…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-900 border border-gray-800 text-white pl-10 pr-4 py-2.5 rounded-lg text-sm outline-none focus:border-amber-500 transition-colors placeholder:text-gray-600"
          />
        </div>

        {/* Customers Table */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800 text-gray-500">
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Contact Info</th>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">First Order</th>
                  <th className="px-6 py-3 text-center text-xs font-bold uppercase tracking-wider">Orders</th>
                  <th className="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider">Total Spent</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((customer) => (
                  <tr
                    key={customer.email}
                    onClick={() => setSelectedCustomer(customer)}
                    className="border-b border-gray-800/50 hover:bg-gray-800/30 cursor-pointer transition-colors"
                    title="Click to view Customer Details"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center font-bold text-amber-400">
                          {customer.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                        </div>
                        <div>
                          <p className="text-white font-semibold hover:text-amber-400 transition-colors">
                            {customer.name}
                          </p>
                          <p className="text-gray-600 text-xs">{customer.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1 text-gray-400 text-xs">
                        <div className="flex items-center gap-1.5">
                          <Mail size={12} className="text-gray-500" />
                          <span>{customer.email}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Phone size={12} className="text-gray-500" />
                          <span>{customer.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-xs">
                      {customer.firstOrderDate}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex items-center gap-1 bg-gray-800 text-gray-300 px-2.5 py-1 rounded-md text-xs font-semibold">
                        <ShoppingBag size={12} className="text-amber-500" />
                        <span>{customer.totalOrders}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right text-white font-semibold text-sm">
                      {formatPrice(customer.totalSpent)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="px-6 py-16 text-center">
              <Users size={40} className="mx-auto text-gray-700 mb-4" />
              <p className="text-gray-500 text-sm font-medium">
                {customers.length === 0
                  ? "No customers yet. Customer profiles are created automatically when orders are placed."
                  : "No customers found matching your search."}
              </p>
            </div>
          )}
        </div>

        {/* Customer Details Slide-over Drawer */}
        <AnimatePresence>
          {selectedCustomer && (
            <>
              {/* Overlay background blur */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedCustomer(null)}
                className="fixed inset-0 bg-black z-40"
              />

              {/* Side Drawer */}
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-gray-900 border-l border-gray-800 shadow-2xl z-50 flex flex-col h-screen overflow-hidden"
              >
                {/* Header */}
                <div className="p-6 border-b border-gray-800 flex items-center justify-between">
                  <h3 className="font-extrabold text-lg text-white">Customer Profile</h3>
                  <button 
                    onClick={() => setSelectedCustomer(null)}
                    className="p-1.5 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white rounded-lg transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Profile Scroll Container */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {/* Summary Card */}
                  <div className="bg-gray-950/40 border border-gray-800 rounded-2xl p-5 flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center font-extrabold text-black text-xl">
                      {selectedCustomer.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                    </div>
                    <div>
                      <h4 className="text-white font-extrabold text-lg">{selectedCustomer.name}</h4>
                      <p className="text-xs text-gray-500">{selectedCustomer.id} • Customer</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-400 font-medium">
                        <span className="flex items-center gap-1"><Mail size={12} className="text-amber-500" />{selectedCustomer.email}</span>
                        <span className="flex items-center gap-1"><Phone size={12} className="text-amber-500" />{selectedCustomer.phone}</span>
                      </div>
                    </div>
                  </div>

                  {/* Customer stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-800/40 border border-gray-800/60 p-4 rounded-xl">
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Total Spend</p>
                      <p className="text-lg font-black text-white mt-1">{formatPrice(selectedCustomer.totalSpent)}</p>
                    </div>
                    <div className="bg-gray-800/40 border border-gray-800/60 p-4 rounded-xl">
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Total Orders</p>
                      <p className="text-lg font-black text-white mt-1">{selectedCustomer.totalOrders}</p>
                    </div>
                  </div>

                  {/* Order & Payment logs */}
                  <div className="space-y-4">
                    <h5 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Order & Payment Log</h5>
                    {selectedCustomer.orders.map((order) => (
                      <div key={order.id} className="bg-gray-950 border border-gray-800 rounded-xl overflow-hidden p-4 space-y-4">
                        <div className="flex items-center justify-between border-b border-gray-800/50 pb-3">
                          <div>
                            <span className="text-sm font-bold text-white flex items-center gap-1.5">
                              <FileText size={14} className="text-amber-500" /> {order.id}
                            </span>
                            <span className="text-[10px] text-gray-500 font-semibold">{order.date}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${STATUS_COLORS[order.status] || "bg-gray-800"}`}>
                              {order.status}
                            </span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${PAY_STATUS_COLORS[order.paymentStatus] || "bg-gray-800"}`}>
                              {order.paymentStatus}
                            </span>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold text-gray-500 uppercase">Items</p>
                          <ul className="text-xs text-gray-300 space-y-1 font-medium pl-1">
                            {order.items.map((item, idx) => (
                              <li key={idx} className="flex items-center gap-2">
                                {item.image && (
                                  <img src={item.image} alt={item.productName} className="w-8 h-8 rounded object-cover bg-gray-700" />
                                )}
                                <span>• {item.productName} x{item.quantity}{item.size ? ` (${item.size})` : ""}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Payment details */}
                        <div className="bg-gray-900/60 p-3 rounded-lg border border-gray-800/40 grid grid-cols-2 gap-4 text-xs">
                          <div>
                            <p className="text-[10px] font-bold text-gray-500 uppercase">Method</p>
                            <p className="font-semibold text-gray-300 mt-0.5 flex items-center gap-1">
                              <CreditCard size={12} className="text-gray-400" /> {order.paymentMethod}
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-gray-500 uppercase">Reference</p>
                            <p className="font-semibold text-gray-400 mt-0.5 font-mono select-all truncate">{order.reference}</p>
                          </div>
                        </div>

                        {/* Shipping */}
                        <div className="text-xs">
                          <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">Shipping To</p>
                          <p className="text-gray-300">{order.address}, {order.city}</p>
                          <p className="text-gray-400">{order.state} {order.zip}, {order.country}</p>
                        </div>

                        <div className="flex justify-between items-center pt-2">
                          <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1">
                            <ShieldCheck size={12} /> Protected Transaction
                          </span>
                          <span className="font-extrabold text-white">{formatPrice(order.total)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </AdminLayout>
  );
}
