import { useState } from "react";
import { useLocation } from "wouter";
import { useAdmin } from "@/context/AdminContext";
import { Crown, Eye, EyeOff, AlertCircle } from "lucide-react";

import Logo from "@assets/empress-logo.png";

export default function AdminLogin() {
  const { adminLogin, isAdmin } = useAdmin();
  const [, setLocation] = useLocation();
  const [passcode, setPasscode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isAdmin) {
    setLocation("/admin");
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!passcode) {
      setError("Please enter the access code");
      return;
    }

    setLoading(true);
    // Simulate a brief loading state
    setTimeout(() => {
      const success = adminLogin(passcode);
      if (success) {
        setLocation("/admin");
      } else {
        setError("Invalid access code. Please try again.");
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen flex font-sans">
      {/* Left: Gradient Panel */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-gray-900 via-gray-800 to-black items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-400 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-amber-600 rounded-full blur-[100px]" />
        </div>
        <div className="relative text-center px-12">
          <img 
            src={Logo} 
            alt="Empress Logo" 
            className="h-24 object-contain mx-auto mb-8" 
            style={{ filter: "sepia(0.6) saturate(3) hue-rotate(5deg) brightness(0.7) contrast(1.2)" }}
          />
          <h1 className="text-4xl font-extrabold text-white mb-4 tracking-tight">
            Empress Admin
          </h1>
          <p className="text-gray-400 text-sm leading-relaxed max-w-sm mx-auto">
            Manage your store, track orders, and update products — all from one premium dashboard.
          </p>
        </div>
      </div>

      {/* Right: Login Form */}
      <div className="flex-1 flex items-center justify-center bg-gray-950 px-6">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10 justify-center">
            <img 
              src={Logo} 
              alt="Empress Logo" 
              className="h-16 object-contain" 
              style={{ filter: "sepia(0.6) saturate(3) hue-rotate(5deg) brightness(0.7) contrast(1.2)" }}
            />
          </div>

          <h2 className="text-2xl font-extrabold text-white mb-1">
            Welcome back
          </h2>
          <p className="text-gray-500 text-sm mb-8">
            Enter your access code to open the dashboard
          </p>

          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-lg mb-6">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400 block mb-2">
                Access Code
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter passcode"
                  className="w-full bg-gray-900 border border-gray-800 text-white px-4 py-3 pr-12 rounded-lg text-sm outline-none focus:border-amber-500 transition-colors placeholder:text-gray-600 animate-pulse"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-black py-3.5 rounded-lg font-bold text-sm uppercase tracking-wide hover:from-amber-400 hover:to-amber-500 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Signing in…
                </>
              ) : (
                "Open Dashboard"
              )}
            </button>
          </form>

          <p className="text-xs text-gray-600 mt-8 text-center">
            Protected area. Authorized personnel only.
          </p>
        </div>
      </div>
    </div>
  );
}
