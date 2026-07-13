import { Lock, Award, Zap, Smile } from "lucide-react";

export function TrustBanner() {
  const items = [
    {
      icon: <Award className="w-8 h-8 stroke-1 text-white" />,
      title: "RELIABLE QUALITY",
      subtitle: "Handpicked premium designer collections"
    },
    {
      icon: <Zap className="w-8 h-8 stroke-1 text-white" />,
      title: "FAST & TRACKABLE",
      subtitle: "Quick shipping and live delivery updates"
    },
    {
      icon: <Smile className="w-8 h-8 stroke-1 text-white" />,
      title: "USER FRIENDLY",
      subtitle: "Easy shopping, payments, and support"
    },
    {
      icon: <Lock className="w-8 h-8 stroke-1 text-white" />,
      title: "SECURE PAYMENTS",
      subtitle: "100% encrypted checkout protection"
    }
  ];

  return (
    <div className="py-6 bg-transparent">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((item, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <div className="mb-4 text-white">
                {item.icon}
              </div>
              <h4 className="font-bold text-xs tracking-widest mb-1.5 uppercase text-white">{item.title}</h4>
              <p className="text-gray-400 text-xs leading-relaxed max-w-[200px]">{item.subtitle}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
