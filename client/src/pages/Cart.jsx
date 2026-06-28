import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ShoppingCart, Plus, Minus, Trash2, ArrowLeft, ShoppingBag } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';

function Cart() {
  const { cartItems, loading, error, removeFromCart, updateQuantity } = useCart();
  const token = localStorage.getItem('token');

  useEffect(() => {
    // Error handling is now managed by the context
  }, [token]);

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading cart...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingCart className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Cart Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link to="/books">
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Browse Books
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100" style={{minHeight: '100vh', background: 'linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%)', paddingBottom: '50px'}}>
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8" style={{maxWidth: '1280px', margin: '0 auto', padding: '32px 16px 60px 16px'}}>
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-green-600 to-teal-600 px-8 py-6" style={{background: 'linear-gradient(135deg, #059669 0%, #14b8a6 100%)', padding: '32px', position: 'relative', overflow: 'hidden'}}>
            <div className="absolute inset-0 bg-white opacity-5" style={{position: 'absolute', inset: '0', background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)'}}></div>
            <div className="relative z-10" style={{position: 'relative', zIndex: '10'}}>
              <div className="flex items-center gap-4">
                {/* Back to Books Icon */}
                <Link 
                  to="/books" 
                  className="text-white hover:text-green-100 transition-colors"
                  style={{color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center'}}
                  title="Back to Books"
                >
                  <ArrowLeft className="w-6 h-6 flex-shrink-0" style={{width: '24px', height: '24px'}} />
                </Link>
                <div className="bg-white bg-opacity-20 p-3 rounded-full backdrop-blur-sm" style={{backgroundColor: 'rgba(255,255,255,0.2)', padding: '12px', borderRadius: '50%', backdropFilter: 'blur(4px)'}}>
                  <ShoppingCart className="w-8 h-8 text-white" style={{width: '32px', height: '32px', color: 'white'}} />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white" style={{fontSize: '32px', fontWeight: 'bold', color: 'white', margin: '0'}}>My Cart</h1>
                  <p className="text-green-100 text-sm mt-1" style={{color: '#d1fae5', fontSize: '14px', marginTop: '12px'}}>
                    {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4" style={{width: '80px', height: '80px', backgroundColor: '#f3f4f6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px'}}>
              <ShoppingCart className="w-10 h-10 text-gray-400" style={{width: '40px', height: '40px', color: '#9ca3af'}} />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2" style={{fontSize: '20px', fontWeight: '600', color: '#1f2937', marginBottom: '8px'}}>Your cart is empty</h3>
            <p className="text-gray-600 mb-6" style={{color: '#4b5563', marginBottom: '24px'}}>Start adding some books to your cart!</p>
            <Link to="/books">
              <button className="bg-gradient-to-r from-green-600 to-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-teal-700 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl mx-auto" 
                      style={{background: 'linear-gradient(90deg, #059669 0%, #14b8a6 100%)', color: 'white', padding: '12px 24px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', margin: '0 auto'}}>
                <ShoppingBag className="w-5 h-5" style={{width: '20px', height: '20px'}} />
                Browse Books
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" style={{display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px'}}>
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="p-6" style={{padding: '24px'}}>
                  <h2 className="text-xl font-semibold text-gray-800 mb-6" style={{fontSize: '20px', fontWeight: '600', color: '#1f2937', marginBottom: '24px'}}>Cart Items</h2>
                  
                  <div className="space-y-4" style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
                    {cartItems.map(item => (
                      <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow" style={{border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px', transition: 'box-shadow 0.2s'}}>
                        <div className="flex gap-4" style={{display: 'flex', gap: '16px'}}>
                          {/* Book Image */}
                          <div className="w-20 h-28 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0" style={{width: '80px', height: '112px', backgroundColor: '#f3f4f6', borderRadius: '8px', overflow: 'hidden', flexShrink: '0'}}>
                            {item.image ? (
                              <img 
                                src={`http://localhost:5000${item.image}`} 
                                alt={item.title}
                                className="w-full h-full object-cover"
                                style={{width: '100%', height: '100%', objectFit: 'cover'}}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200" 
                                   style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)'}}>
                                <ShoppingBag className="w-8 h-8 text-gray-400" style={{width: '32px', height: '32px', color: '#9ca3af'}} />
                              </div>
                            )}
                          </div>
                          
                          {/* Book Details */}
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-800 mb-1" style={{fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '4px'}}>
                              {item.title}
                            </h3>
                            <p className="text-gray-600 text-sm mb-3" style={{color: '#4b5563', fontSize: '14px', marginBottom: '12px'}}>
                              {item.description && item.description.length > 100 ? `${item.description.substring(0, 100)}...` : item.description}
                            </p>
                            
                            {/* Price and Quantity */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-green-600 font-bold" style={{color: '#059669', fontWeight: 'bold'}}>Rs</span>
                                <span className="text-2xl font-bold text-green-600" style={{fontSize: '24px', fontWeight: 'bold', color: '#059669'}}>{item.price}</span>
                              </div>
                              
                              {/* Quantity Controls */}
                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1" style={{display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#f3f4f6', borderRadius: '8px', padding: '4px'}}>
                                  <button 
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    className="w-8 h-8 bg-white rounded-md flex items-center justify-center hover:bg-gray-200 transition-colors"
                                    style={{width: '32px', height: '32px', backgroundColor: 'white', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'background-color 0.2s', border: 'none'}}
                                  >
                                    <Minus className="w-4 h-4 text-gray-600" style={{width: '16px', height: '16px', color: '#4b5563'}} />
                                  </button>
                                  
                                  <input 
                                    type="number" 
                                    value={item.quantity}
                                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                                    className="w-12 text-center border-0 bg-transparent font-medium"
                                    style={{width: '48px', textAlign: 'center', border: 'none', backgroundColor: 'transparent', fontWeight: '500', outline: 'none'}}
                                    min="1"
                                  />
                                  
                                  <button 
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    className="w-8 h-8 bg-white rounded-md flex items-center justify-center hover:bg-gray-200 transition-colors"
                                    style={{width: '32px', height: '32px', backgroundColor: 'white', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'background-color 0.2s', border: 'none'}}
                                  >
                                    <Plus className="w-4 h-4 text-gray-600" style={{width: '16px', height: '16px', color: '#4b5563'}} />
                                  </button>
                                </div>
                                
                                <button 
                                  onClick={() => removeFromCart(item.id)}
                                  className="w-8 h-8 bg-red-100 text-red-600 rounded-md flex items-center justify-center hover:bg-red-200 transition-colors"
                                  style={{width: '32px', height: '32px', backgroundColor: '#fef2f2', color: '#dc2626', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'background-color 0.2s', border: 'none'}}
                                  title="Remove item"
                                >
                                  <Trash2 className="w-4 h-4" style={{width: '16px', height: '16px'}} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden sticky top-8" style={{position: 'sticky', top: '32px'}}>
                <div className="bg-gradient-to-r from-green-600 to-teal-600 p-6" style={{background: 'linear-gradient(135deg, #059669 0%, #14b8a6 100%)', padding: '24px'}}>
                  <h2 className="text-xl font-semibold text-white" style={{fontSize: '20px', fontWeight: '600', color: 'white'}}>Order Summary</h2>
                </div>
                
                <div className="p-6" style={{padding: '24px'}}>
                  <div className="space-y-3 mb-6" style={{display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px'}}>
                    <div className="flex justify-between text-gray-600" style={{display: 'flex', justifyContent: 'space-between', color: '#4b5563'}}>
                      <span>Subtotal ({cartItems.length} items)</span>
                      <span className="font-medium" style={{fontWeight: '500'}}>Rs {total}</span>
                    </div>
                    <div className="flex justify-between text-gray-600" style={{display: 'flex', justifyContent: 'space-between', color: '#4b5563'}}>
                      <span>Delivery</span>
                      <span className="font-medium text-green-600" style={{fontWeight: '500', color: '#059669'}}>FREE</span>
                    </div>
                    <div className="border-t pt-3" style={{borderTop: '1px solid #e5e7eb', paddingTop: '12px'}}>
                      <div className="flex justify-between text-lg font-bold text-gray-800" style={{display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 'bold', color: '#1f2937'}}>
                        <span>Total</span>
                        <span className="text-green-600" style={{color: '#059669'}}>Rs {total}</span>
                      </div>
                    </div>
                  </div>
                  
                  <button className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                          style={{background: 'linear-gradient(90deg, #059669 0%, #14b8a6 100%)', color: 'white', padding: '12px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}}>
                    Proceed to Checkout
                  </button>
                  
                  <Link to="/books">
                    <button className="w-full mt-3 bg-gray-200 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                            style={{backgroundColor: '#e5e7eb', color: '#1f2937', padding: '12px', borderRadius: '8px', fontWeight: '500', cursor: 'pointer', transition: 'background-color 0.2s', border: 'none', marginTop: '12px'}}>
                      Continue Shopping
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;
