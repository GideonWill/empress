import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";

export function GoogleLoginButton() {
  const { loginWithGoogle, isLoading, error } = useAuth();
  const btnRef = useRef<HTMLDivElement>(null);
  const [sdkLoaded, setSdkLoaded] = useState(false);

  useEffect(() => {
    // If the Google client SDK is already loaded on the window, update state immediately
    if ((window as any).google?.accounts?.id) {
      setSdkLoaded(true);
      return;
    }

    // Otherwise, append the script tag dynamically
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => setSdkLoaded(true);
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (!sdkLoaded || !btnRef.current || !(window as any).google?.accounts?.id) return;

    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "mock-client-id";

    (window as any).google.accounts.id.initialize({
      client_id: clientId,
      callback: async (response: any) => {
        try {
          await loginWithGoogle(response.credential);
        } catch (err) {
          console.error("Google login callback error:", err);
        }
      },
    });

    (window as any).google.accounts.id.renderButton(btnRef.current, {
      type: "standard",
      theme: "outline",
      size: "large",
      text: "continue_with",
      shape: "pill",
      logo_alignment: "left",
      width: "280",
    });
  }, [sdkLoaded, loginWithGoogle]);

  return (
    <div className="flex flex-col items-center justify-center space-y-3">
      {isLoading ? (
        <div className="flex items-center space-x-2 text-sm text-gray-500 py-2">
          <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
          <span>Signing you in...</span>
        </div>
      ) : (
        <div ref={btnRef} className="min-h-[44px] flex justify-center w-full" />
      )}
      {error && (
        <p className="text-red-500 text-xs font-semibold text-center max-w-xs transition-opacity duration-300">
          {error}
        </p>
      )}
    </div>
  );
}
