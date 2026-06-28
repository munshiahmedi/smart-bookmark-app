import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BookOpen, Edit, ArrowLeft, Save, FileText, User, Upload, X } from 'lucide-react';
import Navbar from '../components/Navbar';

function EditBook() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState({
    title: '',
    author: '',
    description: '',
    price: '',
    currentImage: ''
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    // Check user role and redirect if not admin
    const user = JSON.parse(localStorage.getItem('user'));
    const role = user?.role || 'user';
    setUserRole(role);
    
    if (role !== 'admin') {
      navigate('/books');
      return;
    }

    // Fetch book data
    axios.get(`http://localhost:5000/api/books/${id}`)
      .then(res => {
        const bookData = res.data;
        setBook({
          ...bookData,
          currentImage: bookData.image || ''
        });
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setError('Failed to fetch book data. Please try again.');
        setLoading(false);
      });
  }, [id, navigate]);

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
      if (image) {
        formData.append('image', image);
      }
      
      // Debug logging
      console.log('Submitting book data:', book);
      console.log('Submitting image:', image);
      console.log('FormData entries:');
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }
      
      const token = localStorage.getItem("token");
      const response = await axios.put(`http://localhost:5000/api/books/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Update response:', response.data);
      setSuccess(true);
      setImage(null);
      setImagePreview(null);
      alert("Book Updated");
    } catch (error) {
      console.error('Update error:', error);
      console.error('Error response:', error.response?.data);
      setError(error.response?.data?.error || 'Failed to update book. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-gray-600 text-lg font-medium">Loading book data...</p>
        </div>
      </div>
    );
  }

  if (error && !book.title) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Edit className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Error Loading Book</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100" style={{minHeight: '100vh', background: 'linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%)'}}>
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-8" style={{maxWidth: '1024px', margin: '0 auto', padding: '32px 16px'}}>
        
        {/* Main Edit Book Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden" style={{backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'}}>
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-600 to-amber-600 px-8 py-6" style={{background: 'linear-gradient(135deg, #ea580c 0%, #d97706 50%, #f59e0b 100%)', padding: '32px', position: 'relative', overflow: 'hidden'}}>
            <div className="absolute inset-0 bg-white opacity-5" style={{position: 'absolute', inset: '0', background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)'}}></div>
            <div className="relative z-10" style={{position: 'relative', zIndex: '10'}}>
              <div className="flex items-center gap-4" style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
                {/* Back to Books Icon */}
                <Link 
                  to="/books" 
                  className="text-white hover:text-orange-100 transition-colors"
                  style={{color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center'}}
                  title="Back to Books"
                >
                  <ArrowLeft className="w-6 h-6 flex-shrink-0" style={{width: '24px', height: '24px', flexShrink: '0'}} />
                </Link>
                <div className="bg-white bg-opacity-20 p-3 rounded-full backdrop-blur-sm" style={{backgroundColor: 'rgba(255,255,255,0.2)', padding: '12px', borderRadius: '50%', backdropFilter: 'blur(4px)'}}>
                  <Edit className="w-8 h-8 text-white" style={{width: '32px', height: '32px', color: 'white'}} />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white" style={{fontSize: '32px', fontWeight: 'bold', color: 'white', margin: '0'}}>Edit Book</h1>
                  <p className="text-orange-100 text-sm mt-1" style={{color: '#fed7aa', fontSize: '14px', marginTop: '12px'}}>Update book information</p>
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
                Book updated successfully!
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6" style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
              {/* Book Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2" 
                       style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px', textAlign: 'left'}}>
                  <BookOpen className="w-4 h-4" style={{width: '16px', height: '16px', marginRight: '8px'}} />
                  Book Title *
                </label>
                <input
                  name="title"
                  type="text"
                  value={book.title}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{width: '100%', padding: '12px 16px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none', transition: 'all 0.2s', fontSize: '16px'}}
                  placeholder="Enter book title"
                />
              </div>

              {/* Author */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2" 
                       style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px', textAlign: 'left'}}>
                  <User className="w-4 h-4" style={{width: '16px', height: '16px', marginRight: '8px'}} />
                  Author *
                </label>
                <input
                  name="author"
                  type="text"
                  value={book.author}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{width: '100%', padding: '12px 16px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none', transition: 'all 0.2s', fontSize: '16px'}}
                  placeholder="Enter author name"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2" 
                       style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px', textAlign: 'left'}}>
                  <FileText className="w-4 h-4" style={{width: '16px', height: '16px', marginRight: '8px'}} />
                  Description
                </label>
                <textarea
                  name="description"
                  value={book.description}
                  onChange={handleChange}
                  disabled={loading}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed resize-none"
                  style={{width: '100%', padding: '12px 16px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none', transition: 'all 0.2s', fontSize: '16px', resize: 'none', minHeight: '100px'}}
                  placeholder="Enter book description (optional)"
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2" 
                       style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px', textAlign: 'left'}}>
                  <span className="text-green-600 font-bold" style={{color: '#059669', fontWeight: 'bold', marginRight: '8px'}}>Rs</span>
                  Price (₹) *
                </label>
                <input
                  name="price"
                  type="number"
                  value={book.price}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{width: '100%', padding: '12px 16px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none', transition: 'all 0.2s', fontSize: '16px'}}
                  placeholder="0.00"
                />
              </div>

              {/* Book Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2" 
                       style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px', textAlign: 'left'}}>
                  <Upload className="w-4 h-4" style={{width: '16px', height: '16px', marginRight: '8px'}} />
                  Book Image
                </label>
                <div className="space-y-4" style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
                  {/* Current Image Display */}
                  {book.currentImage && !imagePreview && (
                    <div className="relative inline-block">
                      <img 
                        src={`http://localhost:5000${book.currentImage}`} 
                        alt="Current book image" 
                        className="w-32 h-32 object-cover rounded-lg"
                        style={{width: '128px', height: '128px', objectFit: 'cover', borderRadius: '8px'}}
                      />
                      <p className="text-xs text-gray-500 mt-2" style={{fontSize: '12px', color: '#6b7280', marginTop: '8px'}}>Current image</p>
                    </div>
                  )}
                  
                  {/* Image Upload Area */}
                  <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-500 transition-colors" 
                       style={{border: '2px dashed #d1d5db', borderRadius: '8px', padding: '24px', textAlign: 'center', transition: 'border-color 0.2s', position: 'relative'}}>
                    {imagePreview ? (
                      <div className="relative inline-block">
                        <img 
                          src={imagePreview} 
                          alt="New book preview" 
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
                        <p className="text-xs text-green-600 mt-2" style={{fontSize: '12px', color: '#059669', marginTop: '8px'}}>New image ready</p>
                      </div>
                    ) : (
                      <div>
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" style={{width: '48px', height: '48px', color: '#9ca3af', margin: '0 auto 16px'}} />
                        <p className="text-gray-600 mb-2" style={{color: '#4b5563', marginBottom: '8px'}}>Click to upload or drag and drop</p>
                        <p className="text-gray-500 text-sm" style={{color: '#6b7280', fontSize: '14px'}}>PNG, JPG, GIF up to 5MB</p>
                        <p className="text-xs text-gray-400 mt-2" style={{fontSize: '12px', color: '#9ca3af', marginTop: '8px'}}>Leave empty to keep current image</p>
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

              {/* Action Buttons */}
              <div className="flex justify-between pt-4" style={{display: 'flex', justifyContent: 'space-between', paddingTop: '16px'}}>
                <Link to="/books">
                  <button
                    type="button"
                    className="bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors flex items-center gap-2"
                    style={{backgroundColor: '#4b5563', color: 'white', padding: '12px 24px', borderRadius: '8px', fontWeight: '500', cursor: 'pointer', transition: 'background-color 0.2s', display: 'flex', alignItems: 'center', gap: '8px', border: 'none'}}
                  >
                    <ArrowLeft className="w-5 h-5" style={{width: '20px', height: '20px'}} />
                    Cancel
                  </button>
                </Link>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-orange-600 to-amber-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-orange-700 hover:to-amber-700 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                  style={{background: 'linear-gradient(90deg, #ea580c 0%, #d97706 100%)', color: 'white', padding: '12px 32px', borderRadius: '8px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', opacity: loading ? 0.5 : 1}}
                  onMouseEnter={(e) => !loading && (e.target.style.background = 'linear-gradient(90deg, #c2410c 0%, #b45309 100%)')}
                  onMouseLeave={(e) => !loading && (e.target.style.background = 'linear-gradient(90deg, #ea580c 0%, #d97706 100%)')}
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" 
                           style={{width: '16px', height: '16px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite'}} />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" style={{width: '20px', height: '20px'}} />
                      Update Book
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

export default EditBook;

