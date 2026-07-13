import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/ui/product-card";
import { User, ShoppingBag, MapPin, Heart, LogOut } from "lucide-react";
import { formatPrice } from "@/lib/currency";

export default function Profile() {
  const { user, logout } = useAuth();
  const { items: wishlistItems } = useWishlist();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<"profile" | "orders" | "addresses" | "wishlist">("profile");

  // Mock Orders Data
  const [orders] = useState([
    {
      id: "EMP-94038",
      date: "July 10, 2026",
      status: "Delivered",
      total: 380.0,
      items: ["Luxury Body Wave Lace Front Wig x1"],
    },
    {
      id: "EMP-91823",
      date: "June 25, 2026",
      status: "Shipped",
      total: 185.0,
      items: ["Purple Square-Toe Buckle Slide x1", "Olive Green Buckle Slide x1"],
    },
  ]);

  // Mock Addresses Data
  const [addresses, setAddresses] = useState([
    {
      id: "1",
      label: "Home (Primary)",
      fullName: "Jane Doe",
      street: "123 Elegance Boulevard, Apt 4B",
      city: "New York",
      state: "NY",
      zip: "10001",
      phone: "+1 (555) 019-2834",
    },
  ]);

  const [newAddress, setNewAddress] = useState({
    label: "",
    fullName: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
  });

  const [showAddressForm, setShowAddressForm] = useState(false);

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddress.fullName || !newAddress.street) return;
    setAddresses((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        ...newAddress,
      },
    ]);
    setNewAddress({
      label: "",
      fullName: "",
      street: "",
      city: "",
      state: "",
      zip: "",
      phone: "",
    });
    setShowAddressForm(false);
  };

  const handleSignOut = async () => {
    await logout();
    setLocation("/");
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-white">
      <Header />

      <main className="flex-1 bg-[#FAF8F5] py-12 px-4 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center md:text-left mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
              My Account
            </h1>
            <p className="text-gray-500 text-sm mt-2">
              Manage your personal dashboard, shipping locations, and secure session preferences.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar Navigation */}
            <aside className="w-full md:w-64 flex-shrink-0">
              <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm space-y-1">
                {[
                  { id: "profile", label: "Profile Details", icon: User },
                  { id: "orders", label: "My Orders", icon: ShoppingBag },
                  { id: "addresses", label: "Saved Addresses", icon: MapPin },
                  { id: "wishlist", label: "Wishlist", icon: Heart },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isSelected = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-semibold rounded-2xl transition-all ${
                        isSelected
                          ? "bg-black text-white shadow-md shadow-black/10"
                          : "text-gray-600 hover:bg-gray-50 hover:text-black"
                      }`}
                    >
                      <Icon size={16} />
                      {tab.label}
                      {tab.id === "wishlist" && wishlistItems.length > 0 && (
                        <span
                          className={`ml-auto text-xs px-2 py-0.5 rounded-full font-bold ${
                            isSelected ? "bg-white text-black" : "bg-black text-white"
                          }`}
                        >
                          {wishlistItems.length}
                        </span>
                      )}
                    </button>
                  );
                })}

                <div className="border-t border-gray-100 my-4 pt-4">
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-3 w-full px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-2xl transition-colors"
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </div>
              </div>
            </aside>

            {/* Dashboard Panels */}
            <section className="flex-1 min-h-[400px]">
              <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-sm">
                
                {/* 1. Profile Panel */}
                {activeTab === "profile" && user && (
                  <div className="space-y-8 animate-fade-in">
                    <div className="flex flex-col sm:flex-row items-center gap-5 pb-6 border-b border-gray-100">
                      <div className="w-20 h-20 rounded-full border border-gray-100 bg-gray-50 flex items-center justify-center overflow-hidden">
                        {user.profileImage ? (
                          <img src={user.profileImage} alt={user.fullName} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-2xl font-bold text-gray-400">{user.fullName[0]}</span>
                        )}
                      </div>
                      <div className="text-center sm:text-left space-y-1">
                        <h2 className="text-xl font-bold text-gray-900">{user.fullName}</h2>
                        <span className="inline-block bg-purple-50 text-purple-700 text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded">
                          Connected via {user.authProvider}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                      <div className="space-y-1">
                        <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Email Address</span>
                        <p className="font-semibold text-gray-800">{user.email}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Account Created</span>
                        <p className="font-semibold text-gray-800">
                          {new Date(user.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. My Orders Panel */}
                {activeTab === "orders" && (
                  <div className="space-y-6">
                    <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">My Orders</h2>
                    {orders.length === 0 ? (
                      <p className="text-gray-500 text-sm py-4">You have not placed any orders yet.</p>
                    ) : (
                      <div className="space-y-4">
                        {orders.map((order) => (
                          <div key={order.id} className="border border-gray-100 rounded-2xl p-5 hover:border-gray-200 transition-colors">
                            <div className="flex flex-wrap justify-between items-center gap-3 pb-3 border-b border-gray-100/50">
                              <div>
                                <span className="text-xs font-bold text-gray-400 uppercase">Order ID</span>
                                <p className="font-bold text-sm text-gray-900">{order.id}</p>
                              </div>
                              <div>
                                <span className="text-xs font-bold text-gray-400 uppercase">Placed On</span>
                                <p className="text-sm font-semibold text-gray-800">{order.date}</p>
                              </div>
                              <div>
                                <span className="text-xs font-bold text-gray-400 uppercase">Status</span>
                                <span className={`block text-[10px] font-extrabold uppercase px-2 py-0.5 rounded text-center ${
                                  order.status === "Delivered" ? "bg-green-50 text-green-700" : "bg-blue-50 text-blue-700"
                                }`}>
                                  {order.status}
                                </span>
                              </div>
                            </div>
                            <div className="pt-3">
                              <span className="text-xs font-bold text-gray-400 uppercase">Items</span>
                              <ul className="text-sm text-gray-700 font-medium mt-1">
                                {order.items.map((item, idx) => <li key={idx}>{item}</li>)}
                              </ul>
                              <p className="text-right font-bold text-gray-900 text-sm mt-2">
                                Total: {formatPrice(order.total)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 3. Saved Addresses Panel */}
                {activeTab === "addresses" && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                      <h2 className="text-lg font-bold text-gray-900">Saved Addresses</h2>
                      <button
                        onClick={() => setShowAddressForm(!showAddressForm)}
                        className="text-xs font-bold uppercase tracking-wide underline hover:text-gray-600"
                      >
                        {showAddressForm ? "Cancel" : "+ Add New"}
                      </button>
                    </div>

                    {showAddressForm && (
                      <form onSubmit={handleAddAddress} className="space-y-4 bg-gray-50/50 border border-gray-100 rounded-2xl p-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs font-bold text-gray-500 uppercase">Address Label (e.g., Home, Work)</label>
                            <input
                              type="text"
                              value={newAddress.label}
                              onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
                              className="w-full mt-1 border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white outline-none focus:border-black transition-colors"
                              placeholder="Home"
                              required
                            />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-gray-500 uppercase">Full Name</label>
                            <input
                              type="text"
                              value={newAddress.fullName}
                              onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                              className="w-full mt-1 border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white outline-none focus:border-black transition-colors"
                              placeholder="Jane Doe"
                              required
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-xs font-bold text-gray-500 uppercase">Street Address</label>
                          <input
                            type="text"
                            value={newAddress.street}
                            onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                            className="w-full mt-1 border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white outline-none focus:border-black transition-colors"
                            placeholder="123 Street Address"
                            required
                          />
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          <div className="col-span-2 sm:col-span-2">
                            <label className="text-xs font-bold text-gray-500 uppercase">City</label>
                            <input
                              type="text"
                              value={newAddress.city}
                              onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                              className="w-full mt-1 border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white outline-none focus:border-black transition-colors"
                              placeholder="New York"
                              required
                            />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-gray-500 uppercase">State</label>
                            <input
                              type="text"
                              value={newAddress.state}
                              onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                              className="w-full mt-1 border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white outline-none focus:border-black transition-colors"
                              placeholder="NY"
                              required
                            />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-gray-500 uppercase">ZIP</label>
                            <input
                              type="text"
                              value={newAddress.zip}
                              onChange={(e) => setNewAddress({ ...newAddress, zip: e.target.value })}
                              className="w-full mt-1 border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white outline-none focus:border-black transition-colors"
                              placeholder="10001"
                              required
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-xs font-bold text-gray-500 uppercase">Phone Number</label>
                          <input
                            type="text"
                            value={newAddress.phone}
                            onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                            className="w-full mt-1 border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white outline-none focus:border-black transition-colors"
                            placeholder="+1 (555) 000-0000"
                          />
                        </div>
                        <button
                          type="submit"
                          className="bg-black text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-gray-800 transition-colors"
                        >
                          Save Address
                        </button>
                      </form>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {addresses.map((address) => (
                        <div key={address.id} className="border border-gray-100 rounded-2xl p-5 hover:border-gray-200 transition-colors relative">
                          <h3 className="font-bold text-sm text-gray-900 mb-2">{address.label}</h3>
                          <div className="text-sm text-gray-600 font-medium space-y-1">
                            <p className="text-black font-semibold">{address.fullName}</p>
                            <p>{address.street}</p>
                            <p>{address.city}, {address.state} {address.zip}</p>
                            <p className="text-xs text-gray-400 mt-2">{address.phone}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. Wishlist Panel */}
                {activeTab === "wishlist" && (
                  <div className="space-y-6">
                    <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3 font-sans">
                      Wishlist Products
                    </h2>
                    {wishlistItems.length === 0 ? (
                      <p className="text-gray-500 text-sm py-4">Your wishlist is currently empty.</p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
                        {wishlistItems.map((product) => (
                          <ProductCard
                            key={product.id}
                            id={product.id}
                            name={product.name}
                            price={formatPrice(product.price)}
                            originalPrice={product.originalPrice ? formatPrice(product.originalPrice) : undefined}
                            image={product.image}
                            onSale={product.onSale}
                            isNew={product.isNew}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}

              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
