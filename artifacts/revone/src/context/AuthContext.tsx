import { createContext, useContext, useState, useEffect } from "react";
import { useGetProfile, useGoogleLogin, useLogout, getGetProfileQueryKey } from "@workspace/api-client-react";
import type { User } from "@workspace/api-client-react";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  loginWithGoogle: (credential: string) => Promise<void>;
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
        isLoading: isProfileLoading || loginMutation.isPending || logoutMutation.isPending,
        error: authError,
        loginWithGoogle,
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
