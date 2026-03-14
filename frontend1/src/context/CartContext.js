import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartAPI } from '../api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart]           = useState({ items: [], total: 0 });
  const [cartOpen, setCartOpen]   = useState(false);
  const [loading, setLoading]     = useState(false);

  const fetchCart = useCallback(async () => {
    if (!user) { setCart({ items: [], total: 0 }); return; }
    try {
      const { data } = await cartAPI.get();
      setCart(data.cart);
    } catch { setCart({ items: [], total: 0 }); }
  }, [user]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const addToCart = async (productId, variantId, quantity = 1) => {
    setLoading(true);
    try {
      const { data } = await cartAPI.add({ productId, variantId, quantity });
      setCart(data.cart);
      setCartOpen(true);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Error adding to cart' };
    } finally { setLoading(false); }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      const { data } = await cartAPI.update({ itemId, quantity });
      setCart(data.cart);
    } catch (err) {
      console.error(err.response?.data?.message);
    }
  };

  const removeItem = async (itemId) => {
    try {
      const { data } = await cartAPI.remove(itemId);
      setCart(data.cart);
    } catch (err) { console.error(err); }
  };

  const clearCart = async () => {
    try {
      await cartAPI.clear();
      setCart({ items: [], total: 0 });
    } catch (err) { console.error(err); }
  };

  const cartCount = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;
  const cartTotal = cart?.items?.reduce((acc, item) => acc + (item.variantPrice * item.quantity), 0) || 0;

  return (
    <CartContext.Provider value={{
      cart, cartOpen, setCartOpen,
      loading, addToCart, updateQuantity,
      removeItem, clearCart, fetchCart,
      cartCount, cartTotal
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
