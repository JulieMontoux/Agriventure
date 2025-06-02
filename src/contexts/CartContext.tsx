import React, { createContext, useContext, useState, ReactNode } from "react";

// contexte pour le panier

export interface CartItem {
  id: number;
  title: string;
  price: number;        // prix par kg
  imageUrl: string;
  quantity: number;     // nombre d'unités
  unitWeight: number;   // poids en kg par unité
}

interface CartContextProps {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, amount: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (item: Omit<CartItem, "quantity">, quantity: number = 1) => {
    setCart(prev => {
      const existing = prev.find(p => p.id === item.id);
      if (existing) {
        return prev.map(p =>
          p.id === item.id ? { ...p, quantity: p.quantity + quantity } : p
        );
      } else {
        return [...prev, { ...item, quantity }];
      }
    });
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(p => p.id !== id));
  };

  const updateQuantity = (id: number, amount: number) => {
    setCart(prev =>
      prev.map(p =>
        p.id === id ? { ...p, quantity: Math.max(1, p.quantity + amount) } : p
      )
    );
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
