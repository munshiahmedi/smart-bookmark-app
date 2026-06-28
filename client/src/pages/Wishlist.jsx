import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Heart, BookOpen, ArrowLeft, Trash2, User, Calendar, Tag } from 'lucide-react';
import Navbar from '../components/Navbar';

function Wishlist() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    console.log('Wishlist useEffect triggered');
    console.log('Token:', token ? 'exists' : 'missing');
    
    if (!token) {
      setError('Please login to view your wishlist');
      setLoading(false);
      return;
    }

    console.log('Making wishlist API call...');
    axios.get('http://localhost:5000/api/books/wishlist', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      console.log('Wishlist API response:', res);
      console.log('Response data:', res.data);
      console.log('Response data type:', typeof res.data);
      console.log('Is array?', Array.isArray(res.data));
      
      // Handle both array and object responses
      let wishlistData = res.data;
      if (!Array.isArray(res.data)) {
        // If response is not an array, try to extract array or handle error
        if (res.data.error) {
          setError(res.data.error);
          setLoading(false);
          return;
        }
        wishlistData = []; // Default to empty array
      }
      
      console.log('Setting books to:', wishlistData);
      setBooks(wishlistData);
      setLoading(false);
    })
    .catch(err => {
      console.error('Error fetching wishlist:', err);
      setError('Failed to load wishlist. Please try again.');
      setLoading(false);
    });
  }, [token]);

  const removeFromWishlist = async (bookId) => {
    if (!token) return;

    try {
      await axios.delete(`http://localhost:5000/api/books/wishlist/${bookId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBooks(prev => prev.filter(book => book.id !== bookId));
      alert("💔 Removed from wishlist");
    } catch (err) {
      console.error('Error removing from wishlist:', err);
      alert(err.response?.data?.error || 'Failed to remove from wishlist');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-gray-600 text-lg font-medium">Loading your wishlist...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link to="/books">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto" 
                    style={{backgroundColor: '#2563eb', color: 'white', padding: '12px 24px', borderRadius: '8px', fontWeight: '500', cursor: 'pointer', transition: 'background-color 0.2s', display: 'flex', alignItems: 'center', gap: '8px', border: 'none', margin: '0 auto'}}>
              <ArrowLeft className="w-5 h-5" style={{width: '20px', height: '20px'}} />
              Browse Books
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100" style={{minHeight: '100vh', background: 'linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%)'}}>
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 py-8" style={{maxWidth: '1152px', margin: '0 auto', padding: '32px 16px'}}>
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8" style={{backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', padding: '32px', marginBottom: '32px'}}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4" style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center" style={{width: '64px', height: '64px', background: 'linear-gradient(135deg, #ef4444 0%, #ec4899 100%)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <Heart className="w-8 h-8 text-white" style={{width: '32px', height: '32px', color: 'white'}} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800" style={{fontSize: '28px', fontWeight: 'bold', color: '#1f2937'}}>My Wishlist</h1>
                <p className="text-gray-600 mt-1" style={{color: '#4b5563', marginTop: '4px'}}>
                  {books.length} {books.length === 1 ? 'book' : 'books'} saved
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Wishlist Books */}
        {books.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center" style={{backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', padding: '48px', textAlign: 'center'}}>
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6" style={{width: '80px', height: '80px', backgroundColor: '#f3f4f6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px'}}>
              <Heart className="w-10 h-10 text-gray-400" style={{width: '40px', height: '40px', color: '#9ca3af'}} />
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-3" style={{fontSize: '24px', fontWeight: '600', color: '#1f2937', marginBottom: '12px'}}>Your Wishlist is Empty</h3>
            <p className="text-gray-600 mb-8 text-lg" style={{color: '#4b5563', marginBottom: '32px', fontSize: '18px'}}>Start adding books you love to your wishlist!</p>
            <Link to="/books">
              <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center gap-3 shadow-lg hover:shadow-xl mx-auto text-lg" 
                      style={{background: 'linear-gradient(90deg, #2563eb 0%, #4f46e5 100%)', color: 'white', padding: '16px 32px', borderRadius: '12px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', margin: '0 auto', fontSize: '18px'}}>
                <BookOpen className="w-6 h-6" style={{width: '24px', height: '24px'}} />
                Explore Books
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px'}}>
            {books.map(book => (
              <div key={book.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group" 
                   style={{backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', transition: 'all 0.3s', overflow: 'hidden'}}>
                {/* Book Image */}
                <div className="relative h-48 bg-gray-100 overflow-hidden" style={{height: '192px', backgroundColor: '#f3f4f6', overflow: 'hidden', position: 'relative'}}>
                  {book.image ? (
                    <img 
                      src={`http://localhost:5000${book.image}`} 
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      style={{width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s'}}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200" 
                         style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)'}}>
                      <BookOpen className="w-16 h-16 text-gray-400" style={{width: '64px', height: '64px', color: '#9ca3af'}} />
                    </div>
                  )}
                  
                  {/* Wishlist Badge */}
                  <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1" 
                       style={{position: 'absolute', top: '12px', right: '12px', backgroundColor: '#ef4444', color: 'white', padding: '4px 12px', borderRadius: '9999px', fontSize: '12px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px'}}>
                    <Heart className="w-3 h-3 fill-current" style={{width: '12px', height: '12px'}} />
                    Saved
                  </div>
                </div>
                
                {/* Book Card Header */}
                <div className="bg-gradient-to-r from-red-500 to-pink-500 p-4" style={{background: 'linear-gradient(90deg, #ef4444 0%, #ec4899 100%)', padding: '16px'}}>
                  <h3 className="text-lg font-bold text-white line-clamp-2" style={{fontSize: '18px', fontWeight: 'bold', color: 'white', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>
                    {book.title}
                  </h3>
                </div>
                
                {/* Book Card Body */}
                <div className="p-6" style={{padding: '24px'}}>
                  <div className="space-y-3" style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
                    {/* Author */}
                    <div className="flex items-center gap-2 text-gray-600" style={{display: 'flex', alignItems: 'center', gap: '8px', color: '#4b5563'}}>
                      <User className="w-4 h-4" style={{width: '16px', height: '16px'}} />
                      <span className="text-sm" style={{fontSize: '14px'}}>{book.author}</span>
                    </div>
                    
                    {/* Price */}
                    <div className="flex items-center gap-2">
                      <span className="text-green-600 font-bold" style={{color: '#059669', fontWeight: 'bold', fontSize: '16px'}}>Rs</span>
                      <span className="text-2xl font-bold text-green-600" style={{fontSize: '24px', fontWeight: 'bold', color: '#059669'}}>{book.price}</span>
                    </div>
                    
                    {/* Description */}
                    {book.description && (
                      <div className="text-gray-600 text-sm line-clamp-3" style={{color: '#4b5563', fontSize: '14px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>
                        {book.description}
                      </div>
                    )}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-6" style={{display: 'flex', gap: '8px', marginTop: '24px'}}>
                    <Link to={`/books/${book.id}`} className="flex-1">
                      <button className="w-full bg-blue-600 text-white py-2 px-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-1 text-sm"
                              style={{backgroundColor: '#2563eb', color: 'white', padding: '8px 12px', borderRadius: '8px', fontWeight: '500', cursor: 'pointer', transition: 'background-color 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', fontSize: '14px', border: 'none'}}>
                        View Details
                      </button>
                    </Link>
                    
                    <button 
                      onClick={() => removeFromWishlist(book.id)}
                      className="bg-red-600 text-white py-2 px-3 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center text-sm"
                      style={{backgroundColor: '#dc2626', color: 'white', padding: '8px 12px', borderRadius: '8px', fontWeight: '500', cursor: 'pointer', transition: 'background-color 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', border: 'none'}}
                    >
                      <Trash2 className="w-3 h-3" style={{width: '12px', height: '12px'}} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Browse Books Button at Bottom */}
        <div className="mt-8 text-center" style={{marginTop: '32px', textAlign: 'center'}}>
          <Link to="/books">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto" 
                    style={{backgroundColor: '#2563eb', color: 'white', padding: '12px 24px', borderRadius: '8px', fontWeight: '500', cursor: 'pointer', transition: 'background-color 0.2s', display: 'flex', alignItems: 'center', gap: '8px', border: 'none', margin: '0 auto'}}>
              <ArrowLeft className="w-5 h-5" style={{width: '20px', height: '20px'}} />
              Browse Books
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Wishlist;
