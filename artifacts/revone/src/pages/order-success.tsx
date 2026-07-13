import { useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { CheckCircle2, Package, Truck, MailCheck, ArrowRight } from "lucide-react";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/ui/product-card";
import { formatPrice } from "@/lib/currency";
import { useProductStore } from "@/context/ProductStore";

function useSearchParam(key: string) {
  if (typeof window === "undefined") return "";
  const params = new URLSearchParams(window.location.search);
  return params.get(key) || "";
}

export default function OrderSuccessPage() {
  const ref = useSearchParam("ref");
  const method = useSearchParam("method");
  const isPOD = method === "pod";
  const { products } = useProductStore();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const suggestedProducts = products.slice(0, 4);

  const steps = [
    {
      icon: <MailCheck size={20} />,
      label: "Confirmation sent",
      desc: "Check your inbox for the order confirmation email.",
      done: true,
    },
    {
      icon: <Package size={20} />,
      label: "Order being packed",
      desc: "Your items are being carefully packaged in our warehouse.",
      done: false,
    },
    {
      icon: <Truck size={20} />,
      label: "Out for delivery",
      desc: `Estimated arrival in ${isPOD ? "2-4" : "3-5"} business days.`,
      done: false,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <AnnouncementBar />
      <Header />

      <main className="flex-1 bg-white">
        {/* Success Hero */}
        <section className="bg-[#FAF8F5] py-20 px-4">
          <div className="container mx-auto max-w-2xl text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 14 }}
              className="w-20 h-20 bg-black rounded-full flex items-center justify-center mx-auto mb-8"
            >
              <CheckCircle2 size={36} className="text-white" />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {isPOD ? "Order Confirmed!" : "Payment Successful!"}
              </h1>
              <p className="text-gray-500 text-lg mb-6">
                {isPOD
                  ? "Your order has been placed. Pay when your items are delivered."
                  : "Your payment was processed successfully. We're getting your order ready."}
              </p>

              {ref && (
                <div className="inline-block bg-white border border-gray-200 px-6 py-3 text-sm">
                  <span className="text-gray-500">Order Reference: </span>
                  <strong className="font-mono text-black">{ref}</strong>
                </div>
              )}
            </motion.div>
          </div>
        </section>

        {/* Order Status Timeline */}
        <section className="container mx-auto max-w-3xl px-4 py-16">
          <h2 className="text-2xl font-bold mb-8 text-center">What happens next?</h2>
          <div className="relative">
            <div className="absolute left-6 top-6 bottom-6 w-px bg-gray-200" />
            <div className="space-y-8">
              {steps.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * (i + 1) }}
                  className="flex items-start gap-6"
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${s.done ? "bg-black text-white" : "bg-white border-2 border-gray-200 text-gray-400"}`}>
                    {s.icon}
                  </div>
                  <div className="pt-2">
                    <h3 className={`font-semibold ${s.done ? "text-black" : "text-gray-400"}`}>{s.label}</h3>
                    <p className={`text-sm mt-1 ${s.done ? "text-gray-600" : "text-gray-400"}`}>{s.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTAs */}
        <section className="container mx-auto max-w-lg px-4 pb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/shop"
              data-testid="link-continue-shopping"
              className="flex items-center justify-center gap-2 bg-black text-white py-4 rounded-full font-bold text-sm uppercase tracking-wide hover:bg-gray-800 transition-colors"
            >
              Continue Shopping <ArrowRight size={16} />
            </Link>
            <Link
              href="/"
              data-testid="link-go-home"
              className="flex items-center justify-center border-2 border-black text-black py-4 rounded-full font-bold text-sm uppercase tracking-wide hover:bg-black hover:text-white transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </section>

        {/* You might also like */}
        <section className="container mx-auto px-4 pb-20 border-t border-gray-100 pt-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-2 text-center">You Might Also Like</h2>
          <p className="text-gray-500 text-center text-sm mb-10">Discover more pieces from our collection</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {suggestedProducts.map(p => (
              <ProductCard key={p.id} {...p} price={formatPrice(p.price)} originalPrice={p.originalPrice ? formatPrice(p.originalPrice) : undefined} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
