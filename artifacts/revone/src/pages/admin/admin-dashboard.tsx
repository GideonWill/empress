import { useState, useMemo } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useProductStore } from "@/context/ProductStore";
import { useOrderStore } from "@/context/OrderStore";
import type { Order } from "@/context/OrderStore";
import { formatPrice } from "@/lib/currency";
import {
  TrendingUp,
  ShoppingCart,
  DollarSign,
  Clock,
  AlertTriangle,
  Users,
  ArrowUpRight,
  Package,
  X,
  Mail,
  Phone,
  FileText,
  CreditCard,
  ShieldCheck,
} from "lucide-react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";

interface DashboardCustomer {
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  orders: Order[];
}

const REVENUE_DATA = [
  { label: "Mon", value: 1200 },
  { label: "Tue", value: 1800 },
  { label: "Wed", value: 950 },
  { label: "Thu", value: 2200 },
  { label: "Fri", value: 1700 },
  { label: "Sat", value: 2800 },
  { label: "Sun", value: 2100 },
];

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

export default function AdminDashboard() {
  const { products } = useProductStore();
  const { orders } = useOrderStore();
  const [selectedCustomer, setSelectedCustomer] = useState<DashboardCustomer | null>(null);

  // Build customer lookup from real orders
  const customerMap = useMemo(() => {
    const map = new Map<string, DashboardCustomer>();
    orders.forEach((order) => {
      const existing = map.get(order.email);
      if (existing) {
        existing.totalOrders += 1;
        existing.totalSpent += order.total;
        existing.orders.push(order);
      } else {
        map.set(order.email, {
          name: order.customer,
          email: order.email,
          phone: order.phone,
          totalOrders: 1,
          totalSpent: order.total,
          orders: [order],
        });
      }
    });
    return map;
  }, [orders]);

  const recentOrders = orders.slice(0, 6);
  const totalOrders = orders.length;
  const totalRevenue = orders.filter(o => o.status !== "Cancelled").reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = orders.filter(o => o.status === "Pending").length;
  const totalCustomers = customerMap.size;
  const lowStockCount = products.filter(p => p.stock !== undefined && p.stock <= 5).length;

  const maxRevenue = Math.max(...REVENUE_DATA.map(d => d.value), 1);

  const KPI_CARDS = [
    { label: "Total Orders", value: totalOrders.toString(), icon: ShoppingCart, color: "from-blue-500 to-blue-600", change: "" },
    { label: "Revenue", value: formatPrice(totalRevenue), icon: DollarSign, color: "from-amber-500 to-amber-600", change: "" },
    { label: "Pending Orders", value: pendingOrders.toString(), icon: Clock, color: "from-orange-500 to-orange-600", change: "" },
    { label: "Customers", value: totalCustomers.toString(), icon: Users, color: "from-purple-500 to-purple-600", change: "" },
    { label: "Products", value: products.length.toString(), icon: Package, color: "from-emerald-500 to-emerald-600", change: "" },
    { label: "Low Stock", value: lowStockCount.toString(), icon: AlertTriangle, color: "from-red-500 to-red-600", change: "" },
  ];

  const handleRowClick = (customerName: string) => {
    // Find customer by name across the real order data
    for (const customer of customerMap.values()) {
      if (customer.name.toLowerCase() === customerName.toLowerCase()) {
        setSelectedCustomer(customer);
        return;
      }
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8 relative">
        {/* Page Header */}
        <div>
          <h2 className="text-2xl font-extrabold text-white">Dashboard</h2>
          <p className="text-gray-500 text-sm mt-1">
            {orders.length > 0
              ? "Here's an overview of your store performance."
              : "Welcome! Orders and analytics will appear here once customers start purchasing."}
          </p>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {KPI_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.label}
                className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${card.color} flex items-center justify-center`}>
                    <Icon size={18} className="text-white" />
                  </div>
                  {card.change && (
                    <span className="flex items-center gap-0.5 text-xs font-bold text-emerald-400">
                      <ArrowUpRight size={12} />
                      {card.change}
                    </span>
                  )}
                </div>
                <p className="text-2xl font-extrabold text-white">{card.value}</p>
                <p className="text-xs text-gray-500 mt-1 font-medium">{card.label}</p>
              </div>
            );
          })}
        </div>

        {/* Charts + Quick Actions Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Chart */}
          <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wide mb-6">
              Weekly Revenue
            </h3>
            <div className="flex items-end justify-between gap-3 h-48">
              {REVENUE_DATA.map((d) => (
                <div key={d.label} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-[10px] text-gray-500 font-semibold">
                    {formatPrice(d.value)}
                  </span>
                  <div className="w-full relative flex justify-center">
                    <div
                      className="w-full max-w-10 rounded-t-lg bg-gradient-to-t from-amber-600 to-amber-400 transition-all duration-500"
                      style={{ height: `${(d.value / maxRevenue) * 140}px` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 font-medium">{d.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wide mb-2">
              Quick Actions
            </h3>
            <Link
              href="/admin/products/new"
              className="flex items-center gap-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-lg px-4 py-3 text-sm font-semibold hover:bg-amber-500/20 transition-colors"
            >
              <Package size={16} />
              Add New Product
            </Link>
            <Link
              href="/admin/orders"
              className="flex items-center gap-3 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-lg px-4 py-3 text-sm font-semibold hover:bg-blue-500/20 transition-colors"
            >
              <ShoppingCart size={16} />
              View All Orders
            </Link>
            <Link
              href="/admin/products"
              className="flex items-center gap-3 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-lg px-4 py-3 text-sm font-semibold hover:bg-purple-500/20 transition-colors"
            >
              <AlertTriangle size={16} />
              Manage Stock
            </Link>
            <div className="pt-2 border-t border-gray-800">
              <p className="text-xs text-gray-600">Total Products: <strong className="text-gray-400">{products.length}</strong></p>
            </div>
          </div>
        </div>

        {/* Recent Orders Table */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wide">
              Recent Orders
            </h3>
            <Link
              href="/admin/orders"
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold"
            >
              View All →
            </Link>
          </div>
          {recentOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800 text-gray-500">
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Date & Time</th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr
                      key={order.id}
                      onClick={() => handleRowClick(order.customer)}
                      className="border-b border-gray-800/50 hover:bg-gray-800/30 cursor-pointer transition-colors"
                      title="Click to view Customer Details"
                    >
                      <td className="px-6 py-4 text-white font-semibold">{order.id}</td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-white font-semibold hover:text-amber-400 transition-colors">{order.customer}</p>
                          <p className="text-gray-500 text-xs mt-0.5">{order.phone}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-xs font-medium">{order.date}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${STATUS_COLORS[order.status] || "bg-gray-800 text-gray-400"}`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-white font-semibold">
                        {formatPrice(order.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="px-6 py-16 text-center">
              <ShoppingCart size={40} className="mx-auto text-gray-700 mb-4" />
              <p className="text-gray-500 text-sm font-medium">
                No orders yet. Recent orders will appear here when customers complete checkout.
              </p>
            </div>
          )}
        </div>

        {/* Customer Details Slide-over Drawer */}
        <AnimatePresence>
          {selectedCustomer && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedCustomer(null)}
                className="fixed inset-0 bg-black z-40"
              />

              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-gray-900 border-l border-gray-800 shadow-2xl z-50 flex flex-col h-screen overflow-hidden text-left"
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
