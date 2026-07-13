import { useEffect } from "react";
import { Switch, Route, useLocation, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { AuthProvider } from "@/context/AuthContext";
import { ProductStoreProvider } from "@/context/ProductStore";
import { AdminProvider } from "@/context/AdminContext";
import { OrderStoreProvider } from "@/context/OrderStore";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AnimatePresence, motion } from "framer-motion";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Shop from "@/pages/shop";
import Blogs from "@/pages/blogs";
import ProductPage from "@/pages/product";
import CartPage from "@/pages/cart";
import CheckoutPage from "@/pages/checkout";
import OrderSuccessPage from "@/pages/order-success";
import Login from "@/pages/login";
import Profile from "@/pages/profile";
import BlogDetail from "@/pages/blog-detail";
import TrackOrder from "@/pages/track";
import FavoritesPage from "@/pages/favorites";

// Admin Pages
import AdminLogin from "@/pages/admin/admin-login";
import AdminDashboard from "@/pages/admin/admin-dashboard";
import AdminProducts from "@/pages/admin/admin-products";
import AdminAddProduct from "@/pages/admin/admin-add-product";
import AdminOrders from "@/pages/admin/admin-orders";
import AdminCustomers from "@/pages/admin/admin-customers";

const queryClient = new QueryClient();

function ScrollToTop() {
  const [location] = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return null;
}

function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}

function Router() {
  const [location] = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Switch key={location}>
        <Route path="/" component={() => <PageWrapper><Home /></PageWrapper>} />
        <Route path="/shop" component={() => <PageWrapper><Shop /></PageWrapper>} />
        <Route path="/favorites" component={() => <PageWrapper><FavoritesPage /></PageWrapper>} />
        <Route path="/shop/:id" component={() => <PageWrapper><ProductPage /></PageWrapper>} />
        <Route path="/cart" component={() => <PageWrapper><CartPage /></PageWrapper>} />
        <Route path="/checkout" component={() => <PageWrapper><CheckoutPage /></PageWrapper>} />
        <Route path="/order-success" component={() => <PageWrapper><OrderSuccessPage /></PageWrapper>} />
        <Route path="/blogs" component={() => <PageWrapper><Blogs /></PageWrapper>} />
        <Route path="/blogs/:id" component={() => <PageWrapper><BlogDetail /></PageWrapper>} />
        <Route path="/login" component={() => <PageWrapper><Login /></PageWrapper>} />
        <Route path="/track" component={() => <PageWrapper><TrackOrder /></PageWrapper>} />
        <Route path="/profile" component={() => (
          <PageWrapper>
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          </PageWrapper>
        )} />
        
        {/* Admin Routes */}
        <Route path="/admin/login" component={AdminLogin} />
        <Route path="/admin" component={AdminDashboard} />
        <Route path="/admin/products" component={AdminProducts} />
        <Route path="/admin/products/new" component={AdminAddProduct} />
        <Route path="/admin/orders" component={AdminOrders} />
        <Route path="/admin/customers" component={AdminCustomers} />

        <Route component={() => <PageWrapper><NotFound /></PageWrapper>} />
      </Switch>
    </AnimatePresence>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ProductStoreProvider>
          <AdminProvider>
           <OrderStoreProvider>
            <CartProvider>
              <WishlistProvider>
                <AuthProvider>
                  <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
                    <ScrollToTop />
                    <Router />
                  </WouterRouter>
                  <Toaster />
                </AuthProvider>
              </WishlistProvider>
            </CartProvider>
           </OrderStoreProvider>
          </AdminProvider>
        </ProductStoreProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
