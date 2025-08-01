import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"
import { CartProvider } from "./contexts/CartContext"
import PublicLayout from "./layouts/PublicLayout"
import AdminLayout from "./layouts/AdminLayout"
import ProtectedRoute from "./components/admin/ProtectedRoute"
import ScrollToTop from "./components/utils/ScrollToTop"
import { Toaster } from "react-hot-toast"

// Public pages
import HomePage from "./pages/public/HomePage"
import ProductDetail from "./pages/public/ProductDetail"
import CategoryPage from "./pages/public/CategoryPage"
import CartPage from "./pages/public/CartPage"
import CheckoutPage from "./pages/public/CheckoutPage"
import OrderConfirmationPage from "./pages/public/OrderConfirmationPage"
import OrderTrackingPage from "./pages/public/OrderTrackingPage"

// Admin pages
import AdminLogin from "./pages/admin/AdminLogin"
import AdminDashboard from "./pages/admin/AdminDashboard"
import AdminProducts from "./pages/admin/AdminProducts"
import AdminProductForm from "./pages/admin/AdminProductForm"
import AdminOrders from "./pages/admin/AdminOrders"
import AdminOrderDetail from "./pages/admin/AdminOrderDetail"
import AdminSettings from "./pages/admin/AdminSettings"
import AdminContent from "./pages/admin/AdminContent"
import AdminEnvases from "./pages/admin/AdminEnvases"

import "./App.css"
import "./styles/toast-custom.css"

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <ScrollToTop />
          <Toaster 
            position="top-center"
            containerStyle={{ top: 80 }}
            toastOptions={{
              duration: 1500,
              style: {
                background: '#1f2937',
                color: '#f9fafb',
                border: '1px solid #374151',
                animation: 'none',
              },
              success: {
                style: {
                  background: '#065f46',
                  border: '1px solid #10b981',
                },
              },
              error: {
                style: {
                  background: '#991b1b',
                  border: '1px solid #ef4444',
                },
              },
            }}
            gutter={8}
            reverseOrder={false}
          />
          <Routes>
            {/* Rutas Públicas */}
            <Route path="/" element={<PublicLayout />}>
              <Route index element={<HomePage />} />
              <Route path="product/:id" element={<ProductDetail />} />
              <Route path="category/:category" element={<CategoryPage />} />
              <Route path="cart" element={<CartPage />} />
              <Route path="checkout" element={<CheckoutPage />} />
              <Route path="order-confirmation/:orderNumber" element={<OrderConfirmationPage />} />
              <Route path="track-order" element={<OrderTrackingPage />} />
              <Route path="order-tracking/:orderNumber" element={<OrderTrackingPage />} />
            </Route>

            {/* Ruta de Login Admin (fuera del layout protegido) */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Rutas de Admin Protegidas */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="products/new" element={<AdminProductForm />} />
              {/* CORREGIDO: Cambiar la ruta para que coincida con el enlace */}
              <Route path="products/edit/:id" element={<AdminProductForm />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="orders/:id" element={<AdminOrderDetail />} />
              <Route path="envases" element={<AdminEnvases />} />
              <Route path="content" element={<AdminContent />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>

            {/* Ruta 404 - Redirección */}
            <Route path="*" element={<HomePage />} />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  )
}

export default App
