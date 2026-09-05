import React, { createContext, useContext, useState, useEffect } from 'react';
import io from 'socket.io-client';

const AppContext = createContext();

export function AppProvider({ children }) {
  // Current user & role ('customer' or 'merchant')
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('shoppilot_user');
    if (savedUser) {
      try { return JSON.parse(savedUser); } catch (e) {}
    }
    return {
      id: 'usr_customer',
      name: 'Rohan Sharma',
      email: 'customer@shoppilot.ai',
      role: 'customer'
    };
  });
  const [role, setRole] = useState(() => {
    return localStorage.getItem('shoppilot_role') || 'customer';
  });

  // Auth modal state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  // Real backend Login
  const login = async (email, password) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Invalid email or password');
      }

      localStorage.setItem('shoppilot_token', data.token);
      localStorage.setItem('shoppilot_user', JSON.stringify(data.user));
      localStorage.setItem('shoppilot_role', data.user.role);

      setUser(data.user);
      setRole(data.user.role);
      closeAuthModal();
      showToast(`Welcome back, ${data.user.name}! Logged in as ${data.user.role}.`, 'success');
      return { success: true, user: data.user };
    } catch (err) {
      showToast(err.message, 'error');
      return { success: false, error: err.message };
    }
  };

  // Real backend Register
  const register = async (name, email, password, targetRole = 'customer') => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role: targetRole })
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Registration failed');
      }

      localStorage.setItem('shoppilot_token', data.token);
      localStorage.setItem('shoppilot_user', JSON.stringify(data.user));
      localStorage.setItem('shoppilot_role', data.user.role);

      setUser(data.user);
      setRole(data.user.role);
      closeAuthModal();
      showToast(`Account created! Logged in as ${data.user.name}.`, 'success');
      return { success: true, user: data.user };
    } catch (err) {
      showToast(err.message, 'error');
      return { success: false, error: err.message };
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('shoppilot_token');
    localStorage.removeItem('shoppilot_user');
    localStorage.removeItem('shoppilot_role');
    setUser(null);
    setRole('customer');
    showToast('Signed out successfully.', 'info');
  };

  // Cart state
  const [cart, setCart] = useState([
    {
      id: 'prod_0001',
      name: 'ZenithBook Pro 15 (Ryzen 7 / RTX 4060)',
      price: 68999,
      quantity: 1,
      image_url: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&q=80',
      category: 'Laptops'
    }
  ]);
  const [activeCoupon, setActiveCoupon] = useState(null);

  // Toast notification state
  const [toast, setToast] = useState(null);

  // Live telemetry decisions stream from WebSockets
  const [liveTelemetry, setLiveTelemetry] = useState([]);
  const [socket, setSocket] = useState(null);

  // Razorpay payment modal state
  const [paymentModal, setPaymentModal] = useState({
    isOpen: false,
    order: null,
    onSuccess: null,
    onFailure: null
  });

  // Initialize Socket.io connection for live merchant telemetry
  useEffect(() => {
    const s = io('http://localhost:5001', { reconnectionDelay: 2000 });
    setSocket(s);

    s.on('telemetry_update', (decision) => {
      setLiveTelemetry((prev) => [decision, ...prev.slice(0, 49)]);
    });

    s.on('payment_captured', (data) => {
      showToast(`Payment of ₹${Number(data.amount).toLocaleString('en-IN')} verified & captured!`, 'success');
    });

    s.on('payment_failed', (data) => {
      showToast(`Payment failed: ${data.reason}. AI Recovery Protocol triggered.`, 'error');
    });

    s.on('recovery_success', (data) => {
      showToast(`🎉 Payment recovered! ₹${Number(data.amount).toLocaleString('en-IN')} via ${data.method}`, 'success');
    });

    return () => s.disconnect();
  }, []);

  const showToast = (message, type = 'info') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  const switchRole = async (targetRole) => {
    setRole(targetRole);
    try {
      const res = await fetch('/api/auth/demo-switch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetRole })
      });
      const data = await res.json();
      if (data.user) {
        setUser(data.user);
        showToast(`Switched to ${targetRole === 'merchant' ? 'Merchant Console' : 'Customer Storefront'} (${data.user.name})`, 'info');
      }
    } catch (e) {
      console.warn('Switch demo role error:', e);
    }
  };

  const addToCart = (product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: Number(product.price),
          quantity,
          image_url: product.image_url,
          category: product.category
        }
      ];
    });
    showToast(`Added "${product.name}" to cart.`, 'success');
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
    showToast('Item removed from cart.', 'info');
  };

  const updateQuantity = (productId, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const applyCoupon = (code, discountPct) => {
    setActiveCoupon({ code, discountPct });
    showToast(`Coupon "${code}" applied: ${discountPct}% off!`, 'success');
  };

  const openPaymentModal = ({ order, onSuccess, onFailure }) => {
    setPaymentModal({
      isOpen: true,
      order,
      onSuccess,
      onFailure
    });
  };

  const closePaymentModal = () => {
    setPaymentModal((prev) => ({ ...prev, isOpen: false }));
  };

  // Cart calculations
  const cartSubtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountAmount = activeCoupon ? Math.round(cartSubtotal * (activeCoupon.discountPct / 100)) : 0;
  const cartTotal = Math.max(0, cartSubtotal - discountAmount);

  return (
    <AppContext.Provider
      value={{
        user,
        role,
        switchRole,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartSubtotal,
        discountAmount,
        cartTotal,
        activeCoupon,
        applyCoupon,
        toast,
        showToast,
        liveTelemetry,
        paymentModal,
        openPaymentModal,
        closePaymentModal,
        login,
        register,
        logout,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
