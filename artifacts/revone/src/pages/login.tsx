import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { GoogleLoginButton } from "@/components/GoogleLoginButton";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Mail, Lock, User, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const { user, loginWithEmail, registerWithEmail, isLoading, error } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) {
      setLocation("/shop");
    }
  }, [user, setLocation]);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!email) {
      errors.email = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Please enter a valid email address";
    }
    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters long";
    }
    if (isSignUp && !fullName.trim()) {
      errors.fullName = "Full name is required";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (isSignUp) {
        await registerWithEmail(email, password, fullName.trim());
        toast({
          title: "Account created!",
          description: `Welcome to Empress, ${fullName}!`,
        });
      } else {
        await loginWithEmail(email, password);
        toast({
          title: "Logged in successfully",
          description: "Welcome back!",
        });
      }
    } catch (err: any) {
      toast({
        title: isSignUp ? "Sign up failed" : "Login failed",
        description: err.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-white">
      <Header />

      <main className="flex-1 flex items-center justify-center py-16 px-4 bg-[#FAF8F5] relative overflow-hidden">
        {/* Decorative background glows */}
        <div className="absolute top-1/4 left-1/4 w-[280px] h-[280px] bg-purple-100/50 rounded-full blur-[80px] opacity-60 z-0 pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[280px] h-[280px] bg-amber-50 rounded-full blur-[80px] opacity-60 z-0 pointer-events-none" />

        <div className="relative z-10 w-full max-w-md bg-white border border-gray-100 rounded-3xl p-8 md:p-10 shadow-xl shadow-gray-200/30">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900 mb-2">
              {isSignUp ? "Create your account" : "Welcome back"}
            </h2>
            <p className="text-xs text-gray-500 max-w-xs mx-auto leading-relaxed">
              {isSignUp
                ? "Join Empress to save your preferences, address, and unlock express checkout."
                : "Sign in to access your dashboard, addresses, order history, and favorites."}
            </p>
          </div>

          {/* Toggle Tab */}
          <div className="flex bg-gray-50 p-1 rounded-xl mb-6 border border-gray-100">
            <button
              onClick={() => {
                setIsSignUp(false);
                setFormErrors({});
              }}
              className={`flex-1 text-center py-2.5 rounded-lg text-xs font-bold transition-all ${
                !isSignUp ? "bg-white text-black shadow-sm" : "text-gray-400 hover:text-gray-700"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setIsSignUp(true);
                setFormErrors({});
              }}
              className={`flex-1 text-center py-2.5 rounded-lg text-xs font-bold transition-all ${
                isSignUp ? "bg-white text-black shadow-sm" : "text-gray-400 hover:text-gray-700"
              }`}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name (Sign Up only) */}
            {isSignUp && (
              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 block mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <User size={16} />
                  </span>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className={`w-full bg-gray-50 border ${
                      formErrors.fullName ? "border-red-500" : "border-gray-200"
                    } text-sm text-black pl-10 pr-4 py-3 rounded-xl outline-none focus:border-black focus:bg-white transition-all`}
                  />
                </div>
                {formErrors.fullName && (
                  <p className="text-[10px] text-red-500 font-semibold mt-1">
                    {formErrors.fullName}
                  </p>
                )}
              </div>
            )}

            {/* Email Address */}
            <div>
              <label className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 block mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                  <Mail size={16} />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className={`w-full bg-gray-50 border ${
                    formErrors.email ? "border-red-500" : "border-gray-200"
                  } text-sm text-black pl-10 pr-4 py-3 rounded-xl outline-none focus:border-black focus:bg-white transition-all`}
                />
              </div>
              {formErrors.email && (
                <p className="text-[10px] text-red-500 font-semibold mt-1">{formErrors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 block mb-1.5">
                Password
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                  <Lock size={16} />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full bg-gray-50 border ${
                    formErrors.password ? "border-red-500" : "border-gray-200"
                  } text-sm text-black pl-10 pr-12 py-3 rounded-xl outline-none focus:border-black focus:bg-white transition-all`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {formErrors.password && (
                <p className="text-[10px] text-red-500 font-semibold mt-1">
                  {formErrors.password}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-black hover:bg-gray-800 text-white py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 mt-2 transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Please wait...
                </>
              ) : (
                <>
                  {isSignUp ? "Sign Up" : "Sign In"}
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>

          {/* Social login separator */}
          <div className="relative flex py-6 items-center">
            <div className="flex-grow border-t border-gray-100"></div>
            <span className="flex-shrink mx-4 text-gray-400 text-[10px] uppercase tracking-widest font-bold">
              Or continue with
            </span>
            <div className="flex-grow border-t border-gray-100"></div>
          </div>

          <GoogleLoginButton />

          <p className="text-center text-[10px] text-gray-400 leading-relaxed px-4 mt-6">
            By continuing, you agree to our{" "}
            <span className="underline cursor-pointer hover:text-black">Terms of Service</span> and{" "}
            <span className="underline cursor-pointer hover:text-black">Privacy Policy</span>.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
