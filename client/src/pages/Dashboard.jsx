import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Layout from '../components/Layout';
import { BookOpen, Users, Plus, Eye, Edit, TrendingUp, Book, User, Home, Settings, LogOut, Activity, Calendar } from 'lucide-react';

function Dashboard() {
    const [user, setUser] = useState();
    const [stats, setStats] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = localStorage.getItem("token");

    // Get current user for role-based access
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const isAdmin = currentUser.role === 'admin';

    // Debug: Log current user data
    console.log('Dashboard - Current user from localStorage:', currentUser);
    console.log('Dashboard - Is admin:', isAdmin);

    // Function to fetch dashboard data
    const fetchDashboardData = () => {
        Promise.all([
            axios.get("http://localhost:5000/api/user/profile", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }),
            axios.get("http://localhost:5000/api/books/stats")
        ])
        .then(([userRes, statsRes]) => {
            setUser(userRes.data);
            setStats(statsRes.data);
            setLoading(false);
        })
        .catch(err => {
            console.log(err);
            setError('Failed to load dashboard data. Please try again later.');
            setLoading(false);
        });
    };

    useEffect(() => {
        fetchDashboardData();
        
        // Set up automatic refresh every 30 seconds
        const interval = setInterval(() => {
            console.log('Auto-refreshing dashboard data...');
            fetchDashboardData();
        }, 30000);
        
        // Cleanup interval on component unmount
        return () => clearInterval(interval);
    }, [token]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                    <p className="text-gray-600 text-lg font-medium">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <LogOut className="w-10 h-10 text-red-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-3">Error Loading Dashboard</h2>
                    <p className="text-gray-600">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <Layout>
            {/* Welcome Section */}
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-4 overflow-hidden" style={{backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', padding: '20px', marginBottom: '16px', overflow: 'hidden'}}>
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 -mx-8 -mt-8 px-8 py-4 mb-3" style={{background: 'linear-gradient(90deg, #2563eb 0%, #4f46e5 100%)', marginLeft: '-32px', marginRight: '-32px', marginTop: '-32px', padding: '16px 32px', marginBottom: '12px'}}>
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3" style={{fontSize: '28px', fontWeight: 'bold', color: 'white', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px'}}>
                                <Home className="w-8 h-8" style={{width: '32px', height: '32px'}} />
                                Dashboard
                            </h1>
                            <p className="text-blue-100 text-lg" style={{color: '#dbeafe', fontSize: '18px'}}>
                                Welcome back, <span className="font-semibold text-white" style={{fontWeight: '600', color: 'white'}}>{user?.name}</span>! &#128075;
                            </p>
                        </div>
                        <div className="hidden md:block">
                            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm" style={{width: '64px', height: '64px', backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)'}}>
                                <User className="w-8 h-8 text-white" style={{width: '32px', height: '32px', color: 'white'}} />
                            </div>
                        </div>
                    </div>
                    
                    {/* Quick Stats Bar */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4" style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px'}}>
                        <div className="text-center p-4 bg-blue-50 rounded-lg" style={{padding: '16px', backgroundColor: '#eff6ff', borderRadius: '8px'}}>
                            <p className="text-sm text-blue-600 font-medium" style={{fontSize: '14px', color: '#2563eb', fontWeight: '500'}}>Today</p>
                            <p className="text-2xl font-bold text-blue-900" style={{fontSize: '24px', fontWeight: 'bold', color: '#1e3a8a'}}>{new Date().toLocaleDateString('en-US', { weekday: 'short' })}</p>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg" style={{padding: '16px', backgroundColor: '#f0fdf4', borderRadius: '8px'}}>
                            <p className="text-sm text-green-600 font-medium" style={{fontSize: '14px', color: '#059669', fontWeight: '500'}}>Status</p>
                            <p className="text-2xl font-bold text-green-900" style={{fontSize: '24px', fontWeight: 'bold', color: '#14532d'}}>Active</p>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-lg" style={{padding: '16px', backgroundColor: '#faf5ff', borderRadius: '8px'}}>
                            <p className="text-sm text-purple-600 font-medium" style={{fontSize: '14px', color: '#9333ea', fontWeight: '500'}}>Role</p>
                            <p className="text-2xl font-bold text-purple-900 capitalize" style={{fontSize: '24px', fontWeight: 'bold', color: '#581c87'}}>{currentUser.role || 'User'}</p>
                        </div>
                        <div className="text-center p-4 bg-orange-50 rounded-lg" style={{padding: '16px', backgroundColor: '#fff7ed', borderRadius: '8px'}}>
                            <p className="text-sm text-orange-600 font-medium" style={{fontSize: '14px', color: '#ea580c', fontWeight: '500'}}>Session</p>
                            <p className="text-2xl font-bold text-orange-900" style={{fontSize: '24px', fontWeight: 'bold', color: '#7c2d12'}}>Live</p>
                        </div>
                    </div>
                </div>
                
                {/* Statistics Cards */}
                <div className="grid gap-3 mb-6" style={{display: 'grid', gap: '12px', marginBottom: '24px', gridTemplateColumns: isAdmin ? 'repeat(4, 1fr)' : 'repeat(3, 1fr)'}}>
                    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group" style={{backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', transition: 'all 0.3s', overflow: 'hidden'}}>
                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4" style={{background: 'linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)', padding: '16px'}}>
                            <div className="flex items-center justify-between">
                                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm" style={{width: '48px', height: '48px', backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)'}}>
                                    <BookOpen className="w-6 h-6 text-white" style={{width: '24px', height: '24px', color: 'white'}} />
                                </div>
                                <div className={`text-white text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1 ${stats?.growth?.books >= 0 ? 'bg-green-500' : 'bg-red-500'}`} style={{backgroundColor: stats?.growth?.books >= 0 ? '#10b981' : '#ef4444', color: 'white', fontSize: '12px', padding: '4px 8px', borderRadius: '9999px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '4px'}}>
                                    <TrendingUp className="w-3 h-3" style={{width: '12px', height: '12px'}} />
                                    {stats?.growth?.books >= 0 ? '+' : ''}{stats?.growth?.books || 0}%
                                </div>
                            </div>
                        </div>
                        <div className="p-4" style={{padding: '16px'}}>
                            <h3 className="text-gray-600 text-sm font-medium mb-2" style={{color: '#4b5563', fontSize: '14px', fontWeight: '500', marginBottom: '8px'}}>Total Books</h3>
                            <p className="text-3xl font-bold text-gray-900 mb-2" style={{fontSize: '30px', fontWeight: 'bold', color: '#111827', marginBottom: '8px'}}>{stats?.totalBooks || 0}</p>
                            <p className="text-xs text-gray-500" style={{fontSize: '12px', color: '#6b7280'}}>In your collection</p>
                        </div>
                    </div>
                    
                    {/* Total Users Card - Only for Admins */}
                    {isAdmin && (
                    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group" style={{backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', transition: 'all 0.3s', overflow: 'hidden'}}>
                        <div className="bg-gradient-to-r from-green-500 to-green-600 p-4" style={{background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)', padding: '16px'}}>
                            <div className="flex items-center justify-between">
                                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm" style={{width: '48px', height: '48px', backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)'}}>
                                    <Users className="w-6 h-6 text-white" style={{width: '24px', height: '24px', color: 'white'}} />
                                </div>
                                <div className={`text-white text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1 ${stats?.growth?.users >= 0 ? 'bg-blue-500' : 'bg-red-500'}`} style={{backgroundColor: stats?.growth?.users >= 0 ? '#3b82f6' : '#ef4444', color: 'white', fontSize: '12px', padding: '4px 8px', borderRadius: '9999px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '4px'}}>
                                    <Activity className="w-3 h-3" style={{width: '12px', height: '12px'}} />
                                    {stats?.growth?.users >= 0 ? '+' : ''}{stats?.growth?.users || 0}%
                                </div>
                            </div>
                        </div>
                        <div className="p-4" style={{padding: '16px'}}>
                            <h3 className="text-gray-600 text-sm font-medium mb-2" style={{color: '#4b5563', fontSize: '14px', fontWeight: '500', marginBottom: '8px'}}>Total Users</h3>
                            <p className="text-3xl font-bold text-gray-900 mb-2" style={{fontSize: '30px', fontWeight: 'bold', color: '#111827', marginBottom: '8px'}}>{stats?.totalUsers || 0}</p>
                            <p className="text-xs text-gray-500" style={{fontSize: '12px', color: '#6b7280'}}>Registered users</p>
                        </div>
                    </div>
                    )}

                    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group" style={{backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', transition: 'all 0.3s', overflow: 'hidden'}}>
                        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4" style={{background: 'linear-gradient(90deg, #a855f7 0%, #9333ea 100%)', padding: '16px'}}>
                            <div className="flex items-center justify-between">
                                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm" style={{width: '48px', height: '48px', backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)'}}>
                                    <Calendar className="w-6 h-6 text-white" style={{width: '24px', height: '24px', color: 'white'}} />
                                </div>
                                <div className="bg-purple-400 text-white text-xs px-2 py-1 rounded-full font-medium" style={{backgroundColor: '#c084fc', color: 'white', fontSize: '12px', padding: '4px 8px', borderRadius: '9999px', fontWeight: '500'}}>
                                    This Month
                                </div>
                            </div>
                        </div>
                        <div className="p-4" style={{padding: '16px'}}>
                            <h3 className="text-gray-600 text-sm font-medium mb-2" style={{color: '#4b5563', fontSize: '14px', fontWeight: '500', marginBottom: '8px'}}>Monthly Books</h3>
                            <p className="text-3xl font-bold text-gray-900 mb-2" style={{fontSize: '30px', fontWeight: 'bold', color: '#111827', marginBottom: '8px'}}>{stats?.currentMonthBooks || 0}</p>
                            <p className="text-xs text-gray-500" style={{fontSize: '12px', color: '#6b7280'}}>New additions</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group" style={{backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', transition: 'all 0.3s', overflow: 'hidden'}}>
                        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4" style={{background: 'linear-gradient(90deg, #f97316 0%, #ea580c 100%)', padding: '16px'}}>
                            <div className="flex items-center justify-between">
                                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm" style={{width: '48px', height: '48px', backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)'}}>
                                    <span className="text-white font-bold" style={{color: 'white', fontWeight: 'bold', fontSize: '20px'}}>Rs</span>
                                </div>
                                <div className="bg-orange-400 text-white text-xs px-2 py-1 rounded-full font-medium" style={{backgroundColor: '#fb923c', color: 'white', fontSize: '12px', padding: '4px 8px', borderRadius: '9999px', fontWeight: '500'}}>
                                    Revenue
                                </div>
                            </div>
                        </div>
                        <div className="p-4" style={{padding: '16px'}}>
                            <h3 className="text-gray-600 text-sm font-medium mb-2" style={{color: '#4b5563', fontSize: '14px', fontWeight: '500', marginBottom: '8px'}}>Your Books</h3>
                            <p className="text-3xl font-bold text-gray-900 mb-2" style={{fontSize: '30px', fontWeight: 'bold', color: '#111827', marginBottom: '8px'}}>{stats?.userBooks || 0}</p>
                            <p className="text-xs text-gray-500" style={{fontSize: '12px', color: '#6b7280'}}>Personal collection</p>
                        </div>
                    </div>
                </div>

                {/* Recent Books */}
                <div className="bg-white rounded-2xl shadow-xl p-8 mb-8" style={{backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', padding: '20px', marginBottom: '32px'}}>
                    <div className="flex items-center justify-between mb-8" style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px'}}>
                        <div className="flex items-center gap-3" style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center" style={{width: '40px', height: '40px', backgroundColor: '#dbeafe', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                <BookOpen className="w-5 h-5 text-blue-600" style={{width: '20px', height: '20px', color: '#2563eb'}} />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900" style={{fontSize: '20px', fontWeight: '600', color: '#111827'}}>Recent Books</h2>
                                <p className="text-sm text-gray-600" style={{fontSize: '14px', color: '#4b5563'}}>Latest additions to your library</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3" style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                            <Link to="/books" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2" 
                                  style={{backgroundColor: '#2563eb', color: 'white', padding: '8px 16px', borderRadius: '8px', fontWeight: '500', cursor: 'pointer', transition: 'background-color 0.2s', display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none'}}>
                                <Eye className="w-4 h-4" style={{width: '16px', height: '16px'}} />
                                View All
                            </Link>
                        </div>
                    </div>
                    
                    {stats?.recentBooks?.length > 0 ? (
                        <div className="grid gap-3" style={{display: 'grid', gap: '12px', gridTemplateColumns: 'repeat(3, 1fr)'}}>
                            {stats.recentBooks.map(book => (
                                <div key={book.id} className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 group" 
                                     style={{background: 'linear-gradient(135deg, #f9fafb 0%, #ffffff 100%)', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px', transition: 'all 0.3s'}}>
                                    <div className="flex items-start justify-between mb-4" style={{display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px'}}>
                                        {/* Book Image */}
                                        <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0" 
                                             style={{width: '48px', height: '48px', borderRadius: '8px', overflow: 'hidden', position: 'relative'}}>
                                            {book.image ? (
                                                <img 
                                                    src={`http://localhost:5000${book.image}`} 
                                                    alt={book.title}
                                                    className="w-full h-full object-cover"
                                                    style={{width: '100%', height: '100%', objectFit: 'cover'}}
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center" 
                                                     style={{width: '100%', height: '100%', background: 'linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                                    <Book className="w-6 h-6 text-blue-600" style={{width: '24px', height: '24px', color: '#2563eb'}} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-bold text-green-600" style={{fontSize: '18px', fontWeight: 'bold', color: '#059669'}}>₹{book.price}</p>
                                            <p className="text-xs text-gray-500" style={{fontSize: '12px', color: '#6b7280'}}>Price</p>
                                        </div>
                                    </div>
                                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors" 
                                        style={{fontWeight: '600', color: '#111827', marginBottom: '8px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>{book.title}</h3>
                                    <p className="text-sm text-gray-600 mb-4" style={{fontSize: '14px', color: '#4b5563', marginBottom: '16px'}}>by {book.author}</p>
                                    <div className="flex items-center gap-3" style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                                        <Link 
                                            to={`/books/${book.id}`} 
                                            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
                                            style={{color: '#2563eb', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '500'}}
                                        >
                                            <Eye className="w-4 h-4" style={{width: '16px', height: '16px'}} />
                                            View
                                        </Link>
                                        {isAdmin && (
                                            <>
                                                <span className="text-gray-300" style={{color: '#d1d5db'}}>|</span>
                                                <Link 
                                                    to={`/edit-book/${book.id}`} 
                                                    className="flex items-center gap-2 text-orange-600 hover:text-orange-700 text-sm font-medium transition-colors"
                                                    style={{color: '#ea580c', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '500'}}
                                                >
                                                    <Edit className="w-4 h-4" style={{width: '16px', height: '16px'}} />
                                                    Edit
                                                </Link>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12" style={{padding: '48px 0', textAlign: 'center'}}>
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6" style={{width: '80px', height: '80px', backgroundColor: '#f3f4f6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px'}}>
                                <Book className="w-10 h-10 text-gray-400" style={{width: '40px', height: '40px', color: '#9ca3af'}} />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2" style={{fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '8px'}}>No Recent Books</h3>
                            <p className="text-gray-600 mb-6" style={{color: '#4b5563', marginBottom: '24px'}}>Start by adding your first book to the collection.</p>
                            {isAdmin && (
                                <Link to="/add-book">
                                    <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl mx-auto" 
                                            style={{background: 'linear-gradient(90deg, #2563eb 0%, #4f46e5 100%)', color: 'white', padding: '12px 24px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', margin: '0 auto'}}>
                                        <Plus className="w-5 h-5" style={{width: '20px', height: '20px'}} />
                                        Add Your First Book
                                    </button>
                                </Link>
                            )}
                        </div>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-2xl shadow-xl p-8" style={{backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', padding: '20px'}}>
                    <div className="flex items-center gap-3 mb-8" style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px'}}>
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center" style={{width: '40px', height: '40px', backgroundColor: '#d1fae5', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                            <Plus className="w-5 h-5 text-green-600" style={{width: '20px', height: '20px', color: '#059669'}} />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900" style={{fontSize: '20px', fontWeight: '600', color: '#111827'}}>Quick Actions</h2>
                            <p className="text-sm text-gray-600" style={{fontSize: '14px', color: '#4b5563'}}>Common tasks and shortcuts</p>
                        </div>
                    </div>
                    <div className="grid gap-3" style={{display: 'grid', gap: '12px', gridTemplateColumns: 'repeat(3, 1fr)'}}>
                        {isAdmin && (
                            <Link to="/add-book" style={{textDecoration: 'none'}}>
                                <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 group cursor-pointer" 
                                     style={{background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '24px', transition: 'all 0.3s', cursor: 'pointer'}}>
                                    <div className="flex items-center gap-4 mb-4" style={{display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px'}}>
                                        <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform" 
                                             style={{width: '48px', height: '48px', backgroundColor: '#059669', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.2s'}}>
                                            <Plus className="w-6 h-6 text-white" style={{width: '24px', height: '24px', color: 'white'}} />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 group-hover:text-green-700 transition-colors" style={{fontWeight: '600', color: '#111827'}}>Add New Book</h3>
                                            <p className="text-xs text-gray-600" style={{fontSize: '12px', color: '#4b5563'}}>Create entry</p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-700" style={{fontSize: '14px', color: '#374151'}}>Add a new book to your collection</p>
                                </div>
                            </Link>
                        )}
                        <Link to="/books" style={{textDecoration: 'none'}}>
                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 group cursor-pointer" 
                                 style={{background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)', border: '1px solid #bfdbfe', borderRadius: '12px', padding: '24px', transition: 'all 0.3s', cursor: 'pointer'}}>
                                <div className="flex items-center gap-4 mb-4" style={{display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px'}}>
                                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform" 
                                         style={{width: '48px', height: '48px', backgroundColor: '#2563eb', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.2s'}}>
                                        <BookOpen className="w-6 h-6 text-white" style={{width: '24px', height: '24px', color: 'white'}} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors" style={{fontWeight: '600', color: '#111827'}}>View All Books</h3>
                                        <p className="text-xs text-gray-600" style={{fontSize: '12px', color: '#4b5563'}}>Browse library</p>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-700" style={{fontSize: '14px', color: '#374151'}}>Browse and manage your book collection</p>
                            </div>
                        </Link>
                        <Link to="/profile" style={{textDecoration: 'none'}}>
                            <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 group cursor-pointer" 
                                 style={{background: 'linear-gradient(135deg, #fff7ed 0%, #fed7aa 100%)', border: '1px solid #fdba74', borderRadius: '12px', padding: '24px', transition: 'all 0.3s', cursor: 'pointer'}}>
                                <div className="flex items-center gap-4 mb-4" style={{display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px'}}>
                                    <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform" 
                                         style={{width: '48px', height: '48px', backgroundColor: '#ea580c', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.2s'}}>
                                        <User className="w-6 h-6 text-white" style={{width: '24px', height: '24px', color: 'white'}} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 group-hover:text-orange-700 transition-colors" style={{fontWeight: '600', color: '#111827'}}>Edit Profile</h3>
                                        <p className="text-xs text-gray-600" style={{fontSize: '12px', color: '#4b5563'}}>Settings</p>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-700" style={{fontSize: '14px', color: '#374151'}}>Update your personal information</p>
                            </div>
                        </Link>
                    </div>
                </div>
                </div>
            </Layout>
    );
}

export default Dashboard;