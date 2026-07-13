import { useState } from "react";
import { Link } from "wouter";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useProductStore } from "@/context/ProductStore";
import { formatPrice } from "@/lib/currency";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
  ChevronDown,
} from "lucide-react";

export default function AdminProducts() {
  const { products, updateProduct, deleteProduct } = useProductStore();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState("");
  const [editStock, setEditStock] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const categories = ["All", ...Array.from(new Set(products.map((p) => p.category)))];

  const filtered = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.id.includes(search);
    const matchesCategory =
      categoryFilter === "All" || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleSaveProduct = (id: string) => {
    const newPrice = parseFloat(editPrice);
    const newStock = parseInt(editStock, 10);
    const updates: any = {};
    if (!isNaN(newPrice) && newPrice > 0) {
      updates.price = newPrice;
    }
    if (!isNaN(newStock) && newStock >= 0) {
      updates.stock = newStock;
    }
    if (Object.keys(updates).length > 0) {
      updateProduct(id, updates);
    }
    setEditingId(null);
    setEditPrice("");
    setEditStock("");
  };

  const handleDelete = (id: string) => {
    deleteProduct(id);
    setDeleteConfirm(null);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-white">Products</h2>
            <p className="text-gray-500 text-sm mt-1">
              {products.length} products in your catalog
            </p>
          </div>
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 text-black px-5 py-2.5 rounded-lg font-bold text-sm hover:from-amber-400 hover:to-amber-500 transition-all"
          >
            <Plus size={16} />
            Add Product
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            />
            <input
              type="text"
              placeholder="Search by name or ID…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-gray-900 border border-gray-800 text-white pl-10 pr-4 py-2.5 rounded-lg text-sm outline-none focus:border-amber-500 transition-colors placeholder:text-gray-600"
            />
          </div>
          <div className="relative">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="appearance-none bg-gray-900 border border-gray-800 text-white px-4 py-2.5 pr-10 rounded-lg text-sm outline-none focus:border-amber-500 cursor-pointer"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
            />
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors"
                  >
                    {/* Product Info */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-gray-800 overflow-hidden flex-shrink-0">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-white font-semibold text-sm leading-snug">
                            {product.name}
                          </p>
                          <p className="text-gray-600 text-xs mt-0.5">
                            ID: {product.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-6 py-4">
                      <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-bold bg-gray-800 text-gray-300">
                        {product.category}
                      </span>
                    </td>

                    {/* Price (editable) */}
                    <td className="px-6 py-4">
                      {editingId === product.id ? (
                        <input
                          type="number"
                          value={editPrice}
                          onChange={(e) => setEditPrice(e.target.value)}
                          className="w-24 bg-gray-800 border border-amber-500 text-white px-2 py-1.5 rounded text-sm outline-none"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleSaveProduct(product.id);
                            if (e.key === "Escape") setEditingId(null);
                          }}
                        />
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-white font-semibold">
                            {formatPrice(product.price)}
                          </span>
                          {product.originalPrice && (
                            <span className="text-gray-600 line-through text-xs">
                              {formatPrice(product.originalPrice)}
                            </span>
                          )}
                        </div>
                      )}
                    </td>

                    {/* Stock (editable) */}
                    <td className="px-6 py-4">
                      {editingId === product.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={editStock}
                            onChange={(e) => setEditStock(e.target.value)}
                            className="w-20 bg-gray-800 border border-amber-500 text-white px-2 py-1.5 rounded text-sm outline-none"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleSaveProduct(product.id);
                              if (e.key === "Escape") setEditingId(null);
                            }}
                          />
                          <button
                            onClick={() => handleSaveProduct(product.id)}
                            className="text-emerald-400 hover:text-emerald-300"
                          >
                            <Check size={16} />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="text-gray-500 hover:text-gray-300"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className={`font-semibold ${
                            product.stock === 0 
                              ? "text-red-500 font-bold" 
                              : product.stock !== undefined && product.stock <= 5 
                              ? "text-amber-500 font-bold" 
                              : "text-gray-300"
                          }`}>
                            {product.stock ?? 0}
                          </span>
                          {product.stock !== undefined && product.stock <= 5 && (
                            <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                              product.stock === 0
                                ? "bg-red-500/10 text-red-500"
                                : "bg-amber-500/10 text-amber-500"
                            }`}>
                              {product.stock === 0 ? "Out" : "Low"}
                            </span>
                          )}
                        </div>
                      )}
                    </td>

                    {/* Rating */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <span className="text-amber-400 text-xs">★</span>
                        <span className="text-gray-400 text-sm">
                          {product.rating}
                        </span>
                        <span className="text-gray-600 text-xs">
                          ({product.reviewCount})
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${
                          product.onSale
                            ? "bg-emerald-500/10 text-emerald-400"
                            : product.isNew
                            ? "bg-blue-500/10 text-blue-400"
                            : "bg-gray-800 text-gray-400"
                        }`}
                      >
                        {product.onSale
                          ? "On Sale"
                          : product.isNew
                          ? "New"
                          : "Active"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditingId(product.id);
                            setEditPrice(product.price.toString());
                            setEditStock((product.stock ?? 0).toString());
                          }}
                          className="p-2 text-gray-500 hover:text-amber-400 hover:bg-amber-500/10 rounded-lg transition-colors"
                          title="Edit Price"
                        >
                          <Pencil size={14} />
                        </button>
                        {deleteConfirm === product.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="px-2 py-1 text-xs font-bold bg-red-500/20 text-red-400 rounded hover:bg-red-500/30"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="px-2 py-1 text-xs font-bold bg-gray-800 text-gray-400 rounded hover:bg-gray-700"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirm(product.id)}
                            className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filtered.length === 0 && (
            <div className="px-6 py-12 text-center text-gray-500 text-sm">
              No products found matching your search.
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
