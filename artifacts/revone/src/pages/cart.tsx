import { useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, X, ShoppingBag, ArrowRight } from "lucide-react";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/currency";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalItems, totalPrice } = useCart();
  const [couponInput, setCouponInput] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [activeCoupon, setActiveCoupon] = useState("");
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");

  const coupons: Record<string, number> = {
    "WELCOME10": 0.10, // 10% off
    "EMPRESS20": 0.20, // 20% off
    "FREE50": 0.50     // 50% off
  };

  const handleApplyCoupon = () => {
    setCouponError("");
    setCouponSuccess("");
    const code = couponInput.trim().toUpperCase();
    if (!code) {
      setCouponError("Please enter a coupon code");
      return;
    }
    if (code in coupons) {
      setDiscountPercent(coupons[code]);
      setActiveCoupon(code);
      setCouponSuccess(`Coupon ${code} applied successfully!`);
    } else {
      setCouponError("Invalid coupon code");
    }
  };

  const discountAmount = totalPrice * discountPercent;
  const finalTotal = totalPrice - discountAmount;

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <AnnouncementBar />
      <Header />

      <main className="flex-1 bg-white">
        {/* Page Header */}
        <div className="bg-[#FAF8F5] py-12 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">Your Cart</h1>
            <p className="text-gray-500 text-sm">{totalItems} {totalItems === 1 ? "item" : "items"}</p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          {items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-md mx-auto text-center py-24"
            >
              <div className="w-20 h-20 border-2 border-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag size={32} className="text-gray-300" />
              </div>
              <h2 className="text-2xl font-bold mb-3">Your cart is empty</h2>
              <p className="text-gray-500 mb-8">Looks like you haven't added anything yet. Start browsing our collection.</p>
              <Link
                href="/shop"
                data-testid="link-continue-shopping"
                className="inline-block bg-black text-white px-10 py-4 rounded-full font-bold text-sm uppercase tracking-wide hover:bg-gray-800 transition-colors"
              >
                Continue Shopping
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Items */}
              <div className="lg:col-span-2">
                <div className="hidden md:grid grid-cols-12 text-xs font-semibold uppercase tracking-widest text-gray-400 pb-4 border-b border-gray-100 mb-4">
                  <span className="col-span-6">Product</span>
                  <span className="col-span-2 text-center">Price</span>
                  <span className="col-span-2 text-center">Quantity</span>
                  <span className="col-span-2 text-right">Total</span>
                </div>

                <AnimatePresence>
                  {items.map(item => (
                    <motion.div
                      key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="grid grid-cols-12 gap-4 py-6 border-b border-gray-100 items-start md:items-center"
                      data-testid={`cart-item-${item.product.id}`}
                    >
                      {/* Image + Info */}
                      <div className="col-span-12 md:col-span-6 flex gap-4">
                        <Link href={`/shop/${item.product.id}`} className="w-20 h-24 md:w-24 md:h-28 flex-shrink-0 bg-gray-50 overflow-hidden">
                          <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                        </Link>
                        <div className="flex flex-col justify-between py-1">
                          <div>
                            <Link href={`/shop/${item.product.id}`} className="font-semibold text-sm md:text-base hover:text-gray-600 transition-colors leading-snug">
                              {item.product.name}
                            </Link>
                            <div className="flex items-center gap-3 mt-2">
                              <span className="text-xs text-gray-500">Size: <strong className="text-black">{item.selectedSize}</strong></span>
                              <span className="w-4 h-4 rounded-full border border-gray-200 inline-block" style={{ backgroundColor: item.selectedColor }} />
                            </div>
                          </div>
                          <button
                            onClick={() => removeItem(item.product.id, item.selectedSize, item.selectedColor)}
                            data-testid={`remove-item-${item.product.id}`}
                            className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors w-fit mt-2"
                          >
                            <X size={12} /> Remove
                          </button>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="hidden md:flex col-span-2 justify-center">
                        <span className="text-sm font-semibold">{formatPrice(item.product.price)}</span>
                      </div>

                      {/* Quantity */}
                      <div className="col-span-7 md:col-span-2 flex justify-start md:justify-center">
                        <div className="flex items-center border border-gray-200">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.selectedSize, item.selectedColor, item.quantity - 1)}
                            data-testid={`qty-minus-${item.product.id}`}
                            className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 transition-colors text-sm"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-10 text-center text-sm font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.selectedSize, item.selectedColor, item.quantity + 1)}
                            data-testid={`qty-plus-${item.product.id}`}
                            className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 transition-colors text-sm"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>

                      {/* Total */}
                      <div className="col-span-5 md:col-span-2 flex justify-end items-center">
                        <span className="text-sm font-bold">{formatPrice(item.product.price * item.quantity)}</span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                <div className="mt-6 flex flex-col sm:flex-row gap-4 items-start">
                  <div className="flex-1 flex flex-col gap-2 w-full">
                    <div className="flex border border-gray-200 overflow-hidden rounded-full w-full bg-white">
                      <input
                        type="text"
                        placeholder="Coupon code (WELCOME10, EMPRESS20)"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        data-testid="input-coupon"
                        className="flex-1 px-5 text-sm outline-none bg-transparent"
                      />
                      <button
                        onClick={handleApplyCoupon}
                        data-testid="button-apply-coupon"
                        className="px-6 py-3 bg-black text-white text-sm font-bold uppercase tracking-wide hover:bg-gray-800 transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                    {couponError && <p className="text-xs text-red-500 font-medium px-4">{couponError}</p>}
                    {couponSuccess && <p className="text-xs text-green-600 font-medium px-4">{couponSuccess}</p>}
                  </div>
                  <Link
                    href="/shop"
                    data-testid="link-back-shop"
                    className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide border border-gray-300 px-6 py-3 rounded-full hover:border-black transition-colors justify-center whitespace-nowrap"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-[#FAF8F5] p-6 sticky top-28">
                  <h2 className="text-lg font-bold uppercase tracking-wide mb-6">Order Summary</h2>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal ({totalItems} items)</span>
                      <span className="font-semibold">{formatPrice(totalPrice)}</span>
                    </div>
                    {discountPercent > 0 && (
                      <div className="flex justify-between text-sm text-green-600 font-semibold">
                        <span>Discount ({activeCoupon})</span>
                        <span>-{formatPrice(discountAmount)}</span>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-gray-200 pt-4 mb-6">
                    <div className="flex justify-between">
                      <span className="font-bold uppercase tracking-wide text-sm">Order Total</span>
                      <span className="font-bold text-xl">{formatPrice(finalTotal)}</span>
                    </div>
                  </div>

                  <Link
                    href="/checkout"
                    data-testid="button-checkout"
                    className="w-full bg-black text-white py-4 rounded-full font-bold text-sm uppercase tracking-wide flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
                  >
                    Proceed to Checkout <ArrowRight size={16} />
                  </Link>

                  <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
                    <span>Secure checkout</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
