'use client';

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { apiRequest, isBackendUnavailable, isDemoMode } from '@/lib/api';
import {
  CartLine,
  demoProducts,
  demoServices,
  demoTeam,
  demoTestimonials,
  Product,
  Service,
  TeamMember,
  Testimonial,
  User,
} from '@/lib/demo-data';

type StoreContextValue = {
  products: Product[];
  services: Service[];
  team: TeamMember[];
  testimonials: Testimonial[];
  cart: CartLine[];
  user: User | null;
  loading: boolean;
  notice: string;
  setNotice: (notice: string) => void;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  setCartQuantity: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<User>;
  signUp: (name: string, email: string, password: string) => Promise<boolean>;
  verifyEmail: (email: string, code: string) => Promise<User>;
  resendVerification: (email: string) => Promise<string>;
  requestPasswordReset: (email: string) => Promise<string>;
  resetPassword: (email: string, code: string, password: string) => Promise<void>;
  updateProfile: (name: string) => Promise<User>;
  signOut: () => Promise<void>;
  refreshCatalog: () => Promise<void>;
};

const StoreContext = createContext<StoreContextValue | null>(null);
const CART_KEY = 'car-doctor-cart';
const USER_KEY = 'car-doctor-user';

function readStorage<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) as T : fallback;
  } catch {
    return fallback;
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState(demoProducts);
  const [services, setServices] = useState(demoServices);
  const [team, setTeam] = useState(demoTeam);
  const [testimonials, setTestimonials] = useState(demoTestimonials);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [hydrated, setHydrated] = useState(false);
  const [notice, setNotice] = useState('');

  const refreshCatalog = useCallback(async () => {
    const [productData, serviceData, teamData, reviewData] = await Promise.allSettled([
      apiRequest<Product[]>('/products'),
      apiRequest<Service[]>('/services'),
      apiRequest<TeamMember[]>('/content/team'),
      apiRequest<Testimonial[]>('/content/testimonials'),
    ]);
    if (productData.status === 'fulfilled') setProducts(productData.value);
    if (serviceData.status === 'fulfilled') setServices(serviceData.value);
    if (teamData.status === 'fulfilled') setTeam(teamData.value);
    if (reviewData.status === 'fulfilled') setTestimonials(reviewData.value);
  }, []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const savedUser = readStorage<User | null>(USER_KEY, null);
      setCart(readStorage<CartLine[]>(CART_KEY, []));
      setUser(savedUser);
      setHydrated(true);

      void Promise.all([
        refreshCatalog(),
        apiRequest<{ user: User }>('/auth/me').then(({ user: current }) => {
          setUser(current);
          localStorage.setItem(USER_KEY, JSON.stringify(current));
        }).catch((error: unknown) => {
          if (
            error instanceof Error
            && 'status' in error
            && error.status === 401
            && (!isDemoMode || !savedUser?.id.startsWith('demo-'))
          ) {
            setUser(null);
            localStorage.removeItem(USER_KEY);
          }
        }),
      ]).finally(() => setLoading(false));
    });
    return () => window.cancelAnimationFrame(frame);
  }, [refreshCatalog]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart, hydrated]);

  const addToCart = useCallback(async (productId: string, quantity = 1) => {
    if (user && !user.id.startsWith('demo-')) {
      try {
        await apiRequest('/cart', {
          method: 'POST',
          body: JSON.stringify({ productId, quantity }),
        });
      } catch (error) {
        if (!isBackendUnavailable(error)) throw error;
      }
    }
    setCart((current) => {
      const existing = current.find((item) => item.productId === productId);
      return existing
        ? current.map((item) => item.productId === productId ? { ...item, quantity: item.quantity + quantity } : item)
        : [...current, { productId, quantity }];
    });
    setNotice('Added to your cart');
  }, [user]);

  const setCartQuantity = useCallback(async (productId: string, quantity: number) => {
    if (user && !user.id.startsWith('demo-')) {
      try {
        await apiRequest(`/cart/${productId}`, {
          method: 'PATCH',
          body: JSON.stringify({ quantity }),
        });
      } catch (error) {
        if (!isBackendUnavailable(error)) throw error;
      }
    }
    setCart((current) => current.map((item) => item.productId === productId ? { ...item, quantity } : item));
  }, [user]);

  const removeFromCart = useCallback(async (productId: string) => {
    if (user && !user.id.startsWith('demo-')) {
      try {
        await apiRequest(`/cart/${productId}`, { method: 'DELETE' });
      } catch (error) {
        if (!isBackendUnavailable(error)) throw error;
      }
    }
    setCart((current) => current.filter((item) => item.productId !== productId));
  }, [user]);

  const clearCart = useCallback(async () => {
    if (user && !user.id.startsWith('demo-')) {
      try {
        await apiRequest('/cart', { method: 'DELETE' });
      } catch (error) {
        if (!isBackendUnavailable(error)) throw error;
      }
    }
    setCart([]);
  }, [user]);

  const signIn = useCallback(async (email: string, password: string) => {
    const result = await apiRequest<{ user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setUser(result.user);
    localStorage.setItem(USER_KEY, JSON.stringify(result.user));
    return result.user;
  }, []);

  const signUp = useCallback(async (name: string, email: string, password: string) => {
    await apiRequest<{ verificationRequired: boolean }>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
    return true;
  }, []);

  const verifyEmail = useCallback(async (email: string, code: string) => {
    const result = await apiRequest<{ user: User }>('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ email, code }),
    });
    setUser(result.user);
    localStorage.setItem(USER_KEY, JSON.stringify(result.user));
    return result.user;
  }, []);

  const resendVerification = useCallback(async (email: string) => {
    const result = await apiRequest<{ message: string }>('/auth/resend-verification', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
    return result.message;
  }, []);

  const requestPasswordReset = useCallback(async (email: string) => {
    const result = await apiRequest<{ message: string }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
    return result.message;
  }, []);

  const resetPassword = useCallback(async (email: string, code: string, password: string) => {
    await apiRequest('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email, code, password }),
    });
    setUser(null);
    localStorage.removeItem(USER_KEY);
  }, []);

  const updateProfile = useCallback(async (name: string) => {
    const result = await apiRequest<{ user: User }>('/auth/profile', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
    setUser(result.user);
    localStorage.setItem(USER_KEY, JSON.stringify(result.user));
    return result.user;
  }, []);

  const signOut = useCallback(async () => {
    try {
      await apiRequest('/auth/logout', { method: 'POST' });
    } catch (error) {
      if (!isBackendUnavailable(error)) throw error;
    }
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }, []);

  const value = useMemo(() => ({
    products, services, team, testimonials, cart, user, loading, notice,
    setNotice, addToCart, setCartQuantity, removeFromCart, clearCart,
    signIn, signUp, verifyEmail, resendVerification, requestPasswordReset, resetPassword, updateProfile, signOut,
    refreshCatalog,
  }), [
    products, services, team, testimonials, cart, user, loading, notice,
    addToCart, setCartQuantity, removeFromCart, clearCart,
    signIn, signUp, verifyEmail, resendVerification, requestPasswordReset, resetPassword, updateProfile,
    signOut, refreshCatalog,
  ]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
}
