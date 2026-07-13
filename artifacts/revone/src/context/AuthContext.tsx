import { createContext, useContext, useState, useEffect } from "react";
import { useGetProfile, useGoogleLogin, useLogout, getGetProfileQueryKey } from "@workspace/api-client-react";
import type { User } from "@workspace/api-client-react";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  loginWithGoogle: (credential: string) => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  registerWithEmail: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => Promise<void>;
  refetchProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  // 1. Fetch user profile automatically if logged in
  const {
    data: profileData,
    isLoading: isProfileLoading,
    refetch,
  } = useGetProfile({
    query: {
      queryKey: getGetProfileQueryKey(),
      retry: false,
      refetchOnWindowFocus: false,
    },
  });

  // Keep state in sync with profile query data
  useEffect(() => {
    if (profileData) {
      setUser(profileData);
      setAuthError(null);
    } else {
      setUser(null);
    }
  }, [profileData]);

  // 2. Google Login Mutation
  const loginMutation = useGoogleLogin();

  const [emailLoading, setEmailLoading] = useState(false);

  const loginWithGoogle = async (credential: string) => {
    try {
      setAuthError(null);
      const authenticatedUser = await loginMutation.mutateAsync({
        data: { credential },
      });
      setUser(authenticatedUser);
      await refetch();
    } catch (err: any) {
      const errMsg = err.message || "Google login failed. Please try again.";
      setAuthError(errMsg);
      throw new Error(errMsg);
    }
  };

  const loginWithEmail = async (email: string, password: string) => {
    try {
      setAuthError(null);
      setEmailLoading(true);
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }
      setUser(data);
      await refetch();
    } catch (err: any) {
      setAuthError(err.message);
      throw err;
    } finally {
      setEmailLoading(false);
    }
  };

  const registerWithEmail = async (email: string, password: string, fullName: string) => {
    try {
      setAuthError(null);
      setEmailLoading(true);
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, fullName }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }
      setUser(data);
      await refetch();
    } catch (err: any) {
      setAuthError(err.message);
      throw err;
    } finally {
      setEmailLoading(false);
    }
  };

  // 3. Logout Mutation
  const logoutMutation = useLogout();

  const logout = async () => {
    try {
      await logoutMutation.mutateAsync();
      setUser(null);
      setAuthError(null);
    } catch (err: any) {
      console.error("Logout failed:", err);
    }
  };

  const refetchProfile = async () => {
    try {
      await refetch();
    } catch (err) {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading: isProfileLoading || loginMutation.isPending || logoutMutation.isPending || emailLoading,
        error: authError,
        loginWithGoogle,
        loginWithEmail,
        registerWithEmail,
        logout,
        refetchProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
