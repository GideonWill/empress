import { Link, useLocation } from "wouter";
import { useAdmin } from "@/context/AdminContext";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  LogOut,
  Menu,
  X,
  Crown,
  Bell,
  AlertCircle,
} from "lucide-react";
import Logo from "@assets/empress-logo.png";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/customers", label: "Customers", icon: Users },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAdmin, adminEmail, adminLogout } = useAdmin();
  const [location, setLocation] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, type: "order", message: "New Order #EMP-10042 placed by Akua Mensah", time: "5 mins ago", read: false },
    { id: 2, type: "stock", message: "Low stock alert: 'Purple Square-Toe Buckle Slide'", time: "1 hour ago", read: false },
  ]);

  useEffect(() => {
    if (!isAdmin) {
      setLocation("/admin/login");
    }
  }, [isAdmin, setLocation]);

  if (!isAdmin) return null;

  return (
    <div className="flex h-screen bg-gray-950 font-sans overflow-hidden">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gray-900 border-r border-gray-800 flex flex-col transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-6 border-b border-gray-800">
          <img 
            src={Logo} 
            alt="Empress Logo" 
            className="h-12 object-contain" 
            style={{ filter: "sepia(0.6) saturate(3) hue-rotate(5deg) brightness(0.7) contrast(1.2)" }}
          />
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto lg:hidden text-gray-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/admin"
                ? location === "/admin"
                : location.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    : "text-gray-400 hover:text-white hover:bg-gray-800/60"
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-xs font-bold text-black">
              A
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">Admin</p>
              <p className="text-[10px] text-gray-500 truncate">{adminEmail}</p>
            </div>
          </div>
          <button
            onClick={() => {
              adminLogout();
              setLocation("/admin/login");
            }}
            className="flex items-center gap-2 w-full px-3 py-2 text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 bg-gray-900/50 backdrop-blur-sm border-b border-gray-800 flex items-center px-6 gap-4 flex-shrink-0 z-30 relative">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <Menu size={22} />
          </button>
          <h1 className="text-white font-bold text-lg">Admin Panel</h1>
          <div className="ml-auto flex items-center gap-6">
            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors focus:outline-none"
              >
                <Bell size={20} />
                {notifications.some(n => !n.read) && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-ping" />
                )}
              </button>

              <AnimatePresence>
                {notificationsOpen && (
                  <>
                    <div className="fixed inset-0 z-[90]" onClick={() => setNotificationsOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-80 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl z-[100] overflow-hidden"
                    >
                      <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-950/20">
                        <span className="font-extrabold text-sm text-white">Notifications</span>
                        <button
                          onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
                          className="text-[10px] text-amber-400 hover:text-amber-300 font-bold uppercase tracking-wider"
                        >
                          Mark all read
                        </button>
                      </div>
                       <div className="divide-y divide-gray-800 max-h-64 overflow-y-auto">
                        {notifications.map(n => (
                          <Link
                            key={n.id}
                            href={n.type === "order" ? "/admin/orders" : "/admin/products"}
                            onClick={() => {
                              // Mark as read and close dropdown
                              setNotifications(prev => prev.map(item => item.id === n.id ? { ...item, read: true } : item));
                              setNotificationsOpen(false);
                            }}
                            className={`p-4 flex gap-3 hover:bg-gray-800/40 cursor-pointer transition-colors block text-left ${!n.read ? "bg-amber-500/[0.03]" : ""}`}
                          >
                            <div className="flex-shrink-0 mt-0.5">
                              {n.type === "order" ? (
                                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                                  <ShoppingCart size={14} />
                                </div>
                              ) : (
                                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                                  <AlertCircle size={14} />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-xs text-gray-300 ${!n.read ? "font-semibold" : ""}`}>{n.message}</p>
                              <span className="text-[10px] text-gray-500 mt-1 block">{n.time}</span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <Link
              href="/"
              className="text-xs text-gray-400 hover:text-amber-400 font-medium transition-colors"
            >
              ← View Store
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-950 p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
