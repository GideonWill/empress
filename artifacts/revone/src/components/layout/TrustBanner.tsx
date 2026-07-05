import { Truck, ShieldCheck, Clock, CreditCard } from "lucide-react";

export function TrustBanner() {
  const items = [
    {
      icon: <Truck className="w-8 h-8 stroke-1" />,
      title: "FREE SHIPPING & RETURN",
      subtitle: "Free shipping on all orders over $99"
    },
    {
      icon: <ShieldCheck className="w-8 h-8 stroke-1" />,
      title: "MONEY GUARANTEE",
      subtitle: "30 days money back guarantee"
    },
    {
      icon: <Clock className="w-8 h-8 stroke-1" />,
      title: "ONLINE SUPPORT",
      subtitle: "24/7 online customer support"
    },
    {
      icon: <CreditCard className="w-8 h-8 stroke-1" />,
      title: "SECURE PAYMENTS",
      subtitle: "100% secure payment processing"
    }
  ];

  return (
    <div className="border-y border-gray-100 py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((item, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <div className="mb-4 text-black">
                {item.icon}
              </div>
              <h4 className="font-bold text-sm tracking-wide mb-2 uppercase">{item.title}</h4>
              <p className="text-gray-500 text-sm">{item.subtitle}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
