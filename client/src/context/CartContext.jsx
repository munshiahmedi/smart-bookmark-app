import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');

  // Fetch cart items
  const fetchCart = async () => {
    if (!token) return;
    
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/books/cart', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCartItems(response.data);
      // Calculate total items count
      const totalCount = response.data.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(totalCount);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add to cart
  const addToCart = async (bookId) => {
    if (!token) {
      alert('Please login to add books to cart');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/books/cart',
        { bookId: bookId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update local state
      setCartCount(prev => prev + 1);
      
      // Show success message
      showNotification('Item added to cart!');

      // Refresh cart data
      fetchCart();
    } catch (err) {
      console.error('Error adding to cart:', err);
      alert(err.response?.data?.error || 'Failed to add to cart');
    }
  };

  // Remove from cart
  const removeFromCart = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/books/cart/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update local state
      const removedItem = cartItems.find(item => item.id === id);
      if (removedItem) {
        setCartCount(prev => Math.max(0, prev - removedItem.quantity));
      }
      
      showNotification('Item removed from cart');
      fetchCart();
    } catch (err) {
      console.error('Error removing item:', err);
      alert('Failed to remove item');
    }
  };

  // Update quantity
  const updateQuantity = async (id, qty) => {
    if (qty < 1) return;
    
    try {
      await axios.put(`http://localhost:5000/api/books/cart/${id}`,
        { quantity: qty },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update local state
      const item = cartItems.find(item => item.id === id);
      if (item) {
        const difference = qty - item.quantity;
        setCartCount(prev => prev + difference);
      }
      
      fetchCart();
    } catch (err) {
      console.error('Error updating quantity:', err);
      alert('Failed to update quantity');
    }
  };

  // Show notification
  const showNotification = (message) => {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-pulse';
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 80px;
      right: 16px;
      background: linear-gradient(135deg, #059669 0%, #14b8a6 100%);
      color: white;
      padding: 12px 24px;
      border-radius: 8px;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      z-index: 9999;
      animation: slideInRight 0.3s ease-out;
    `;

    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideInRight {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      @keyframes slideOutRight {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(100%);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);

    document.body.appendChild(notification);

    // Remove notification after 3 seconds
    setTimeout(() => {
      notification.style.animation = 'slideOutRight 0.3s ease-out';
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  };

  // Fetch cart on component mount and when token changes
  useEffect(() => {
    fetchCart();
  }, [token]);

  const value = {
    cartItems,
    cartCount,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    fetchCart,
    showNotification
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
