import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';

// Layout & Common Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast from './components/Toast';
import RazorpayModal from './components/RazorpayModal';
import AuthModal from './components/AuthModal';

// Customer Pages
import HomePage from './pages/customer/HomePage';
import ProductsPage from './pages/customer/ProductsPage';
import ProductDetailPage from './pages/customer/ProductDetailPage';
import CartPage from './pages/customer/CartPage';
import CheckoutPage from './pages/customer/CheckoutPage';
import OrdersPage from './pages/customer/OrdersPage';
import ProfilePage from './pages/customer/ProfilePage';
import AIShoppingPage from './pages/customer/AIShoppingPage';
import LoginPage from './pages/customer/LoginPage';

// Merchant Pages
import MerchantLayout from './pages/merchant/MerchantLayout';
import DashboardPage from './pages/merchant/DashboardPage';
import CustomersPage from './pages/merchant/CustomersPage';
import MerchantProductsPage from './pages/merchant/ProductsPage';
import MerchantOrdersPage from './pages/merchant/OrdersPage';
import PaymentsPage from './pages/merchant/PaymentsPage';
import RevenueSimulatorPage from './pages/merchant/RevenueSimulatorPage';
import ExperimentsPage from './pages/merchant/ExperimentsPage';
import AIGrowthPage from './pages/merchant/AIGrowthPage';
import SettingsPage from './pages/merchant/SettingsPage';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-[#090D16] text-slate-100 selection:bg-indigo-500 selection:text-white">
          <Navbar />

          <main className="flex-1">
            <Routes>
              {/* Customer Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/products/:id" element={<ProductDetailPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/orders/:id" element={<OrdersPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/ai-shopping" element={<AIShoppingPage />} />
              <Route path="/login" element={<LoginPage />} />

              {/* Merchant Routes with Nested Layout */}
              <Route path="/merchant" element={<MerchantLayout />}>
                <Route index element={<Navigate to="/merchant/dashboard" replace />} />
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="customers" element={<CustomersPage />} />
                <Route path="products" element={<MerchantProductsPage />} />
                <Route path="orders" element={<MerchantOrdersPage />} />
                <Route path="payments" element={<PaymentsPage />} />
                <Route path="revenue" element={<RevenueSimulatorPage />} />
                <Route path="experiments" element={<ExperimentsPage />} />
                <Route path="ai" element={<AIGrowthPage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>

              {/* Fallback Route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <Footer />

          {/* Global Floating Toast, Razorpay Modal and Auth Modal */}
          <Toast />
          <RazorpayModal />
          <AuthModal />
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}