import { createContext, useContext, useState, useCallback } from "react";

interface AdminContextType {
  isAdmin: boolean;
  adminEmail: string | null;
  adminLogin: (code: string) => boolean;
  adminLogout: () => void;
}

const AdminContext = createContext<AdminContextType | null>(null);

const ADMIN_STORAGE_KEY = "empress-admin-session";

const ADMIN_EMAIL = "admin@empress.com";
const ADMIN_CODE = "empress@16";

function loadSession(): { isAdmin: boolean; email: string | null } {
  try {
    const stored = localStorage.getItem(ADMIN_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.isAdmin && parsed.email) {
        return { isAdmin: true, email: parsed.email };
      }
    }
  } catch {
    // ignore
  }
  return { isAdmin: false, email: null };
}

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState(loadSession);

  const adminLogin = useCallback((code: string): boolean => {
    if (code === ADMIN_CODE) {
      const newSession = { isAdmin: true, email: ADMIN_EMAIL };
      setSession(newSession);
      localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(newSession));
      return true;
    }
    return false;
  }, []);

  const adminLogout = useCallback(() => {
    setSession({ isAdmin: false, email: null });
    localStorage.removeItem(ADMIN_STORAGE_KEY);
  }, []);

  return (
    <AdminContext.Provider
      value={{
        isAdmin: session.isAdmin,
        adminEmail: session.email,
        adminLogin,
        adminLogout,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used inside AdminProvider");
  return ctx;
}
