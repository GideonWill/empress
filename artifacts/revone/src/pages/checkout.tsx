import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, CreditCard, Truck, Shield, ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import { Link } from "wouter";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";

declare global {
  interface Window {
    PaystackPop: {
      setup: (config: {
        key: string;
        email: string;
        amount: number;
        currency: string;
        ref: string;
        firstname?: string;
        lastname?: string;
        metadata?: Record<string, unknown>;
        callback: (response: { reference: string }) => void;
        onClose: () => void;
      }) => { openIframe: () => void };
    };
  }
}

type Step = "contact" | "shipping" | "payment";
type PaymentMethod = "paystack" | "pod";

interface FormData {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  saveInfo: boolean;
}

const STEPS: { id: Step; label: string }[] = [
  { id: "contact", label: "Contact" },
  { id: "shipping", label: "Shipping" },
  { id: "payment", label: "Payment" },
];

function StepIndicator({ current }: { current: Step }) {
  const idx = STEPS.findIndex(s => s.id === current);
  return (
    <div className="flex items-center justify-center gap-0 mb-10">
      {STEPS.map((step, i) => (
        <div key={step.id} className="flex items-center">
          <div className={`flex flex-col items-center ${i <= idx ? "text-black" : "text-gray-300"}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${i < idx ? "bg-black border-black text-white" : i === idx ? "border-black text-black bg-white" : "border-gray-200 text-gray-300"}`}>
              {i < idx ? <CheckCircle2 size={16} className="fill-white text-white" /> : i + 1}
            </div>
            <span className="text-xs font-medium mt-1.5 hidden sm:block">{step.label}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`h-px w-16 sm:w-24 mx-1 sm:mx-2 transition-colors ${i < idx ? "bg-black" : "bg-gray-200"}`} />
          )}
        </div>
      ))}
    </div>
  );
}

export default function CheckoutPage() {
  const { items, totalPrice, totalItems, clearCart } = useCart();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [step, setStep] = useState<Step>("contact");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("paystack");
  const [isProcessing, setIsProcessing] = useState(false);
  const [form, setForm] = useState<FormData>({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "Nigeria",
    saveInfo: false,
  });

  const shipping = totalPrice >= 100 ? 0 : 9.99;
  const tax = totalPrice * 0.075;
  const orderTotal = totalPrice + shipping + tax;

  function update(field: keyof FormData, value: string | boolean) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  function generateRef() {
    return `REV-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }

  function handleNextStep() {
    if (step === "contact") {
      if (!form.email || !form.firstName || !form.lastName || !form.phone) {
        toast({ title: "Please fill all contact fields", variant: "destructive" });
        return;
      }
      setStep("shipping");
    } else if (step === "shipping") {
      if (!form.address || !form.city || !form.state || !form.zip) {
        toast({ title: "Please fill all shipping fields", variant: "destructive" });
        return;
      }
      setStep("payment");
    }
  }

  function handlePaystack() {
    setIsProcessing(true);
    const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || "pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

    if (!window.PaystackPop) {
      toast({ title: "Paystack not loaded. Please refresh.", variant: "destructive" });
      setIsProcessing(false);
      return;
    }

    const handler = window.PaystackPop.setup({
      key: publicKey,
      email: form.email,
      amount: Math.round(orderTotal * 100),
      currency: "NGN",
      ref: generateRef(),
      firstname: form.firstName,
      lastname: form.lastName,
      metadata: {
        custom_fields: items.map(i => ({ display_name: i.product.name, variable_name: i.product.id, value: i.quantity })),
      },
      callback(response) {
        setIsProcessing(false);
        clearCart();
        setLocation(`/order-success?ref=${response.reference}`);
      },
      onClose() {
        setIsProcessing(false);
        toast({ title: "Payment cancelled", description: "Your order has not been placed." });
      },
    });
    handler.openIframe();
  }

  function handlePayOnDelivery() {
    setIsProcessing(true);
    setTimeout(() => {
      const ref = generateRef();
      clearCart();
      setLocation(`/order-success?ref=${ref}&method=pod`);
    }, 1500);
  }

  if (items.length === 0 && !isProcessing) {
    return (
      <div className="min-h-screen flex flex-col">
        <AnnouncementBar />
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center py-32 px-4">
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <Link href="/shop" className="bg-black text-white px-8 py-3 rounded-full font-bold text-sm uppercase tracking-wide hover:bg-gray-800 transition-colors">
            Continue Shopping
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-sans bg-white">
      <AnnouncementBar />
      <Header />

      <main className="flex-1">
        {/* Header */}
        <div className="bg-[#FAF8F5] py-10 px-4 border-b border-gray-100">
          <div className="container mx-auto max-w-5xl">
            <div className="flex items-center gap-3 mb-6">
              <Link href="/cart" className="flex items-center gap-1 text-sm text-gray-500 hover:text-black transition-colors">
                <ArrowLeft size={16} /> Back to Cart
              </Link>
              <ChevronRight size={14} className="text-gray-300" />
              <span className="text-sm font-semibold">Checkout</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-6">Checkout</h1>
            <StepIndicator current={step} />
          </div>
        </div>

        <div className="container mx-auto max-w-5xl px-4 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Form Area */}
            <div className="lg:col-span-3">
              <AnimatePresence mode="wait">
                {/* CONTACT */}
                {step === "contact" && (
                  <motion.div key="contact" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <h2 className="text-xl font-bold mb-6">Contact Information</h2>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-semibold uppercase tracking-wide text-gray-600 block mb-1.5">First Name *</label>
                          <input
                            type="text"
                            value={form.firstName}
                            onChange={e => update("firstName", e.target.value)}
                            data-testid="input-first-name"
                            placeholder="John"
                            className="w-full border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black transition-colors"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-semibold uppercase tracking-wide text-gray-600 block mb-1.5">Last Name *</label>
                          <input
                            type="text"
                            value={form.lastName}
                            onChange={e => update("lastName", e.target.value)}
                            data-testid="input-last-name"
                            placeholder="Doe"
                            className="w-full border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black transition-colors"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-semibold uppercase tracking-wide text-gray-600 block mb-1.5">Email Address *</label>
                        <input
                          type="email"
                          value={form.email}
                          onChange={e => update("email", e.target.value)}
                          data-testid="input-email"
                          placeholder="john@example.com"
                          className="w-full border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black transition-colors"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold uppercase tracking-wide text-gray-600 block mb-1.5">Phone Number *</label>
                        <input
                          type="tel"
                          value={form.phone}
                          onChange={e => update("phone", e.target.value)}
                          data-testid="input-phone"
                          placeholder="+234 800 000 0000"
                          className="w-full border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black transition-colors"
                        />
                      </div>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={form.saveInfo}
                          onChange={e => update("saveInfo", e.target.checked)}
                          data-testid="input-save-info"
                          className="w-4 h-4 accent-black"
                        />
                        <span className="text-sm text-gray-600">Save my information for next time</span>
                      </label>
                    </div>
                  </motion.div>
                )}

                {/* SHIPPING */}
                {step === "shipping" && (
                  <motion.div key="shipping" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <h2 className="text-xl font-bold mb-6">Shipping Address</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-semibold uppercase tracking-wide text-gray-600 block mb-1.5">Street Address *</label>
                        <input
                          type="text"
                          value={form.address}
                          onChange={e => update("address", e.target.value)}
                          data-testid="input-address"
                          placeholder="123 Fashion Street, Apt 4B"
                          className="w-full border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black transition-colors"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-semibold uppercase tracking-wide text-gray-600 block mb-1.5">City *</label>
                          <input
                            type="text"
                            value={form.city}
                            onChange={e => update("city", e.target.value)}
                            data-testid="input-city"
                            placeholder="Lagos"
                            className="w-full border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black transition-colors"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-semibold uppercase tracking-wide text-gray-600 block mb-1.5">State / Province *</label>
                          <input
                            type="text"
                            value={form.state}
                            onChange={e => update("state", e.target.value)}
                            data-testid="input-state"
                            placeholder="Lagos State"
                            className="w-full border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black transition-colors"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-semibold uppercase tracking-wide text-gray-600 block mb-1.5">Postal / ZIP Code *</label>
                          <input
                            type="text"
                            value={form.zip}
                            onChange={e => update("zip", e.target.value)}
                            data-testid="input-zip"
                            placeholder="100001"
                            className="w-full border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black transition-colors"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-semibold uppercase tracking-wide text-gray-600 block mb-1.5">Country</label>
                          <select
                            value={form.country}
                            onChange={e => update("country", e.target.value)}
                            data-testid="select-country"
                            className="w-full border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black transition-colors bg-white"
                          >
                            <option>Nigeria</option>
                            <option>Ghana</option>
                            <option>Kenya</option>
                            <option>South Africa</option>
                            <option>United States</option>
                            <option>United Kingdom</option>
                          </select>
                        </div>
                      </div>
                      {/* Shipping methods */}
                      <div className="mt-6">
                        <h3 className="text-sm font-semibold uppercase tracking-wide mb-3">Shipping Method</h3>
                        <div className="space-y-3">
                          <label className="flex items-center justify-between border border-black bg-gray-50 px-4 py-3 cursor-pointer">
                            <div className="flex items-center gap-3">
                              <input type="radio" name="shipping" defaultChecked className="accent-black" />
                              <span className="text-sm font-medium">Standard Delivery (3-5 days)</span>
                            </div>
                            <span className="text-sm font-bold">{totalPrice >= 100 ? "FREE" : "$9.99"}</span>
                          </label>
                          <label className="flex items-center justify-between border border-gray-200 px-4 py-3 cursor-pointer hover:border-black transition-colors">
                            <div className="flex items-center gap-3">
                              <input type="radio" name="shipping" className="accent-black" />
                              <span className="text-sm font-medium">Express Delivery (1-2 days)</span>
                            </div>
                            <span className="text-sm font-bold">$19.99</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* PAYMENT */}
                {step === "payment" && (
                  <motion.div key="payment" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <h2 className="text-xl font-bold mb-6">Payment Method</h2>

                    <div className="space-y-4 mb-8">
                      {/* Paystack */}
                      <label
                        data-testid="payment-method-paystack"
                        className={`flex items-start gap-4 border-2 p-4 cursor-pointer transition-colors ${paymentMethod === "paystack" ? "border-black bg-gray-50" : "border-gray-200 hover:border-gray-400"}`}
                        onClick={() => setPaymentMethod("paystack")}
                      >
                        <div className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center flex-shrink-0 ${paymentMethod === "paystack" ? "border-black" : "border-gray-300"}`}>
                          {paymentMethod === "paystack" && <div className="w-2.5 h-2.5 rounded-full bg-black" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-sm">Pay with Paystack</span>
                            <div className="flex items-center gap-1.5 text-xs font-bold text-[#00C3F7] bg-[#E8F9FE] px-2 py-0.5 rounded">
                              <CreditCard size={12} /> PAYSTACK
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">Card, bank transfer, USSD & more — powered by Paystack</p>
                          {paymentMethod === "paystack" && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-4 space-y-3">
                              <div className="bg-blue-50 border border-blue-100 px-4 py-3 text-sm text-blue-700 flex items-center gap-2">
                                <Shield size={14} />
                                <span>You'll be redirected to Paystack's secure payment page</span>
                              </div>
                              <div className="text-xs text-gray-400">
                                Accepted: Visa, Mastercard, Verve, Bank Transfer, USSD
                              </div>
                            </motion.div>
                          )}
                        </div>
                      </label>

                      {/* Pay on Delivery */}
                      <label
                        data-testid="payment-method-pod"
                        className={`flex items-start gap-4 border-2 p-4 cursor-pointer transition-colors ${paymentMethod === "pod" ? "border-black bg-gray-50" : "border-gray-200 hover:border-gray-400"}`}
                        onClick={() => setPaymentMethod("pod")}
                      >
                        <div className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center flex-shrink-0 ${paymentMethod === "pod" ? "border-black" : "border-gray-300"}`}>
                          {paymentMethod === "pod" && <div className="w-2.5 h-2.5 rounded-full bg-black" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-sm">Pay on Delivery</span>
                            <div className="flex items-center gap-1.5 text-xs font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded">
                              <Truck size={12} /> CASH / POS
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">Pay cash or via POS when your order is delivered</p>
                          {paymentMethod === "pod" && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-4 bg-green-50 border border-green-100 px-4 py-3 text-sm text-green-700">
                              Your order will be confirmed and dispatched. Pay when it arrives at your door.
                            </motion.div>
                          )}
                        </div>
                      </label>
                    </div>

                    {/* Order summary confirm */}
                    <div className="border-t border-gray-100 pt-6 text-sm text-gray-500">
                      <p>Delivering to: <strong className="text-black">{form.firstName} {form.lastName}</strong></p>
                      <p className="mt-1">{form.address}, {form.city}, {form.state} {form.zip}</p>
                      <p className="mt-1">{form.email} · {form.phone}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
                {step !== "contact" ? (
                  <button
                    onClick={() => setStep(step === "payment" ? "shipping" : "contact")}
                    data-testid="button-back"
                    className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-black transition-colors"
                  >
                    <ArrowLeft size={16} /> Back
                  </button>
                ) : (
                  <div />
                )}

                {step !== "payment" ? (
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={handleNextStep}
                    data-testid="button-next-step"
                    className="bg-black text-white px-10 py-3.5 rounded-full font-bold text-sm uppercase tracking-wide hover:bg-gray-800 transition-colors flex items-center gap-2"
                  >
                    Continue <ChevronRight size={16} />
                  </motion.button>
                ) : (
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    disabled={isProcessing}
                    onClick={paymentMethod === "paystack" ? handlePaystack : handlePayOnDelivery}
                    data-testid="button-place-order"
                    className="bg-black text-white px-10 py-3.5 rounded-full font-bold text-sm uppercase tracking-wide hover:bg-gray-800 transition-colors flex items-center gap-2 disabled:opacity-70"
                  >
                    {isProcessing ? (
                      <><Loader2 size={16} className="animate-spin" /> Processing…</>
                    ) : paymentMethod === "paystack" ? (
                      <><CreditCard size={16} /> Pay ${orderTotal.toFixed(2)}</>
                    ) : (
                      <><Truck size={16} /> Place Order</>
                    )}
                  </motion.button>
                )}
              </div>
            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-2">
              <div className="bg-[#FAF8F5] p-6 sticky top-28">
                <h3 className="font-bold text-sm uppercase tracking-wide mb-5">Order Summary</h3>

                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-1">
                  {items.map(item => (
                    <div key={`${item.product.id}-${item.selectedSize}`} className="flex gap-3">
                      <div className="relative w-16 h-20 flex-shrink-0 bg-white overflow-hidden">
                        <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-black text-white text-[10px] font-bold rounded-full flex items-center justify-center">{item.quantity}</span>
                      </div>
                      <div className="flex-1 flex flex-col justify-center">
                        <p className="text-sm font-medium leading-snug">{item.product.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">Size: {item.selectedSize}</p>
                        <p className="text-sm font-bold mt-1">${(item.product.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 pt-4 space-y-3 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({totalItems} items)</span>
                    <span className="font-semibold">${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className={`font-semibold ${shipping === 0 ? "text-green-600" : ""}`}>
                      {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax</span>
                    <span className="font-semibold">${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-base pt-2 border-t border-gray-200">
                    <span>Total</span>
                    <span>${orderTotal.toFixed(2)}</span>
                  </div>
                </div>

                <div className="mt-5 flex items-center gap-2 text-xs text-gray-400 border-t border-gray-200 pt-4">
                  <Shield size={12} />
                  <span>256-bit SSL encryption — your data is safe</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
