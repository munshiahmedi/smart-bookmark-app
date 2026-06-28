import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BookOpen, Plus, ArrowLeft, FileText, User, Upload, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

function AddBook() {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);
  const [book, setBook] = useState({
    title: '',
    author: '',
    description: '',
    price: '',
    category: '',
    status: 'draft'
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Check user role and redirect if not admin
    const user = JSON.parse(localStorage.getItem('user'));
    const role = user?.role || 'user';
    setUserRole(role);
    
    if (role !== 'admin') {
      navigate('/books');
      return;
    }
  }, [navigate]);

  const handleChange = (e) => {
    setBook({ ...book, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      const formData = new FormData();
      formData.append('title', book.title);
      formData.append('author', book.author);
      formData.append('description', book.description);
      formData.append('price', book.price);
      formData.append('category', book.category);
      formData.append('status', book.status);
      if (image) {
        formData.append('image', image);
      }
      
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/books", formData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setSuccess(true);
      setBook({ title: '', author: '', description: '', price: '', category: '', status: 'draft' });
      setImage(null);
      setImagePreview(null);
      alert("Book added successfully");
    } catch (error) {
      console.error('Add book error:', error);
      if (error.response) {
        // Server responded with error status
        console.error('Server response:', error.response.data);
        setError(error.response.data.error || 'Failed to add book. Please try again.');
      } else if (error.request) {
        // Request was made but no response received
        console.error('No response received:', error.request);
        setError('Network error. Please check your connection.');
      } else {
        // Something else happened
        console.error('Error message:', error.message);
        setError('Failed to add book. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100" style={{minHeight: '100vh', background: 'linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%)'}}>
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-8" style={{maxWidth: '1024px', margin: '0 auto', padding: '32px 16px'}}>
        
        {/* Main Add Book Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden" style={{backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'}}>
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-teal-600 px-8 py-6" style={{background: 'linear-gradient(135deg, #059669 0%, #14b8a6 50%, #10b981 100%)', padding: '32px', position: 'relative', overflow: 'hidden'}}>
            <div className="absolute inset-0 bg-white opacity-5" style={{position: 'absolute', inset: '0', background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)'}}></div>
            <div className="relative z-10" style={{position: 'relative', zIndex: '10'}}>
              <div className="flex items-center gap-4" style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
                {/* Back to Books Icon */}
                <Link 
                  to="/books" 
                  className="text-white hover:text-green-100 transition-colors"
                  style={{color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center'}}
                  title="Back to Books"
                >
                  <ArrowLeft className="w-6 h-6 flex-shrink-0" style={{width: '24px', height: '24px', flexShrink: '0'}} />
                </Link>
                <div className="bg-white bg-opacity-20 p-3 rounded-full backdrop-blur-sm" style={{backgroundColor: 'rgba(255,255,255,0.2)', padding: '12px', borderRadius: '50%', backdropFilter: 'blur(4px)'}}>
                  <Plus className="w-8 h-8 text-white" style={{width: '32px', height: '32px', color: 'white'}} />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white" style={{fontSize: '32px', fontWeight: 'bold', color: 'white', margin: '0'}}>Add New Book</h1>
                  <p className="text-green-100 text-sm mt-1" style={{color: '#d1fae5', fontSize: '14px', marginTop: '12px'}}>Add a new book to your collection</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8" style={{padding: '32px'}}>
            {/* Success/Error Messages */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6" 
                   style={{backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '12px 16px', borderRadius: '8px', marginBottom: '24px'}}>
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6" 
                   style={{backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', color: '#15803d', padding: '12px 16px', borderRadius: '8px', marginBottom: '24px'}}>
                Book added successfully!
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6" style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
              {/* Book Title */}
              <div>
                <div className="flex items-center gap-2 mb-3" style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px'}}>
                  <div className="w-6 h-6 rounded-md bg-gray-100 flex items-center justify-center" 
                       style={{width: '24px', height: '24px', backgroundColor: '#f3f4f6', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <BookOpen className="w-3 h-3 text-gray-600" style={{width: '12px', height: '12px', color: '#4b5563'}} />
                  </div>
                  <label className="text-sm font-medium text-gray-700" 
                         style={{fontSize: '14px', fontWeight: '500', color: '#374151', display: 'block'}}>
                    Book Title <span style={{color: '#ef4444'}}>*</span>
                  </label>
                </div>
                <input
                  name="title"
                  type="text"
                  placeholder="Enter book title"
                  value={book.title}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="focus:ring-blue-500 focus:border-blue-500"
                  style={{width: '100%', padding: '12px 16px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none', transition: 'all 0.2s', fontSize: '16px', height: '48px', boxSizing: 'border-box', backgroundColor: '#ffffff', opacity: loading ? 0.5 : 1, cursor: loading ? 'not-allowed' : 'text'}}
                  onFocus={(e) => e.target.style.borderColor = '#059669'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                />
              </div>

              {/* Author */}
              <div>
                <div className="flex items-center gap-2 mb-3" style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px'}}>
                  <div className="w-6 h-6 rounded-md bg-gray-100 flex items-center justify-center" 
                       style={{width: '24px', height: '24px', backgroundColor: '#f3f4f6', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <User className="w-3 h-3 text-gray-600" style={{width: '12px', height: '12px', color: '#4b5563'}} />
                  </div>
                  <label className="text-sm font-medium text-gray-700" 
                         style={{fontSize: '14px', fontWeight: '500', color: '#374151', display: 'block'}}>
                    Author <span style={{color: '#ef4444'}}>*</span>
                  </label>
                </div>
                <input
                  name="author"
                  type="text"
                  placeholder="Enter author name"
                  value={book.author}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className=""
                  style={{width: '100%', padding: '12px 16px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none', transition: 'all 0.2s', fontSize: '16px', height: '48px', boxSizing: 'border-box', backgroundColor: '#ffffff', opacity: loading ? 0.5 : 1, cursor: loading ? 'not-allowed' : 'text'}}
                  onFocus={(e) => e.target.style.borderColor = '#059669'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                />
              </div>

              {/* Description */}
              <div>
                <div className="flex items-center gap-2 mb-3" style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px'}}>
                  <div className="w-6 h-6 rounded-md bg-gray-100 flex items-center justify-center" 
                       style={{width: '24px', height: '24px', backgroundColor: '#f3f4f6', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <FileText className="w-3 h-3 text-gray-600" style={{width: '12px', height: '12px', color: '#4b5563'}} />
                  </div>
                  <label className="text-sm font-medium text-gray-700" 
                         style={{fontSize: '14px', fontWeight: '500', color: '#374151', display: 'block'}}>
                    Description
                  </label>
                </div>
                <textarea
                  name="description"
                  placeholder="Enter book description (optional)"
                  value={book.description}
                  onChange={handleChange}
                  disabled={loading}
                  rows={4}
                  className=""
                  style={{width: '100%', padding: '12px 16px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none', transition: 'all 0.2s', fontSize: '16px', height: '120px', boxSizing: 'border-box', backgroundColor: '#ffffff', opacity: loading ? 0.5 : 1, cursor: loading ? 'not-allowed' : 'text', resize: 'none'}}
                  onFocus={(e) => e.target.style.borderColor = '#059669'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                />
              </div>

              {/* Category */}
              <div>
                <div className="flex items-center gap-2 mb-3" style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px'}}>
                  <div className="w-6 h-6 rounded-md bg-gray-100 flex items-center justify-center" 
                       style={{width: '24px', height: '24px', backgroundColor: '#f3f4f6', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <FileText className="w-3 h-3 text-gray-600" style={{width: '12px', height: '12px', color: '#4b5563'}} />
                  </div>
                  <label className="text-sm font-medium text-gray-700" 
                         style={{fontSize: '14px', fontWeight: '500', color: '#374151', display: 'block'}}>
                    Category/Collection Type
                  </label>
                </div>
                <select
                  name="category"
                  value={book.category}
                  onChange={handleChange}
                  disabled={loading}
                  className=""
                  style={{width: '100%', padding: '12px 16px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none', transition: 'all 0.2s', fontSize: '16px', height: '48px', boxSizing: 'border-box', backgroundColor: '#ffffff', opacity: loading ? 0.5 : 1, cursor: loading ? 'not-allowed' : 'text'}}
                  onFocus={(e) => e.target.style.borderColor = '#059669'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                >
                  <option value="">Select Category</option>
                  <option value="Fiction">Fiction</option>
                  <option value="Non-Fiction">Non-Fiction</option>
                  <option value="Science">Science</option>
                  <option value="Technology">Technology</option>
                  <option value="Business">Business</option>
                  <option value="Self-Help">Self-Help</option>
                  <option value="Biography">Biography</option>
                  <option value="History">History</option>
                  <option value="Romance">Romance</option>
                  <option value="Mystery">Mystery</option>
                  <option value="Fantasy">Fantasy</option>
                  <option value="Children">Children</option>
                  <option value="Educational">Educational</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Price */}
              <div>
                <div className="flex items-center gap-2 mb-3" style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px'}}>
                  <div className="w-6 h-6 rounded-md bg-gray-100 flex items-center justify-center" 
                       style={{width: '24px', height: '24px', backgroundColor: '#f3f4f6', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <span className="text-xs font-semibold text-gray-600" style={{fontSize: '10px', fontWeight: '600', color: '#4b5563'}}>Rs</span>
                  </div>
                  <label className="text-sm font-medium text-gray-700" 
                         style={{fontSize: '14px', fontWeight: '500', color: '#374151', display: 'block'}}>
                    Price (₹) <span style={{color: '#ef4444'}}>*</span>
                  </label>
                </div>
                <input
                  name="price"
                  type="number"
                  placeholder="0.00"
                  value={book.price}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  min="0"
                  step="0.01"
                  className=""
                  style={{width: '100%', padding: '12px 16px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none', transition: 'all 0.2s', fontSize: '16px', height: '48px', boxSizing: 'border-box', backgroundColor: '#ffffff', opacity: loading ? 0.5 : 1, cursor: loading ? 'not-allowed' : 'text'}}
                  onFocus={(e) => e.target.style.borderColor = '#059669'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                />
              </div>

              {/* Status */}
              <div>
                <div className="flex items-center gap-2 mb-3" style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px'}}>
                  <div className="w-6 h-6 rounded-md bg-gray-100 flex items-center justify-center" 
                       style={{width: '24px', height: '24px', backgroundColor: '#f3f4f6', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <FileText className="w-3 h-3 text-gray-600" style={{width: '12px', height: '12px', color: '#4b5563'}} />
                  </div>
                  <label className="text-sm font-medium text-gray-700" 
                         style={{fontSize: '14px', fontWeight: '500', color: '#374151', display: 'block'}}>
                    Status <span style={{color: '#ef4444'}}>*</span>
                  </label>
                </div>
                <select
                  name="status"
                  value={book.status}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className=""
                  style={{width: '100%', padding: '12px 16px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none', transition: 'all 0.2s', fontSize: '16px', height: '48px', boxSizing: 'border-box', backgroundColor: '#ffffff', opacity: loading ? 0.5 : 1, cursor: loading ? 'not-allowed' : 'text'}}
                  onFocus={(e) => e.target.style.borderColor = '#059669'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Publish</option>
                </select>
              </div>

              {/* Book Image */}
              <div>
                <div className="flex items-center gap-2 mb-3" style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px'}}>
                  <div className="w-6 h-6 rounded-md bg-gray-100 flex items-center justify-center" 
                       style={{width: '24px', height: '24px', backgroundColor: '#f3f4f6', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <Upload className="w-3 h-3 text-gray-600" style={{width: '12px', height: '12px', color: '#4b5563'}} />
                  </div>
                  <label className="text-sm font-medium text-gray-700" 
                         style={{fontSize: '14px', fontWeight: '500', color: '#374151', display: 'block'}}>
                    Book Image
                  </label>
                </div>
                <div className="space-y-4" style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
                  {/* Image Upload Area */}
                  <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-500 transition-colors" 
                       style={{border: '2px dashed #d1d5db', borderRadius: '8px', padding: '24px', textAlign: 'center', transition: 'border-color 0.2s', position: 'relative'}}>
                    {imagePreview ? (
                      <div className="relative inline-block">
                        <img 
                          src={imagePreview} 
                          alt="Book preview" 
                          className="w-32 h-32 object-cover rounded-lg mx-auto"
                          style={{width: '128px', height: '128px', objectFit: 'cover', borderRadius: '8px', margin: '0 auto'}}
                        />
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                          style={{position: 'absolute', top: '-8px', right: '-8px', backgroundColor: '#ef4444', color: 'white', borderRadius: '50%', padding: '4px', cursor: 'pointer', transition: 'background-color 0.2s', border: 'none'}}
                        >
                          <X className="w-4 h-4" style={{width: '16px', height: '16px'}} />
                        </button>
                      </div>
                    ) : (
                      <div>
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" style={{width: '48px', height: '48px', color: '#9ca3af', margin: '0 auto 16px'}} />
                        <p className="text-gray-600 mb-2" style={{color: '#4b5563', marginBottom: '8px'}}>Click to upload or drag and drop</p>
                        <p className="text-gray-500 text-sm" style={{color: '#6b7280', fontSize: '14px'}}>PNG, JPG, GIF up to 5MB</p>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      disabled={loading}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                      style={{position: 'absolute', inset: '0', width: '100%', height: '100%', opacity: '0', cursor: loading ? 'not-allowed' : 'pointer'}}
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-4" style={{display: 'flex', justifyContent: 'flex-end', paddingTop: '16px'}}>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-green-600 to-teal-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-teal-700 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                  style={{background: 'linear-gradient(90deg, #059669 0%, #14b8a6 100%)', color: 'white', padding: '12px 32px', borderRadius: '8px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', opacity: loading ? 0.5 : 1}}
                  onMouseEnter={(e) => !loading && (e.target.style.background = 'linear-gradient(90deg, #047857 0%, #0d9488 100%)')}
                  onMouseLeave={(e) => !loading && (e.target.style.background = 'linear-gradient(90deg, #059669 0%, #14b8a6 100%)')}
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" 
                           style={{width: '16px', height: '16px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite'}} />
                      Adding Book...
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" style={{width: '20px', height: '20px'}} />
                      Add Book
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddBook;
