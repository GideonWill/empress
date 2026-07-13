import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { formatPrice } from "@/lib/currency";
import { Search, ChevronDown, Eye, ShoppingBag } from "lucide-react";
import { useOrderStore } from "@/context/OrderStore";
import type { Order } from "@/context/OrderStore";

const STATUS_OPTIONS = ["All", "Pending", "Processing", "Delivered", "Cancelled"];

const STATUS_COLORS: Record<string, string> = {
  Delivered: "bg-emerald-500/10 text-emerald-400",
  Processing: "bg-blue-500/10 text-blue-400",
  Pending: "bg-amber-500/10 text-amber-400",
  Cancelled: "bg-red-500/10 text-red-400",
};

export default function AdminOrders() {
  const { orders, updateOrderStatus } = useOrderStore();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const filtered = orders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.toLowerCase().includes(search.toLowerCase()) ||
      o.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-extrabold text-white">Orders</h2>
          <p className="text-gray-500 text-sm mt-1">
            {orders.length} total orders
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search by order ID, customer, or email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-gray-900 border border-gray-800 text-white pl-10 pr-4 py-2.5 rounded-lg text-sm outline-none focus:border-amber-500 transition-colors placeholder:text-gray-600"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {STATUS_OPTIONS.map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 text-xs font-bold rounded-lg border transition-colors ${
                  statusFilter === status
                    ? "border-amber-500 bg-amber-500/10 text-amber-400"
                    : "border-gray-800 text-gray-500 hover:text-gray-300 hover:border-gray-600"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((order) => (
                  <>
                    <tr
                      key={order.id}
                      className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors"
                    >
                      <td className="px-6 py-4 text-white font-semibold">{order.id}</td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-gray-300 font-medium">{order.customer}</p>
                          <p className="text-gray-600 text-xs">{order.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500">{order.date}</td>
                      <td className="px-6 py-4">
                        <div className="relative inline-block">
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value as Order["status"])}
                            className={`appearance-none px-3 py-1.5 pr-7 rounded-full text-xs font-bold border-0 outline-none cursor-pointer ${STATUS_COLORS[order.status] || "bg-gray-800 text-gray-400"}`}
                          >
                            {STATUS_OPTIONS.filter((s) => s !== "All").map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                          <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-current opacity-60" />
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right text-white font-semibold">{formatPrice(order.total)}</td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                          className="p-2 text-gray-500 hover:text-amber-400 hover:bg-amber-500/10 rounded-lg transition-colors"
                        >
                          <Eye size={14} />
                        </button>
                      </td>
                    </tr>
                    {expandedOrder === order.id && (
                      <tr key={`${order.id}-detail`} className="border-b border-gray-800/50">
                        <td colSpan={6} className="px-6 py-4 bg-gray-800/20">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Order Items */}
                            <div>
                              <div className="text-xs text-gray-400 font-semibold uppercase mb-2">Order Items</div>
                              <ul className="space-y-2">
                                {order.items.map((item, idx) => (
                                  <li key={idx} className="flex items-center gap-3">
                                    {item.image && (
                                      <img src={item.image} alt={item.productName} className="w-10 h-10 rounded object-cover bg-gray-700" />
                                    )}
                                    <div>
                                      <p className="text-sm text-gray-300 font-medium">{item.productName}</p>
                                      <p className="text-xs text-gray-500">
                                        Qty: {item.quantity} {item.size && `• Size: ${item.size}`} • {formatPrice(item.price * item.quantity)}
                                      </p>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            {/* Shipping & Payment */}
                            <div className="space-y-3">
                              <div>
                                <div className="text-xs text-gray-400 font-semibold uppercase mb-1">Shipping Address</div>
                                <p className="text-sm text-gray-300">{order.address}</p>
                                <p className="text-sm text-gray-400">{order.city}, {order.state} {order.zip}</p>
                                <p className="text-sm text-gray-400">{order.country}</p>
                              </div>
                              <div>
                                <div className="text-xs text-gray-400 font-semibold uppercase mb-1">Contact</div>
                                <p className="text-sm text-gray-300">{order.email}</p>
                                <p className="text-sm text-gray-400">{order.phone}</p>
                              </div>
                              <div>
                                <div className="text-xs text-gray-400 font-semibold uppercase mb-1">Payment</div>
                                <p className="text-sm text-gray-300">{order.paymentMethod}</p>
                                <p className="text-xs text-gray-500 font-mono">Ref: {order.reference}</p>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="px-6 py-16 text-center">
              <ShoppingBag size={40} className="mx-auto text-gray-700 mb-4" />
              <p className="text-gray-500 text-sm font-medium">
                {orders.length === 0 ? "No orders yet. Orders will appear here when customers complete checkout." : "No orders match your filters."}
              </p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
