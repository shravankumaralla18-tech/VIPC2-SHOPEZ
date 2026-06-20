import { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';
import API from '../services/api';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load cart on startup or user state change
  useEffect(() => {
    const loadCart = async () => {
      if (user) {
        setLoading(true);
        try {
          const { data } = await API.get('/orders/cart');
          // Backend returns cart with items: [{ product: {...}, quantity: number }]
          setCartItems(data.items || []);
        } catch (error) {
          console.error('Failed to fetch cart from server', error);
        } finally {
          setLoading(false);
        }
      } else {
        // Load from localStorage for guests
        const localCart = localStorage.getItem('cartItems');
        if (localCart) {
          setCartItems(JSON.parse(localCart));
        } else {
          setCartItems([]);
        }
      }
    };

    loadCart();
  }, [user]);

  // Save cart to DB or localStorage whenever it changes
  const syncCart = async (items) => {
    if (user) {
      try {
        // Post current items to backend. Backend expects [{ product: ID, quantity }]
        const backendItems = items.map(item => ({
          product: item.product._id || item.product,
          quantity: item.quantity
        }));
        await API.post('/orders/cart', { items: backendItems });
      } catch (error) {
        console.error('Failed to sync cart with server', error);
      }
    } else {
      localStorage.setItem('cartItems', JSON.stringify(items));
    }
  };

  const addToCart = (product, quantity = 1) => {
    setCartItems(prevItems => {
      const existItem = prevItems.find(x => (x.product._id || x.product) === product._id);
      let newItems;

      if (existItem) {
        newItems = prevItems.map(x =>
          (x.product._id || x.product) === product._id
            ? { ...x, quantity: Math.min(product.stock, x.quantity + quantity) }
            : x
        );
      } else {
        newItems = [...prevItems, { product, quantity }];
      }

      syncCart(newItems);
      return newItems;
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems => {
      const newItems = prevItems.filter(x => (x.product._id || x.product) !== productId);
      syncCart(newItems);
      return newItems;
    });
  };

  const updateQuantity = (productId, quantity) => {
    setCartItems(prevItems => {
      const newItems = prevItems.map(x =>
        (x.product._id || x.product) === productId
          ? { ...x, quantity: Math.max(1, quantity) }
          : x
      );
      syncCart(newItems);
      return newItems;
    });
  };

  const clearCart = async () => {
    setCartItems([]);
    if (user) {
      try {
        await API.post('/orders/cart', { items: [] });
      } catch (error) {
        console.error('Failed to clear cart on server', error);
      }
    } else {
      localStorage.removeItem('cartItems');
    }
  };

  // Helper selectors
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const cartSubtotal = cartItems.reduce((acc, item) => {
    const price = item.product.price || 0;
    return acc + price * item.quantity;
  }, 0);

  const cartTotal = cartItems.reduce((acc, item) => {
    const price = item.product.price || 0;
    const discount = item.product.discount || 0;
    const finalPrice = price * (1 - discount / 100);
    return acc + finalPrice * item.quantity;
  }, 0);

  const cartDiscountSavings = cartSubtotal - cartTotal;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        cartTotal,
        cartDiscountSavings,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
