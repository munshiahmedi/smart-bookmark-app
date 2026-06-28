import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { BookOpen, ArrowLeft, User, Calendar, FileText, Edit, Trash2, Book, Star, MessageSquare } from 'lucide-react';
import Navbar from '../components/Navbar';

function BooksDetails() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);
  
  // Review states
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [avgRating, setAvgRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [reviewLoading, setReviewLoading] = useState(false);
  
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    // Get user role from localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    setUserRole(user?.role || 'user');

    // Fetch book details
    axios.get(`http://localhost:5000/api/books/${id}`)
      .then(res => {
        setBook(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setError('Failed to fetch book details. Please try again.');
        setLoading(false);
      });
      
    // Fetch reviews and average rating
    axios.get(`http://localhost:5000/api/books/reviews/${id}`)
      .then(res => {
        setReviews(res.data);
      })
      .catch(err => {
        console.error('Error fetching reviews:', err);
      });
      
    axios.get(`http://localhost:5000/api/books/reviews/avg/${id}`)
      .then(res => {
        setAvgRating(Number(res.data.avgRating) || 0);
        setTotalReviews(Number(res.data.totalReviews) || 0);
      })
      .catch(err => {
        console.error('Error fetching average rating:', err);
      });
  }, [id]);

  // Submit review function
  const submitReview = async () => {
    if (!token) {
      alert('Please login to submit a review');
      return;
    }

    if (!rating || rating < 1 || rating > 5) {
      alert('Please select a valid rating (1-5)');
      return;
    }

    setReviewLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/books/reviews', {
        bookId: parseInt(id),
        rating: parseInt(rating),
        comment: comment.trim()
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.message) {
        alert(res.data.message);
        // Refresh reviews
        const reviewsRes = await axios.get(`http://localhost:5000/api/books/reviews/${id}`);
        setReviews(reviewsRes.data);
        
        // Refresh average rating
        const avgRes = await axios.get(`http://localhost:5000/api/books/reviews/avg/${id}`);
        setAvgRating(Number(avgRes.data.avgRating) || 0);
        setTotalReviews(Number(avgRes.data.totalReviews) || 0);
        
        // Reset form
        setRating(5);
        setComment('');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert(error.response?.data?.error || 'Failed to submit review. Please try again.');
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-gray-600 text-lg font-medium">Loading book details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Error Loading Book</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Book Not Found</h2>
          <p className="text-gray-600 mb-6">The book you're looking for doesn't exist or has been removed.</p>
                  </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100" style={{minHeight: '100vh', background: 'linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%)'}}>
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 py-8" style={{maxWidth: '1152px', margin: '0 auto', padding: '32px 16px', overflowX: 'hidden'}}>
        {/* Book Details Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden" style={{backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', overflow: 'hidden', maxWidth: '100%', overflowX: 'hidden'}}>
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6" style={{background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 50%, #7c3aed 100%)', padding: '32px', position: 'relative', overflow: 'hidden'}}>
            <div className="absolute inset-0 bg-white opacity-5" style={{position: 'absolute', inset: '0', background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)'}}></div>
            <div className="relative z-10" style={{position: 'relative', zIndex: '10'}}>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-4" style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
                  {/* Back to Books Icon */}
                  <Link 
                    to="/books" 
                    className="text-white hover:text-blue-100 transition-colors"
                    style={{color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center'}}
                    title="Back to Books"
                  >
                    <ArrowLeft className="w-6 h-6 flex-shrink-0" style={{width: '24px', height: '24px', flexShrink: '0'}} />
                  </Link>
                  <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm" style={{width: '64px', height: '64px', backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)'}}>
                    <BookOpen className="w-8 h-8 text-white" style={{width: '32px', height: '32px', color: 'white'}} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h1 className="text-2xl md:text-3xl font-bold text-white line-clamp-2" style={{fontSize: 'clamp(20px, 4vw, 28px)', fontWeight: 'bold', color: 'white', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', textAlign: 'left', wordBreak: 'break-word'}}>{book.title}</h1>
                    <p className="text-blue-100 text-lg mt-1" style={{color: '#dbeafe', fontSize: 'clamp(16px, 2.5vw, 18px)', marginTop: '4px', textAlign: 'left', wordBreak: 'break-word'}}>Book Details</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8" style={{padding: '32px'}}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" style={{display: 'grid', gap: '32px'}}>
              {/* Book Image */}
              <div className="lg:col-span-1">
                <div className="relative bg-gray-100 rounded-2xl overflow-hidden shadow-lg" style={{backgroundColor: '#f3f4f6', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}}>
                  {book.image ? (
                    <img 
                      src={`http://localhost:5000${book.image}`} 
                      alt={book.title}
                      className="w-full h-64 lg:h-96 object-cover"
                      style={{width: '100%', height: '384px', objectFit: 'cover'}}
                    />
                  ) : (
                    <div className="w-full h-64 lg:h-96 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200" 
                         style={{width: '100%', height: '384px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)'}}>
                      <div className="text-center">
                        <BookOpen className="w-24 h-24 text-gray-400 mx-auto mb-4" style={{width: '96px', height: '96px', color: '#9ca3af', margin: '0 auto 16px'}} />
                        <p className="text-gray-500 font-medium">No Image Available</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Main Book Info */}
              <div className="lg:col-span-2 space-y-6" style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
                {/* Description Section */}
                <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-6" style={{background: 'linear-gradient(135deg, #f9fafb 0%, #ffffff 100%)', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px', wordWrap: 'break-word', overflowWrap: 'break-word'}}>
                  <div className="flex flex-col items-center gap-3 mb-4" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', marginBottom: '16px'}}>
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0" style={{width: '40px', height: '40px', backgroundColor: '#dbeafe', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                      <FileText className="w-5 h-5 text-blue-600" style={{width: '20px', height: '20px', color: '#2563eb'}} />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900" style={{fontSize: 'clamp(18px, 3vw, 20px)', fontWeight: '600', color: '#111827', textAlign: 'center', wordBreak: 'break-word'}}>Description</h2>
                  </div>
                  <p className="text-gray-700 leading-relaxed" style={{color: '#374151', lineHeight: '1.6', textAlign: 'center', wordBreak: 'break-word', overflowWrap: 'break-word'}}>
                    {book.description || 'No description available for this book.'}
                  </p>
                </div>

                {/* Additional Details */}
                <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-6" style={{background: 'linear-gradient(135deg, #f9fafb 0%, #ffffff 100%)', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px'}}>
                  <div className="flex flex-col items-center gap-3 mb-4" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', marginBottom: '16px'}}>
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0" style={{width: '40px', height: '40px', backgroundColor: '#f3e8ff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                      <Book className="w-5 h-5 text-purple-600" style={{width: '20px', height: '20px', color: '#9333ea'}} />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900" style={{fontSize: 'clamp(18px, 3vw, 20px)', fontWeight: '600', color: '#111827', textAlign: 'center', wordBreak: 'break-word'}}>Additional Information</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4" style={{display: 'grid', gap: '16px', justifyContent: 'center'}}>
                    <div className="flex flex-col items-center gap-3" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px'}}>
                      <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center" style={{width: '32px', height: '32px', backgroundColor: '#fed7aa', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                        <Calendar className="w-4 h-4 text-orange-600" style={{width: '16px', height: '16px', color: '#ea580c'}} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500" style={{fontSize: '14px', color: '#6b7280'}}>Published Year</p>
                        <p className="font-semibold text-gray-900" style={{fontWeight: '600', color: '#111827'}}>{book.published_year || 'N/A'}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-center gap-3" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px'}}>
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center" style={{width: '32px', height: '32px', backgroundColor: '#d1fae5', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                        <Book className="w-4 h-4 text-green-600" style={{width: '16px', height: '16px', color: '#059669'}} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500" style={{fontSize: '14px', color: '#6b7280'}}>ISBN</p>
                        <p className="font-semibold text-gray-900" style={{fontWeight: '600', color: '#111827'}}>{book.isbn || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6" style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
                {/* Quick Info Card */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6" style={{background: 'linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%)', border: '1px solid #bfdbfe', borderRadius: '12px', padding: '24px', wordWrap: 'break-word', overflowWrap: 'break-word'}}>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{fontSize: 'clamp(16px, 3vw, 18px)', fontWeight: '600', color: '#111827', marginBottom: '16px', textAlign: 'center', wordBreak: 'break-word'}}>Quick Info</h3>
                  
                  <div className="space-y-4" style={{display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center'}}>
                    {/* Author */}
                    <div className="flex flex-col items-center gap-3" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px'}}>
                      <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0" style={{width: '40px', height: '40px', backgroundColor: '#2563eb', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                        <User className="w-5 h-5 text-white" style={{width: '20px', height: '20px', color: 'white'}} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-gray-500" style={{fontSize: '14px', color: '#6b7280'}}>Author</p>
                        <p className="font-semibold text-gray-900" style={{fontWeight: '600', color: '#111827', wordBreak: 'break-word', overflowWrap: 'break-word'}}>{book.author}</p>
                      </div>
                    </div>
                    
                    {/* Price */}
                    <div className="flex flex-col items-center gap-3" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px'}}>
                      <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0" style={{width: '40px', height: '40px', backgroundColor: '#059669', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                        <span className="text-white font-bold" style={{color: 'white', fontWeight: 'bold'}}>Rs</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-gray-500" style={{fontSize: '14px', color: '#6b7280'}}>Price</p>
                        <p className="font-bold text-xl text-green-600" style={{fontSize: 'clamp(16px, 4vw, 20px)', fontWeight: 'bold', color: '#059669', wordBreak: 'break-word'}}>₹{book.price}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions Card */}
                <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-6" style={{background: 'linear-gradient(135deg, #f9fafb 0%, #ffffff 100%)', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px'}}>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '16px', textAlign: 'center'}}>Actions</h3>
                  
                  <div className="space-y-3" style={{display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center'}}>
                    {userRole === 'admin' && (
                      <Link to={`/edit-book/${book.id}`} className="flex items-center justify-center p-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                            style={{backgroundColor: '#ea580c', color: 'white', padding: '12px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', transition: 'background-color 0.2s'}}>
                        <Edit className="w-5 h-5" style={{width: '20px', height: '20px'}} />
                      </Link>
                    )}
                    
                    <Link to="/books" className="flex items-center justify-center p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          style={{backgroundColor: '#2563eb', color: 'white', padding: '12px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', transition: 'background-color 0.2s'}}>
                      <ArrowLeft className="w-5 h-5" style={{width: '20px', height: '20px'}} />
                    </Link>
                    
                                      </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Reviews Section */}
        <div className="mt-8" style={{marginTop: '32px'}}>
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden" style={{backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'}}>
            {/* Reviews Header */}
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 px-8 py-6" style={{background: 'linear-gradient(135deg, #eab308 0%, #f97316 100%)', padding: '32px'}}>
              <div className="flex items-center justify-between" style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                <div className="flex items-center gap-4" style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center backdrop-blur-sm" style={{width: '48px', height: '48px', backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)'}}>
                    <Star className="w-6 h-6 text-white" style={{width: '24px', height: '24px', color: 'white'}} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white" style={{fontSize: '24px', fontWeight: 'bold', color: 'white'}}>Reviews</h2>
                    <p className="text-yellow-100 text-sm mt-1" style={{color: '#fef3c7', fontSize: '14px', marginTop: '4px'}}>
                      {totalReviews} {totalReviews === 1 ? 'Review' : 'Reviews'}
                    </p>
                  </div>
                </div>
                
                {/* Average Rating Display */}
                <div className="text-right" style={{textAlign: 'right'}}>
                  <div className="flex items-center gap-2" style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                    <div className="flex items-center" style={{display: 'flex', alignItems: 'center'}}>
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-5 h-5 ${i < Math.floor(Number(avgRating) || 0) ? 'text-yellow-300 fill-current' : 'text-gray-300'}`} 
                          style={{width: '20px', height: '20px', fill: i < Math.floor(Number(avgRating) || 0) ? 'currentColor' : 'none'}}
                        />
                      ))}
                    </div>
                    <span className="text-white font-bold text-lg" style={{color: 'white', fontWeight: 'bold', fontSize: '18px'}}>
                      {avgRating && !isNaN(avgRating) ? Number(avgRating).toFixed(1) : 'N/A'}
                    </span>
                  </div>
                  <p className="text-yellow-100 text-xs mt-1" style={{color: '#fef3c7', fontSize: '12px', marginTop: '4px'}}>
                    Average Rating
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8" style={{padding: '32px'}}>
              {/* Add Review Form */}
              {token && (
                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-6 mb-8" 
                     style={{background: 'linear-gradient(135deg, #fef9c3 0%, #fed7aa 100%)', border: '1px solid #fde047', borderRadius: '12px', padding: '24px', marginBottom: '32px'}}>
                  <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2" 
                      style={{fontSize: '20px', fontWeight: '600', color: '#111827', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px'}}>
                    <MessageSquare className="w-5 h-5 text-orange-600" style={{width: '20px', height: '20px', color: '#ea580c'}} />
                    Add Your Review
                  </h3>
                  
                  <div className="space-y-4" style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
                    {/* Rating Select */}
                    <div style={{textAlign: 'left'}}>
                      <label className="block text-sm font-semibold text-gray-700 mb-2" 
                             style={{display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px'}}>
                        Rating ⭐
                      </label>
                      <select 
                        value={rating} 
                        onChange={(e) => setRating(parseInt(e.target.value))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                        style={{width: '100%', padding: '12px 16px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none', transition: 'all 0.2s', fontSize: '16px'}}
                      >
                        <option value="1">1 ⭐ - Poor</option>
                        <option value="2">2 ⭐⭐ - Fair</option>
                        <option value="3">3 ⭐⭐⭐ - Good</option>
                        <option value="4">4 ⭐⭐⭐⭐ - Very Good</option>
                        <option value="5">5 ⭐⭐⭐⭐⭐ - Excellent</option>
                      </select>
                    </div>

                    {/* Comment Textarea */}
                    <div style={{textAlign: 'left'}}>
                      <label className="block text-sm font-semibold text-gray-700 mb-2" 
                             style={{display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px'}}>
                        Your Review ✍️
                      </label>
                      <textarea 
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Share your thoughts about this book..."
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all resize-none"
                        style={{width: '100%', padding: '12px 16px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none', transition: 'all 0.2s', fontSize: '16px', resize: 'none', minHeight: '100px'}}
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      onClick={submitReview}
                      disabled={reviewLoading}
                      className="w-full bg-gradient-to-r from-orange-600 to-yellow-600 text-white py-3 rounded-lg font-semibold hover:from-orange-700 hover:to-yellow-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      style={{width: '100%', background: 'linear-gradient(90deg, #ea580c 0%, #f59e0b 100%)', color: 'white', padding: '12px', borderRadius: '8px', fontWeight: '600', cursor: reviewLoading ? 'not-allowed' : 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: reviewLoading ? 0.5 : 1}}
                    >
                      {reviewLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" 
                               style={{width: '16px', height: '16px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite'}} />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Star className="w-5 h-5" style={{width: '20px', height: '20px'}} />
                          Submit Review
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Reviews List */}
              <div className="space-y-4" style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
                <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2" 
                    style={{fontSize: '20px', fontWeight: '600', color: '#111827', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px'}}>
                  <MessageSquare className="w-5 h-5 text-orange-600" style={{width: '20px', height: '20px', color: '#ea580c'}} />
                  What Readers Are Saying
                </h3>
                
                {reviews.length === 0 ? (
                  <div className="text-center py-12" style={{textAlign: 'center', padding: '48px 0'}}>
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4" 
                         style={{width: '64px', height: '64px', backgroundColor: '#f3f4f6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px'}}>
                      <MessageSquare className="w-8 h-8 text-gray-400" style={{width: '32px', height: '32px', color: '#9ca3af'}} />
                    </div>
                    <p className="text-gray-500 text-lg" style={{color: '#6b7280', fontSize: '18px'}}>No reviews yet</p>
                    <p className="text-gray-400 text-sm mt-2" style={{color: '#9ca3af', fontSize: '14px', marginTop: '8px'}}>
                      Be the first to share your thoughts about this book!
                    </p>
                  </div>
                ) : (
                  reviews.map(review => (
                    <div key={review.id} className="bg-gray-50 border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all" 
                         style={{backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px', transition: 'all 0.3s'}}>
                      <div className="flex items-start justify-between mb-4" style={{display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px'}}>
                        <div className="flex items-center gap-3" style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center" 
                               style={{width: '40px', height: '40px', backgroundColor: '#fed7aa', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                            <span className="text-orange-600 font-bold text-sm" style={{color: '#ea580c', fontWeight: 'bold', fontSize: '14px'}}>
                              {review.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900" style={{fontWeight: '600', color: '#111827'}}>{review.name}</p>
                            <p className="text-xs text-gray-500" style={{fontSize: '12px', color: '#6b7280'}}>
                              {new Date(review.created_at).toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })}
                            </p>
                          </div>
                        </div>
                        
                        {/* Rating Stars */}
                        <div className="flex items-center gap-1" style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                              style={{width: '16px', height: '16px', fill: i < review.rating ? 'currentColor' : 'none'}}
                            />
                          ))}
                          <span className="text-sm font-semibold text-gray-700 ml-2" style={{fontSize: '14px', fontWeight: '600', color: '#374151', marginLeft: '8px'}}>
                            {review.rating}/5
                          </span>
                        </div>
                      </div>
                      
                      {/* Review Comment */}
                      {review.comment && (
                        <p className="text-gray-700 leading-relaxed" style={{color: '#374151', lineHeight: '1.6'}}>
                          {review.comment}
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BooksDetails;
