import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { GoogleLoginButton } from "@/components/GoogleLoginButton";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function Login() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (user) {
      // Redirect back to shopping experience upon login
      setLocation("/shop");
    }
  }, [user, setLocation]);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-white">
      <Header />

      <main className="flex-1 flex items-center justify-center py-16 px-4 bg-[#FAF8F5] relative overflow-hidden">
        {/* Soft background visual glow elements */}
        <div className="absolute top-1/4 left-1/4 w-[280px] h-[280px] bg-purple-100 rounded-full blur-[80px] opacity-60 z-0 pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[280px] h-[280px] bg-orange-50 rounded-full blur-[80px] opacity-60 z-0 pointer-events-none" />

        <div className="relative z-10 w-full max-w-md bg-white border border-gray-100/80 rounded-3xl p-8 md:p-12 shadow-xl shadow-gray-100/40">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 mb-2">
              Welcome to Empress
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              Sign in to manage your orders, access your saved addresses, and view your personal favorite wishlist items.
            </p>
          </div>

          <div className="space-y-6">
            <GoogleLoginButton />
            
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-gray-100"></div>
              <span className="flex-shrink mx-4 text-gray-400 text-[10px] uppercase tracking-widest font-bold">Secure Access</span>
              <div className="flex-grow border-t border-gray-100"></div>
            </div>

            <p className="text-center text-[11px] text-gray-400 leading-relaxed px-4">
              By continuing, you agree to our <span className="underline cursor-pointer hover:text-black">Terms of Service</span> and <span className="underline cursor-pointer hover:text-black">Privacy Policy</span>.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
