import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { formatPrice } from "@/lib/currency";
import { Search, MapPin, Truck, CheckCircle2, Clock, Calendar, ArrowRight, ShieldCheck, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface OrderTrackingInfo {
  id: string;
  customerName: string;
  date: string;
  items: string[];
  total: number;
  status: "Pending" | "Processing" | "Delivered" | "Cancelled";
  estDelivery: string;
  shippingAddress: string;
}

const MOCK_TRACK_DATA: Record<string, OrderTrackingInfo[]> = {
  "0201234567": [
    {
      id: "EMP-10042",
      customerName: "Akua Mensah",
      date: "Jul 13, 2026",
      items: ["Sleek HD Lace Frontal Wig x1", "Purple Square-Toe Buckle Slide x1"],
      total: 380,
      status: "Delivered",
      estDelivery: "Delivered on Jul 13, 2026",
      shippingAddress: "House 15, Ring Road, Accra, Ghana",
    },
  ],
  "201234567": [
    {
      id: "EMP-10042",
      customerName: "Akua Mensah",
      date: "Jul 13, 2026",
      items: ["Sleek HD Lace Frontal Wig x1", "Purple Square-Toe Buckle Slide x1"],
      total: 380,
      status: "Delivered",
      estDelivery: "Delivered on Jul 13, 2026",
      shippingAddress: "House 15, Ring Road, Accra, Ghana",
    },
  ],
  "0249876543": [
    {
      id: "EMP-10041",
      customerName: "Kofi Asante",
      date: "Jul 13, 2026",
      items: ["Elegant Emerald Silk Slip Dress x1"],
      total: 245,
      status: "Processing",
      estDelivery: "July 16, 2026",
      shippingAddress: "Plot 24, Kumasi Highway, Kumasi, Ghana",
    },
  ],
  "249876543": [
    {
      id: "EMP-10041",
      customerName: "Kofi Asante",
      date: "Jul 13, 2026",
      items: ["Elegant Emerald Silk Slip Dress x1"],
      total: 245,
      status: "Processing",
      estDelivery: "July 16, 2026",
      shippingAddress: "Plot 24, Kumasi Highway, Kumasi, Ghana",
    },
  ],
  "0275551234": [
    {
      id: "EMP-10040",
      customerName: "Ama Owusu",
      date: "Jul 12, 2026",
      items: ["Luxury Body Wave Lace Front Wig x1", "Pleated Black Midi Designer Dress x1"],
      total: 520,
      status: "Pending",
      estDelivery: "July 17, 2026",
      shippingAddress: "Block E, East Legon, Accra, Ghana",
    },
  ],
  "275551234": [
    {
      id: "EMP-10040",
      customerName: "Ama Owusu",
      date: "Jul 12, 2026",
      items: ["Luxury Body Wave Lace Front Wig x1", "Pleated Black Midi Designer Dress x1"],
      total: 520,
      status: "Pending",
      estDelivery: "July 17, 2026",
      shippingAddress: "Block E, East Legon, Accra, Ghana",
    },
  ],
  "0503334444": [
    {
      id: "EMP-10039",
      customerName: "Kwame Boateng",
      date: "Jul 12, 2026",
      items: ["Olive Green Buckle Slide x2"],
      total: 185,
      status: "Delivered",
      estDelivery: "Delivered on Jul 12, 2026",
      shippingAddress: "Room 10, North Ridge Hotel area, Takoradi, Ghana",
    },
  ],
  "503334444": [
    {
      id: "EMP-10039",
      customerName: "Kwame Boateng",
      date: "Jul 12, 2026",
      items: ["Olive Green Buckle Slide x2"],
      total: 185,
      status: "Delivered",
      estDelivery: "Delivered on Jul 12, 2026",
      shippingAddress: "Room 10, North Ridge Hotel area, Takoradi, Ghana",
    },
  ],
  "0208889999": [
    {
      id: "EMP-10038",
      customerName: "Efua Adjei",
      date: "Jul 11, 2026",
      items: ["Luxury Floral Chiffon Wrap Dress x1"],
      total: 310,
      status: "Cancelled",
      estDelivery: "Cancelled",
      shippingAddress: "House 2, Spintex Road, Accra, Ghana",
    },
  ],
  "208889999": [
    {
      id: "EMP-10038",
      customerName: "Efua Adjei",
      date: "Jul 11, 2026",
      items: ["Luxury Floral Chiffon Wrap Dress x1"],
      total: 310,
      status: "Cancelled",
      estDelivery: "Cancelled",
      shippingAddress: "House 2, Spintex Road, Accra, Ghana",
    },
  ],
};

const STEP_DETAILS = {
  Pending: { index: 0, label: "Order Received", desc: "We have received your order and are validating details." },
  Processing: { index: 1, label: "Packing & Preparing", desc: "Your items are being packed and checked for quality." },
  OutForDelivery: { index: 2, label: "Out for Delivery", desc: "Our logistics courier is bringing your package." },
  Delivered: { index: 3, label: "Delivered", desc: "The order was successfully delivered and signed." },
};

export default function TrackOrder() {
  const [phone, setPhone] = useState("");
  const [searchResults, setSearchResults] = useState<OrderTrackingInfo[] | null>(null);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSearchResults(null);
    setSearched(true);

    // Normalize phone number (remove spaces, dashes, +233 prefix)
    let cleanPhone = phone.replace(/[\s\-\+]/g, "");
    if (cleanPhone.startsWith("233")) {
      cleanPhone = cleanPhone.substring(3);
    }
    
    // Look up
    if (cleanPhone in MOCK_TRACK_DATA) {
      setSearchResults(MOCK_TRACK_DATA[cleanPhone]);
    } else {
      setError("No orders found for this phone number. Please check the digits and try again.");
    }
  };

  const getStepStatus = (orderStatus: string, stepIndex: number): "done" | "active" | "todo" => {
    if (orderStatus === "Cancelled") return "todo";
    
    let currentActiveIndex = 0;
    if (orderStatus === "Pending") currentActiveIndex = 0;
    else if (orderStatus === "Processing") currentActiveIndex = 1;
    else if (orderStatus === "Delivered") currentActiveIndex = 3;

    if (stepIndex < currentActiveIndex) return "done";
    if (stepIndex === currentActiveIndex) return "active";
    return "todo";
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-white">
      <Header />

      <main className="flex-1 bg-[#FAF8F5] pb-24">
        {/* Banner Section */}
        <section className="bg-black text-white py-16 text-center px-4 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="container mx-auto max-w-xl relative space-y-4">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Track Your Delivery</h1>
            <p className="text-gray-400 text-sm max-w-sm mx-auto">
              Enter the phone number associated with your order to see live delivery updates.
            </p>
          </div>
        </section>

        {/* Input area */}
        <div className="container mx-auto px-4 -mt-8 max-w-2xl relative z-10">
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl border border-gray-100 space-y-6">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="e.g. +233 20 123 4567 or 0249876543"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 text-black pl-4 pr-4 py-3.5 rounded-2xl text-sm outline-none focus:border-black focus:bg-white transition-all font-semibold"
                />
              </div>
              <button
                type="submit"
                className="bg-black text-white hover:bg-gray-800 px-8 py-3.5 rounded-2xl font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
              >
                Track Order <ArrowRight size={16} />
              </button>
            </form>

            {error && (
              <div className="flex items-center gap-2.5 text-red-500 bg-red-50 border border-red-100 rounded-2xl p-4 text-xs font-semibold">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}
          </div>
        </div>

        {/* Tracking Details */}
        <div className="container mx-auto px-4 mt-8 max-w-2xl">
          <AnimatePresence mode="wait">
            {searchResults && searchResults.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 md:p-8 space-y-8"
              >
                {/* Header summary info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-5 gap-4">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-500">Order ID</span>
                    <h2 className="text-xl font-extrabold text-black">{order.id}</h2>
                    <p className="text-xs text-gray-400 mt-0.5">Placed on {order.date}</p>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400">Estimated Delivery</span>
                    <p className="text-sm font-bold text-black flex items-center gap-1 sm:justify-end mt-0.5">
                      <Clock size={14} className="text-amber-500" />
                      {order.estDelivery}
                    </p>
                  </div>
                </div>

                {/* Progress bar visualizer */}
                {order.status === "Cancelled" ? (
                  <div className="bg-red-50 border border-red-100 rounded-2xl p-5 text-center space-y-2">
                    <h3 className="font-extrabold text-red-500 text-sm">Delivery Cancelled</h3>
                    <p className="text-xs text-red-400 max-w-xs mx-auto">
                      This order has been cancelled. If you need any assistance, contact our Customer Support team.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <h3 className="text-xs font-extrabold uppercase tracking-widest text-gray-400">Delivery Status</h3>
                    
                    <div className="relative pl-8 border-l border-gray-200 ml-4 space-y-8">
                      {/* Step 1: Placed */}
                      <div className="relative">
                        <div className={`absolute -left-12 top-0.5 w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                          getStepStatus(order.status, 0) === "done" || getStepStatus(order.status, 0) === "active"
                            ? "bg-black border-black text-white"
                            : "bg-white border-gray-200 text-gray-400"
                        }`}>
                          <CheckCircle2 size={16} />
                        </div>
                        <h4 className={`text-sm font-bold ${getStepStatus(order.status, 0) === "active" ? "text-black" : "text-gray-500"}`}>
                          Order Confirmed
                        </h4>
                        <p className="text-xs text-gray-400 mt-1">{STEP_DETAILS.Pending.desc}</p>
                      </div>

                      {/* Step 2: Processing */}
                      <div className="relative">
                        <div className={`absolute -left-12 top-0.5 w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                          getStepStatus(order.status, 1) === "done"
                            ? "bg-black border-black text-white"
                            : getStepStatus(order.status, 1) === "active"
                            ? "bg-amber-500 border-amber-500 text-black"
                            : "bg-white border-gray-200 text-gray-400"
                        }`}>
                          <Calendar size={16} />
                        </div>
                        <h4 className={`text-sm font-bold ${getStepStatus(order.status, 1) === "active" ? "text-black" : "text-gray-500"}`}>
                          Packing & Ready
                        </h4>
                        <p className="text-xs text-gray-400 mt-1">{STEP_DETAILS.Processing.desc}</p>
                      </div>

                      {/* Step 3: Out for delivery */}
                      <div className="relative">
                        <div className={`absolute -left-12 top-0.5 w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                          getStepStatus(order.status, 2) === "done"
                            ? "bg-black border-black text-white"
                            : getStepStatus(order.status, 2) === "active"
                            ? "bg-amber-500 border-amber-500 text-black"
                            : "bg-white border-gray-200 text-gray-400"
                        }`}>
                          <Truck size={16} />
                        </div>
                        <h4 className={`text-sm font-bold ${getStepStatus(order.status, 2) === "active" ? "text-black" : "text-gray-500"}`}>
                          Out for Delivery
                        </h4>
                        <p className="text-xs text-gray-400 mt-1">{STEP_DETAILS.OutForDelivery.desc}</p>
                      </div>

                      {/* Step 4: Delivered */}
                      <div className="relative">
                        <div className={`absolute -left-12 top-0.5 w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                          getStepStatus(order.status, 3) === "done"
                            ? "bg-emerald-500 border-emerald-500 text-white"
                            : "bg-white border-gray-200 text-gray-400"
                        }`}>
                          <MapPin size={16} />
                        </div>
                        <h4 className={`text-sm font-bold ${getStepStatus(order.status, 3) === "active" ? "text-black" : "text-gray-500"}`}>
                          Delivered Successfully
                        </h4>
                        <p className="text-xs text-gray-400 mt-1">{STEP_DETAILS.Delivered.desc}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Items Summaries */}
                <div className="border-t border-gray-100 pt-6 space-y-4">
                  <h3 className="text-xs font-extrabold uppercase tracking-widest text-gray-400">Order Summary</h3>
                  <div className="space-y-2 bg-[#FAF8F5] rounded-2xl p-4 border border-gray-100">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-xs text-gray-700 font-medium">
                        <span>{item}</span>
                      </div>
                    ))}
                    <div className="flex justify-between text-sm font-bold border-t border-gray-200/60 pt-3 mt-2 text-black">
                      <span>Total Price</span>
                      <span>{formatPrice(order.total)}</span>
                    </div>
                  </div>
                </div>

                {/* Shipping Location */}
                <div className="border-t border-gray-100 pt-6 space-y-2">
                  <h3 className="text-xs font-extrabold uppercase tracking-widest text-gray-400">Delivery Address</h3>
                  <div className="flex gap-2 text-xs text-gray-500 font-medium leading-relaxed">
                    <MapPin size={16} className="text-amber-500 flex-shrink-0" />
                    <span>{order.shippingAddress}</span>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-6 flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
                  <ShieldCheck size={14} /> Verified Empress Delivery Package
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  );
}
