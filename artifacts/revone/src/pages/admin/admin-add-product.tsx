import { useState } from "react";
import { useLocation } from "wouter";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useProductStore } from "@/context/ProductStore";
import { ArrowLeft, Plus, X } from "lucide-react";
import { Link } from "wouter";

const CATEGORY_OPTIONS = ["Shoes", "Dresses", "Wigs", "Accessories"];
const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL", "36", "37", "38", "39", "40", "41", "42"];
const COLOR_PRESETS = [
  { name: "Black", code: "#000000" },
  { name: "White", code: "#FFFFFF" },
  { name: "Red", code: "#E63946" },
  { name: "Blue", code: "#1D3557" },
  { name: "Brown", code: "#4B3A2A" },
  { name: "Gold", code: "#FFD700" },
  { name: "Purple", code: "#7b2cbf" },
  { name: "Pink", code: "#FF69B4" },
  { name: "Olive", code: "#556b2f" },
];

export default function AdminAddProduct() {
  const { addProduct, products } = useProductStore();
  const [, setLocation] = useLocation();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [category, setCategory] = useState(CATEGORY_OPTIONS[0]);
  const [description, setDescription] = useState("");
  const [details, setDetails] = useState<string[]>([""]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [onSale, setOnSale] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [stock, setStock] = useState("10");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const toggleColor = (code: string) => {
    setSelectedColors((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  const addDetail = () => setDetails((prev) => [...prev, ""]);
  const updateDetail = (idx: number, value: string) => {
    setDetails((prev) => prev.map((d, i) => (i === idx ? value : d)));
  };
  const removeDetail = (idx: number) => {
    setDetails((prev) => prev.filter((_, i) => i !== idx));
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Product name is required";
    if (!price || parseFloat(price) <= 0) e.price = "Valid price is required";
    if (!imageUrl.trim()) e.imageUrl = "Image URL is required";
    if (!description.trim()) e.description = "Description is required";
    if (!stock || parseInt(stock, 10) < 0) e.stock = "Valid stock is required";
    if (selectedSizes.length === 0) e.sizes = "Select at least one size";
    if (selectedColors.length === 0) e.colors = "Select at least one color";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const newId = (
      Math.max(0, ...products.map((p) => parseInt(p.id, 10)).filter(n => !isNaN(n))) + 1
    ).toString();

    setSubmitting(true);
    try {
      await addProduct({
        id: newId,
        name: name.trim(),
        price: parseFloat(price),
        originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
        image: imageUrl.trim(),
        images: [imageUrl.trim()],
        category,
        onSale,
        isNew,
        colors: selectedColors,
        sizes: selectedSizes,
        description: description.trim(),
        details: details.filter((d) => d.trim() !== ""),
        rating: 0,
        reviewCount: 0,
        stock: parseInt(stock, 10),
      });
      setLocation("/admin/products");
    } catch (err) {
      console.error("Failed to add product:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="text-gray-500 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h2 className="text-2xl font-extrabold text-white">
              Add New Product
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Fill in the details below to add a product to your catalog
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-5">
            <h3 className="text-sm font-bold text-white uppercase tracking-wide">
              Basic Information
            </h3>

            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400 block mb-2">
                Product Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Premium Silk Evening Gown"
                className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg text-sm outline-none focus:border-amber-500 transition-colors placeholder:text-gray-600"
              />
              {errors.name && (
                <p className="text-xs text-red-400 mt-1">{errors.name}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 block mb-2">
                  Price (GH₵) *
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg text-sm outline-none focus:border-amber-500 transition-colors placeholder:text-gray-600"
                />
                {errors.price && (
                  <p className="text-xs text-red-400 mt-1">{errors.price}</p>
                )}
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 block mb-2">
                  Original Price (optional)
                </label>
                <input
                  type="number"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                  placeholder="For sale items"
                  min="0"
                  step="0.01"
                  className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg text-sm outline-none focus:border-amber-500 transition-colors placeholder:text-gray-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 block mb-2">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg text-sm outline-none focus:border-amber-500 cursor-pointer"
                >
                  {CATEGORY_OPTIONS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 block mb-2">
                  Image URL *
                </label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg text-sm outline-none focus:border-amber-500 transition-colors placeholder:text-gray-600"
                />
                {errors.imageUrl && (
                  <p className="text-xs text-red-400 mt-1">{errors.imageUrl}</p>
                )}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400 block mb-2">
                Initial Stock *
              </label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="10"
                min="0"
                className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg text-sm outline-none focus:border-amber-500 transition-colors placeholder:text-gray-600"
              />
              {errors.stock && (
                <p className="text-xs text-red-400 mt-1">{errors.stock}</p>
              )}
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400 block mb-2">
                Description *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Describe the product..."
                className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg text-sm outline-none focus:border-amber-500 transition-colors placeholder:text-gray-600 resize-none"
              />
              {errors.description && (
                <p className="text-xs text-red-400 mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Flags */}
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={onSale}
                  onChange={(e) => setOnSale(e.target.checked)}
                  className="w-4 h-4 accent-amber-500"
                />
                <span className="text-sm text-gray-300 font-medium">
                  On Sale
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isNew}
                  onChange={(e) => setIsNew(e.target.checked)}
                  className="w-4 h-4 accent-amber-500"
                />
                <span className="text-sm text-gray-300 font-medium">
                  Mark as New
                </span>
              </label>
            </div>
          </div>

          {/* Sizes */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wide">
              Sizes *
            </h3>
            <div className="flex flex-wrap gap-2">
              {SIZE_OPTIONS.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => toggleSize(size)}
                  className={`px-4 py-2 text-xs font-bold rounded-lg border transition-colors ${
                    selectedSizes.includes(size)
                      ? "border-amber-500 bg-amber-500/10 text-amber-400"
                      : "border-gray-700 text-gray-500 hover:border-gray-600 hover:text-gray-300"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
            {errors.sizes && (
              <p className="text-xs text-red-400">{errors.sizes}</p>
            )}
          </div>

          {/* Colors */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wide">
              Colors *
            </h3>
            <div className="flex flex-wrap gap-3">
              {COLOR_PRESETS.map((color) => (
                <button
                  key={color.code}
                  type="button"
                  onClick={() => toggleColor(color.code)}
                  className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg border transition-colors ${
                    selectedColors.includes(color.code)
                      ? "border-amber-500 bg-amber-500/10 text-amber-400"
                      : "border-gray-700 text-gray-400 hover:border-gray-600"
                  }`}
                >
                  <span
                    className="w-4 h-4 rounded-full border border-gray-600"
                    style={{ backgroundColor: color.code }}
                  />
                  {color.name}
                </button>
              ))}
            </div>
            {errors.colors && (
              <p className="text-xs text-red-400">{errors.colors}</p>
            )}
          </div>

          {/* Product Details */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                Product Details
              </h3>
              <button
                type="button"
                onClick={addDetail}
                className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
              >
                <Plus size={12} /> Add Detail
              </button>
            </div>
            {details.map((detail, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={detail}
                  onChange={(e) => updateDetail(idx, e.target.value)}
                  placeholder="e.g. 100% premium silk fabric"
                  className="flex-1 bg-gray-800 border border-gray-700 text-white px-4 py-2.5 rounded-lg text-sm outline-none focus:border-amber-500 transition-colors placeholder:text-gray-600"
                />
                {details.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeDetail(idx)}
                    className="text-gray-600 hover:text-red-400 transition-colors"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Submit */}
          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="bg-gradient-to-r from-amber-500 to-amber-600 text-black px-8 py-3 rounded-lg font-bold text-sm uppercase tracking-wide hover:from-amber-400 hover:to-amber-500 transition-all disabled:opacity-50"
            >
              {submitting ? "Adding..." : "Add Product"}
            </button>
            <Link
              href="/admin/products"
              className="text-gray-500 hover:text-white text-sm font-medium transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
