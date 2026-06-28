// src/pages/Profile.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { User, Mail, Lock, Camera, Save, ArrowLeft, BookOpen, Calendar, TrendingUp, Award, Clock, Cake } from 'lucide-react';
import { Link } from 'react-router-dom';

function Profile() {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    profile_pic: null,
    current_pic: '',
    dob: ''
  });
  const [userStats, setUserStats] = useState(null);
  const [myBooks, setMyBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const token = localStorage.getItem('token'); // JWT token from login

  // Publish book function
  const publishBook = async (bookId) => {
    try {
      await axios.put(`http://localhost:5000/api/books/${bookId}`, { status: 'published' }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Refresh myBooks to update the status
      const booksRes = await axios.get('http://localhost:5000/api/books/my-books', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMyBooks(booksRes.data);
      alert("Book published successfully!");
    } catch (error) {
      console.error('Error publishing book:', error);
      alert('Failed to publish book. Please try again.');
    }
  };

  // Fetch profile data and user's books on mount
  useEffect(() => {
    Promise.all([
      axios.get('http://localhost:5000/api/user/profile', {
        headers: { Authorization: `Bearer ${token}` }
      }),
      axios.get('http://localhost:5000/api/books/my-books', {
        headers: { Authorization: `Bearer ${token}` }
      })
    ])
    .then(([profileRes, booksRes]) => {
      setProfile({
        ...profileRes.data,
        profile_pic: null,
        current_pic: profileRes.data.profile_pic,
        dob: profileRes.data.dob || ''
      });
      setMyBooks(booksRes.data);
      setLoading(false);
    })
    .catch(err => {
      console.log(err);
      setLoading(false);
    });
  }, [token]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profile_pic') {
      setProfile({ ...profile, profile_pic: files[0] });
    } else {
      setProfile({ ...profile, [name]: value });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', profile.name);
    formData.append('email', profile.email);
    if (profile.profile_pic) formData.append('profile_pic', profile.profile_pic);
    if (profile.dob) formData.append('dob', profile.dob);

    try {
      const res = await axios.put('http://localhost:5000/api/user/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      setMessage(res.data.message);
    } catch (err) {
      console.error(err);
      setMessage('Error updating profile.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4" style={{minHeight: '100vh', background: 'linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%)', padding: '32px 16px'}}>
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4" style={{minHeight: '100vh', background: 'linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%)', padding: '32px 16px'}}>
      <div className="max-w-2xl mx-auto">
        {/* Main Profile Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden" style={{backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'}}>
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6" style={{background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 50%, #7c3aed 100%)', padding: '32px', position: 'relative', overflow: 'hidden'}}>
            <div className="absolute inset-0 bg-white opacity-5" style={{position: 'absolute', inset: '0', background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)'}}></div>
            <div className="relative z-10" style={{position: 'relative', zIndex: '10'}}>
              <div className="flex items-center gap-4 mb-2" style={{display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px'}}>
                {/* Back to Dashboard Icon */}
                <Link 
                  to="/dashboard" 
                  className="text-white hover:text-blue-100 transition-colors"
                  style={{color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center'}}
                  title="Back to Dashboard"
                >
                  <ArrowLeft className="w-6 h-6 flex-shrink-0" style={{width: '24px', height: '24px', flexShrink: '0'}} />
                </Link>
                <div className="bg-white bg-opacity-20 p-3 rounded-full backdrop-blur-sm" style={{backgroundColor: 'rgba(255,255,255,0.2)', padding: '12px', borderRadius: '50%', backdropFilter: 'blur(4px)'}}>
                  <User className="w-8 h-8 text-white" style={{width: '32px', height: '32px', color: 'white'}} />
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-white" style={{fontSize: '32px', fontWeight: 'bold', color: 'white', margin: '0'}}>Edit Profile</h1>
                  <p className="text-blue-100 text-sm mt-1" style={{color: '#dbeafe', fontSize: '14px', marginTop: '12px'}}>Manage your personal information and publishing data</p>
                </div>
                <Link 
                  to="/change-password"
                  className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-lg backdrop-blur-sm hover:bg-opacity-30 transition-all flex items-center gap-2"
                  style={{backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', padding: '8px 16px', borderRadius: '8px', backdropFilter: 'blur(4px)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s'}}
                  title="Change Password"
                >
                  <Lock className="w-4 h-4" style={{width: '16px', height: '16px'}} />
                  Change Password
                </Link>
              </div>
            </div>
          </div>

          <div className="p-8" style={{padding: '32px'}}>
            {/* Success/Error Messages */}
            {message && (
              <div className={`p-4 rounded-lg mb-6 ${message.includes('Error') ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`} 
                   style={{padding: '16px', borderRadius: '8px', marginBottom: '24px', border: '1px solid', ... (message.includes('Error') ? {backgroundColor: '#fef2f2', color: '#b91c1c', borderColor: '#fecaca'} : {backgroundColor: '#f0fdf4', color: '#15803d', borderColor: '#bbf7d0'})}}>
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6" style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
              {/* Profile Picture Section */}
              <div className="flex flex-col items-center mb-8" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '32px'}}>
                <div className="relative">
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center overflow-hidden border-4 border-white shadow-lg" 
                       style={{width: '128px', height: '128px', background: 'linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '4px solid white', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}}>
                    {profile.current_pic ? (
                      <img
                        src={`http://localhost:5000/${profile.current_pic}`}
                        alt="Profile"
                        className="w-full h-full object-cover"
                        style={{width: '100%', height: '100%', objectFit: 'cover'}}
                      />
                    ) : (
                      <User className="w-16 h-16 text-blue-600" style={{width: '64px', height: '64px', color: '#2563eb'}} />
                    )}
                  </div>
                  <label htmlFor="profile_pic" className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors shadow-lg" 
                         style={{position: 'absolute', bottom: '0', right: '0', backgroundColor: '#2563eb', color: 'white', padding: '8px', borderRadius: '50%', cursor: 'pointer', transition: 'background-color 0.2s', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}}>
                    <Camera className="w-5 h-5" style={{width: '20px', height: '20px'}} />
                  </label>
                  <input
                    type="file"
                    id="profile_pic"
                    name="profile_pic"
                    onChange={handleChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
                <p className="text-gray-600 text-sm mt-3" style={{color: '#4b5563', fontSize: '14px', marginTop: '12px'}}>Click camera icon to change photo</p>
              </div>

              {/* User Statistics Section */}
              {profile.statistics && (
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 mb-8" 
                     style={{background: 'linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%)', borderRadius: '16px', padding: '24px', marginBottom: '32px'}}>
                  <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2" 
                      style={{fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px'}}>
                    <Award className="w-6 h-6" style={{width: '24px', height: '24px'}} />
                    Your Publishing Statistics
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" 
                       style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px'}}>
                    
                    {/* Total Books */}
                    <div className="bg-white rounded-xl p-4 text-center shadow-sm hover:shadow-md transition-shadow" 
                         style={{backgroundColor: 'white', borderRadius: '12px', padding: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', transition: 'box-shadow 0.3s'}}>
                      <BookOpen className="w-8 h-8 text-blue-600 mx-auto mb-2" 
                               style={{width: '32px', height: '32px', color: '#2563eb', margin: '0 auto 8px'}} />
                      <h3 className="text-2xl font-bold text-gray-900" style={{fontSize: '24px', fontWeight: 'bold', color: '#111827'}}>
                        {profile.statistics.totalBooks || 0}
                      </h3>
                      <p className="text-sm text-gray-600" style={{fontSize: '14px', color: '#4b5563'}}>Books Published</p>
                    </div>

                    {/* Monthly Books */}
                    <div className="bg-white rounded-xl p-4 text-center shadow-sm hover:shadow-md transition-shadow" 
                         style={{backgroundColor: 'white', borderRadius: '12px', padding: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', transition: 'box-shadow 0.3s'}}>
                      <Calendar className="w-8 h-8 text-green-600 mx-auto mb-2" 
                               style={{width: '32px', height: '32px', color: '#059669', margin: '0 auto 8px'}} />
                      <h3 className="text-2xl font-bold text-gray-900" style={{fontSize: '24px', fontWeight: 'bold', color: '#111827'}}>
                        {profile.statistics.currentMonthBooks || 0}
                      </h3>
                      <p className="text-sm text-gray-600" style={{fontSize: '14px', color: '#4b5563'}}>This Month</p>
                    </div>

                    {/* Growth */}
                    <div className="bg-white rounded-xl p-4 text-center shadow-sm hover:shadow-md transition-shadow" 
                         style={{backgroundColor: 'white', borderRadius: '12px', padding: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', transition: 'box-shadow 0.3s'}}>
                      <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-2" 
                               style={{width: '32px', height: '32px', color: '#9333ea', margin: '0 auto 8px'}} />
                      <h3 className="text-2xl font-bold text-gray-900" style={{fontSize: '24px', fontWeight: 'bold', color: '#111827'}}>
                        {profile.statistics.booksGrowth >= 0 ? '+' : ''}{profile.statistics.booksGrowth || 0}%
                      </h3>
                      <p className="text-sm text-gray-600" style={{fontSize: '14px', color: '#4b5563'}}>Growth</p>
                    </div>

                    {/* Age */}
                    <div className="bg-white rounded-xl p-4 text-center shadow-sm hover:shadow-md transition-shadow" 
                         style={{backgroundColor: 'white', borderRadius: '12px', padding: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', transition: 'box-shadow 0.3s'}}>
                      <Cake className="w-8 h-8 text-pink-600 mx-auto mb-2" 
                               style={{width: '32px', height: '32px', color: '#db2777', margin: '0 auto 8px'}} />
                      <h3 className="text-2xl font-bold text-gray-900" style={{fontSize: '24px', fontWeight: 'bold', color: '#111827'}}>
                        {profile.age || 'N/A'}
                      </h3>
                      <p className="text-sm text-gray-600" style={{fontSize: '14px', color: '#4b5563'}}>Age</p>
                    </div>
                  </div>

                  {/* Member Since */}
                  <div className="mt-4 text-center" style={{marginTop: '16px', textAlign: 'center'}}>
                    <p className="text-sm text-gray-500" style={{fontSize: '14px', color: '#6b7280'}}>
                      <Clock className="w-4 h-4 inline mr-1" style={{width: '16px', height: '16px', display: 'inline', marginRight: '4px'}} />
                      Member since {profile.created_at ? new Date(profile.created_at).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      }) : 'N/A'}
                    </p>
                  </div>

                  {/* All Books */}
                  {profile.statistics.books && profile.statistics.books.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2" 
                          style={{fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px'}}>
                        <BookOpen className="w-5 h-5" style={{width: '20px', height: '20px'}} />
                        Your Published Books ({profile.statistics.books.length})
                      </h3>
                      <div className="space-y-3 max-h-64 overflow-y-auto" style={{display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '16rem', overflowY: 'auto'}}>
                        {profile.statistics.books.map(book => (
                          <div key={book.id} className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-all" 
                               style={{backgroundColor: 'white', borderRadius: '8px', padding: '16px', border: '1px solid #e5e7eb', transition: 'all 0.3s'}}>
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-900 line-clamp-1" style={{fontWeight: '600', color: '#111827', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>
                                  {book.title}
                                </h4>
                                <p className="text-sm text-gray-600" style={{fontSize: '14px', color: '#4b5563'}}>by {book.author}</p>
                                {book.description && (
                                  <p className="text-sm text-gray-500 mt-1 line-clamp-2" style={{fontSize: '14px', color: '#6b7280', marginTop: '4px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>
                                    {book.description}
                                  </p>
                                )}
                                <p className="text-xs text-gray-400 mt-2" style={{fontSize: '12px', color: '#9ca3af', marginTop: '8px'}}>
                                  Published: {new Date(book.created_at).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="text-right ml-4">
                                <p className="text-lg font-bold text-green-600" style={{fontSize: '18px', fontWeight: 'bold', color: '#059669'}}>Rs{book.price}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* No Books Yet Message */}
                  {(!profile.statistics.books || profile.statistics.books.length === 0) && (
                    <div className="mt-6 text-center py-8" style={{marginTop: '24px', textAlign: 'center', paddingTop: '32px', paddingBottom: '32px'}}>
                      <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" style={{width: '48px', height: '48px', color: '#9ca3af', margin: '0 auto 12px'}} />
                      <p className="text-gray-500 text-lg" style={{color: '#6b7280', fontSize: '18px'}}>No books published yet</p>
                      <p className="text-gray-400 text-sm mt-2" style={{color: '#9ca3af', fontSize: '14px', marginTop: '8px'}}>Start by adding your first book!</p>
                      <Link 
                        to="/add-book" 
                        className="inline-block mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        style={{display: 'inline-block', marginTop: '16px', backgroundColor: '#2563eb', color: 'white', padding: '8px 24px', borderRadius: '8px', textDecoration: 'none', transition: 'background-color 0.2s'}}
                      >
                        Add Your First Book
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/* Form Fields */}
              <div className="space-y-6" style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
                {/* Name Field */}
                <div style={{textAlign: 'left'}}>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2" 
                         style={{display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px'}}>
                    <User className="w-5 h-5 text-blue-600" style={{width: '20px', height: '20px', color: '#2563eb'}} />
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={profile.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all hover:border-blue-400 box-sizing-border-box"
                    style={{width: '100%', padding: '12px 16px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none', transition: 'all 0.2s', fontSize: '15px', boxSizing: 'border-box'}}
                    placeholder="Enter your full name"
                  />
                </div>

                {/* Email Field */}
                <div style={{textAlign: 'left'}}>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2" 
                         style={{display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px'}}>
                    <Mail className="w-5 h-5 text-blue-600" style={{width: '20px', height: '20px', color: '#2563eb'}} />
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all hover:border-blue-400"
                    style={{width: '100%', padding: '12px 16px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none', transition: 'all 0.2s', fontSize: '15px', boxSizing: 'border-box'}}
                    placeholder="your@email.com"
                  />
                </div>

                {/* DOB Field */}
                <div style={{textAlign: 'left'}}>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2" 
                         style={{display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px'}}>
                    <Cake className="w-5 h-5 text-pink-600" style={{width: '20px', height: '20px', color: '#db2777'}} />
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dob"
                    value={profile.dob}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all hover:border-blue-400"
                    style={{width: '100%', padding: '12px 16px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none', transition: 'all 0.2s', fontSize: '15px', boxSizing: 'border-box'}}
                  />
                </div>

              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-6" style={{display: 'flex', justifyContent: 'flex-end', paddingTop: '24px'}}>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                  style={{background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 50%, #7c3aed 100%)', color: 'white', padding: '14px 40px', borderRadius: '12px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '10px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.15)', fontSize: '16px', transform: 'scale(1)'}}
                  onMouseEnter={(e) => {e.target.style.background = 'linear-gradient(135deg, #1d4ed8 0%, #4338ca 50%, #6d28d9 100%)'; e.target.style.transform = 'scale(1.05)'; e.target.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.2)';}}
                  onMouseLeave={(e) => {e.target.style.background = 'linear-gradient(135deg, #2563eb 0%, #4f46e5 50%, #7c3aed 100%)'; e.target.style.transform = 'scale(1)'; e.target.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.15)';}}
                >
                  <Save className="w-5 h-5" style={{width: '20px', height: '20px'}} />
                  Update Profile
                </button>
              </div>
            </form>

            {/* My Books Section */}
            <div className="mt-8 pt-8 border-t border-gray-200" style={{marginTop: '32px', paddingTop: '32px', borderTop: '1px solid #e5e7eb'}}>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2" 
                  style={{fontSize: '24px', fontWeight: 'bold', color: '#1f2937', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px'}}>
                <BookOpen className="w-6 h-6" style={{width: '24px', height: '24px'}} />
                My Books ({myBooks.length})
              </h2>
              
              {myBooks.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
                     style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px'}}>
                  {myBooks.map(book => (
                    <div key={book.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200" 
                         style={{backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', transition: 'all 0.3s', border: '1px solid #e5e7eb'}}>
                      <div className="relative h-48 bg-gradient-to-br from-blue-50 to-indigo-50 overflow-hidden" 
                           style={{height: '192px', background: 'linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%)', overflow: 'hidden', position: 'relative'}}>
                        {book.image ? (
                          <img 
                            src={`http://localhost:5000${book.image}`} 
                            alt={book.title}
                            className="w-full h-full object-cover"
                            style={{width: '100%', height: '100%', objectFit: 'cover'}}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <BookOpen className="w-16 h-16 text-blue-400" style={{width: '64px', height: '64px', color: '#60a5fa'}} />
                          </div>
                        )}
                        <div className="absolute top-2 right-2 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold" 
                             style={{position: 'absolute', top: '8px', right: '8px', backgroundColor: '#059669', color: 'white', padding: '4px 12px', borderRadius: '9999px', fontSize: '14px', fontWeight: '600'}}>
                          ₹{book.price}
                        </div>
                      </div>
                      <div className="p-4" style={{padding: '16px'}}>
                        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2" 
                            style={{fontWeight: 'bold', color: '#111827', marginBottom: '8px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>
                          {book.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3" style={{color: '#4b5563', fontSize: '14px', marginBottom: '12px'}}>
                          by {book.author}
                        </p>
                        <p className={`text-xs font-medium mb-2 px-2 py-1 rounded-full inline-block ${
                          book.status === 'published' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`} 
                           style={{fontSize: '12px', fontWeight: '500', marginBottom: '8px', padding: '4px 8px', borderRadius: '9999px', display: 'inline-block'}}>
                          {book.status === 'published' ? '📚 Published' : '📝 Draft'}
                        </p>
                        <div className="flex justify-between items-center">
                          <Link 
                            to={`/books/${book.id}`}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
                            style={{color: '#2563eb', textDecoration: 'none', fontSize: '14px', fontWeight: '500'}}
                          >
                            View Details
                          </Link>
                          <Link 
                            to={`/edit-book/${book.id}`}
                            className="text-orange-600 hover:text-orange-700 text-sm font-medium transition-colors"
                            style={{color: '#ea580c', textDecoration: 'none', fontSize: '14px', fontWeight: '500'}}
                          >
                            Edit
                          </Link>
                          {book.status === 'draft' && (
                            <button
                              onClick={() => publishBook(book.id)}
                              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors ml-2"
                              style={{backgroundColor: '#059669', color: 'white', padding: '6px 12px', borderRadius: '6px', fontSize: '14px', fontWeight: '500', marginLeft: '8px', border: 'none', cursor: 'pointer'}}
                            >
                              🚀 Publish
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12" style={{padding: '48px 0', textAlign: 'center'}}>
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6" 
                       style={{width: '80px', height: '80px', backgroundColor: '#f3f4f6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px'}}>
                    <BookOpen className="w-10 h-10 text-gray-400" style={{width: '40px', height: '40px', color: '#9ca3af'}} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2" style={{fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '8px'}}>
                    No Books Yet
                  </h3>
                  <p className="text-gray-600 mb-6" style={{color: '#4b5563', marginBottom: '24px'}}>
                    You haven't published any books yet. Start by adding your first book!
                  </p>
                  <Link 
                    to="/add-book"
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 inline-flex items-center gap-2"
                    style={{background: 'linear-gradient(90deg, #2563eb 0%, #4f46e5 100%)', color: 'white', padding: '12px 24px', borderRadius: '8px', fontWeight: '600', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px'}}
                  >
                    <BookOpen className="w-5 h-5" style={{width: '20px', height: '20px'}} />
                    Add Your First Book
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;