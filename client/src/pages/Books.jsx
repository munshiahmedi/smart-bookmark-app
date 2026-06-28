import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { BookOpen, Plus, Search, Filter, Edit, Trash2, X, User, ChevronLeft, ChevronRight, Heart, Tag, ArrowLeft, ShoppingCart } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';

function Books() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedAuthor, setSelectedAuthor] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [wishlistItems, setWishlistItems] = useState(new Set());
  const { addToCart } = useCart();
  const token = localStorage.getItem('token');
  
  // Get user info for role-based access
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.role === 'admin';

  // Fetch authors for dropdown
  const fetchAuthors = () => {
    axios.get('http://localhost:5000/api/books/authors')
      .then(res => {
        console.log('Authors received:', res.data);
        // Ensure the response is an array
        if (Array.isArray(res.data)) {
          setAuthors(res.data);
        } else {
          console.warn('Authors response is not an array:', res.data);
          setAuthors([]);
        }
      })
      .catch(err => {
        console.error('Error fetching authors:', err);
        // If authors endpoint doesn't exist, extract from books
        if (books && books.length > 0) {
          const uniqueAuthors = [...new Set(books.map(book => book.author).filter(Boolean))];
          setAuthors(uniqueAuthors);
        } else {
          setAuthors([]);
        }
      });
  };

  // Fetch categories for dropdown
  const fetchCategories = () => {
    axios.get('http://localhost:5000/api/books/categories')
      .then(res => {
        console.log('Categories received:', res.data);
        if (Array.isArray(res.data)) {
          setCategories(res.data);
        } else {
          console.warn('Categories response is not an array:', res.data);
          setCategories([]);
        }
      })
      .catch(err => {
        console.error('Error fetching categories:', err);
        setCategories([]);
      });
  };

  // Fetch books with search and pagination
  const fetchBooks = (page = 1, searchQuery = search) => {
    setLoading(true);
    
    if (searchQuery) {
      // Use search API for keyword search
      axios.get(`http://localhost:5000/api/books/search?keyword=${encodeURIComponent(searchQuery)}`)
        .then(res => {
          console.log('Search results:', res.data);
          setBooks(res.data);
          setPagination(null); // Search doesn't need pagination
          setLoading(false);
        })
        .catch(err => {
          console.error('Error searching books:', err);
          setError('Failed to search books. Please try again.');
          setLoading(false);
        });
    } else {
      // Use regular API for all books
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12', // Show 12 books per page
      });
      
      axios.get(`http://localhost:5000/api/books?${params}`)
        .then(res => {
          console.log('Books received:', res.data);
          setBooks(res.data.books);
          setPagination(res.data.pagination);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error fetching books:', err);
          setError('Failed to fetch books. Please try again.');
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    fetchBooks(1, search);
    fetchAuthors();
    fetchCategories();
  }, []);

  // Fetch authors when books are updated
  useEffect(() => {
    if (books && Array.isArray(books) && books.length > 0) {
      try {
        const uniqueAuthors = [...new Set(books.map(book => book.author).filter(Boolean))];
        setAuthors(uniqueAuthors);
      } catch (err) {
        console.error('Error extracting authors from books:', err);
        setAuthors([]);
      }
    } else {
      setAuthors([]);
    }
  }, [books]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:5000/api/books/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        alert("Book deleted successfully");
        fetchBooks(currentPage, search); // Refresh current page
      } catch (error) {
        console.log('Error deleting book:', error);
        alert('Failed to delete book. Please try again.');
      }
    }
  };

  const handleSearch = (e) => {
    const searchValue = e.target.value;
    setSearch(searchValue);
    setCurrentPage(1); // Reset to first page on new search
  };

  // Debounced search for live search
  useEffect(() => {
    if (search === '') return;

    const delay = setTimeout(() => {
      fetchBooks(1, search);
    }, 500);

    return () => clearTimeout(delay);
  }, [search]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchBooks(page, search);
  };

  const clearFilters = () => {
    setSearch('');
    setSelectedAuthor('');
    setSelectedCategory('');
    setPriceRange({ min: '', max: '' });
    setCurrentPage(1);
    fetchBooks(1, '');
  };

  // 🚀 WISHLIST FUNCTIONS
  const addToWishlist = async (bookId) => {
    if (!token) {
      alert('Please login to add books to wishlist');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/books/wishlist', 
        { bookId: bookId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setWishlistItems(prev => new Set(prev).add(bookId));
      alert("❤️ Added to wishlist!");
    } catch (err) {
      console.error('Error adding to wishlist:', err);
      alert(err.response?.data?.error || 'Failed to add to wishlist');
    }
  };

  const removeFromWishlist = async (bookId) => {
    if (!token) return;

    try {
      await axios.delete(`http://localhost:5000/api/books/wishlist/${bookId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWishlistItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(bookId);
        return newSet;
      });
      alert("💔 Removed from wishlist");
    } catch (err) {
      console.error('Error removing from wishlist:', err);
      alert(err.response?.data?.error || 'Failed to remove from wishlist');
    }
  };

  const toggleWishlist = (bookId) => {
    if (wishlistItems.has(bookId)) {
      removeFromWishlist(bookId);
    } else {
      addToWishlist(bookId);
    }
  };

  // Fetch wishlist items on component mount
  useEffect(() => {
    if (!token) return;

    axios.get('http://localhost:5000/api/books/wishlist', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      // Handle both array and object responses
      let wishlistData = res.data;
      if (!Array.isArray(res.data)) {
        // If response is not an array, try to extract array or handle error
        if (res.data.error) {
          console.error('Wishlist API error:', res.data.error);
          return;
        }
        wishlistData = []; // Default to empty array
      }
      
      const bookIds = wishlistData.map(book => book.id);
      setWishlistItems(new Set(bookIds));
    })
    .catch(err => {
      console.error('Error fetching wishlist:', err);
      // Set empty wishlist on error to prevent crashes
      setWishlistItems(new Set());
    });
  }, [token]);

  // Filter books based on search and filters (client-side for author and price filters)
  const filteredBooks = books && books.length > 0 ? books.filter(book => {
    const matchesAuthor = !selectedAuthor || book.author === selectedAuthor;
    const matchesCategory = !selectedCategory || book.category === selectedCategory;
    const matchesMinPrice = !priceRange.min || book.price >= parseFloat(priceRange.min);
    const matchesMaxPrice = !priceRange.max || book.price <= parseFloat(priceRange.max);
    
    return matchesAuthor && matchesCategory && matchesMinPrice && matchesMaxPrice;
  }) : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading books...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center" style={{backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', padding: '32px'}}>
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4" style={{width: '64px', height: '64px', backgroundColor: '#fef2f2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px'}}>
            <X className="w-8 h-8 text-red-600" style={{width: '32px', height: '32px', color: '#dc2626'}} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2" style={{fontSize: '24px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px'}}>Error Loading Books</h2>
          <p className="text-gray-600" style={{color: '#4b5563'}}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100" style={{minHeight: '100vh', background: 'linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%)', paddingBottom: '50px'}}>
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8" style={{maxWidth: '1280px', margin: '0 auto', padding: '32px 16px 60px 16px'}}>
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8" style={{backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', marginBottom: '32px'}}>
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6" style={{background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 50%, #7c3aed 100%)', padding: '32px', position: 'relative', overflow: 'hidden'}}>
            <div className="absolute inset-0 bg-white opacity-5" style={{position: 'absolute', inset: '0', background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)'}}></div>
            <div className="relative z-10" style={{position: 'relative', zIndex: '10'}}>
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4" style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
                <div className="flex items-center gap-4" style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
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
                    <BookOpen className="w-8 h-8 text-white" style={{width: '32px', height: '32px', color: 'white'}} />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-white" style={{fontSize: '32px', fontWeight: 'bold', color: 'white', margin: '0'}}>Book Collection</h1>
                    <p className="text-blue-100 text-sm mt-1" style={{color: '#dbeafe', fontSize: '14px', marginTop: '12px'}}>Manage your book inventory</p>
                  </div>
                </div>
                
                {isAdmin && (
                  <Link to="/add-book">
                    <button className="bg-gradient-to-r from-green-600 to-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-teal-700 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl" 
                            style={{background: 'linear-gradient(90deg, #059669 0%, #14b8a6 100%)', color: 'white', padding: '12px 24px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}}>
                      <Plus className="w-5 h-5" style={{width: '20px', height: '20px'}} />
                      Add New Book
                    </button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8" style={{backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', padding: '24px', marginBottom: '32px'}}>
          <div className="flex items-center gap-2 mb-6" style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px'}}>
            <Filter className="w-5 h-5 text-blue-600" style={{width: '20px', height: '20px', color: '#2563eb'}} />
            <h2 className="text-xl font-semibold text-gray-800" style={{fontSize: '20px', fontWeight: '600', color: '#1f2937'}}>Search & Filter</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '16px', textAlign: 'left'}}>
            {/* Search by Title */}
            <div style={{textAlign: 'left'}}>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-4" 
                     style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px'}}>
                <Search className="w-4 h-4" style={{width: '16px', height: '16px'}} />
                Search Title
              </label>
              <div style={{display: 'flex', gap: '8px'}}>
                <input
                  type="text"
                  placeholder="Search books..."
                  value={search}
                  onChange={handleSearch}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all flex-1"
                  style={{width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none', transition: 'all 0.2s', boxSizing: 'border-box'}}
                />
                <button
                  onClick={() => fetchBooks(1, search)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
                  style={{padding: '8px 16px', backgroundColor: '#2563eb', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer', transition: 'background-color 0.2s'}}
                >
                  Search
                </button>
              </div>
            </div>
            
            <div style={{textAlign: 'left'}}>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2" 
                     style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px'}}>
                <User className="w-4 h-4" style={{width: '16px', height: '16px'}} />
                Author
              </label>
              <select
                value={selectedAuthor}
                onChange={(e) => setSelectedAuthor(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                style={{width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none', transition: 'all 0.2s', boxSizing: 'border-box'}}
              >
                <option value="">All Authors</option>
                {(() => {
                  console.log('Authors state:', authors, 'Type:', typeof authors, 'Is Array:', Array.isArray(authors));
                  const authorsArray = Array.isArray(authors) ? authors : [];
                  return authorsArray.map(author => (
                    <option key={author} value={author}>{author}</option>
                  ));
                })()}
              </select>
            </div>
            
            <div style={{textAlign: 'left'}}>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2" 
                     style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px'}}>
                <Tag className="w-4 h-4" style={{width: '16px', height: '16px'}} />
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                style={{width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none', transition: 'all 0.2s', boxSizing: 'border-box'}}
              >
                <option value="">All Categories</option>
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
            
            <div style={{textAlign: 'left'}}>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2" 
                     style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px'}}>
                <span className="text-green-600 font-bold" style={{color: '#059669', fontWeight: 'bold'}}>₹</span>
                Min Price
              </label>
              <input
                type="number"
                placeholder="0"
                value={priceRange.min}
                onChange={(e) => setPriceRange({...priceRange, min: e.target.value})}
                min="0"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                style={{width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none', transition: 'all 0.2s', boxSizing: 'border-box'}}
              />
            </div>
            
            <div style={{textAlign: 'left'}}>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2" 
                     style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px'}}>
                <span className="text-green-600 font-bold" style={{color: '#059669', fontWeight: 'bold'}}>₹</span>
                Max Price
              </label>
              <input
                type="number"
                placeholder="999"
                value={priceRange.max}
                onChange={(e) => setPriceRange({...priceRange, max: e.target.value})}
                min="0"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                style={{width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none', transition: 'all 0.2s', boxSizing: 'border-box'}}
              />
            </div>
          </div>
          
          {/* Clear Filters and Results Count */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4" style={{display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left'}}>
            <button
              onClick={clearFilters}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-700 transition-colors flex items-center gap-2"
              style={{backgroundColor: '#4b5563', color: 'white', padding: '8px 16px', borderRadius: '8px', fontWeight: '500', cursor: 'pointer', transition: 'background-color 0.2s', display: 'flex', alignItems: 'center', gap: '8px', border: 'none'}}
            >
              <X className="w-4 h-4" style={{width: '16px', height: '16px'}} />
              Clear Filters
            </button>
            
            <p className="text-gray-600 text-sm" style={{color: '#4b5563', fontSize: '14px'}}>
              <span className="font-semibold" style={{fontWeight: '600'}}>{filteredBooks.length}</span> of {pagination?.totalBooks || 0} books found
            </p>
          </div>
        </div>

        {/* Books Grid */}
        {books.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center" style={{backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', padding: '48px', textAlign: 'center'}}>
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4" style={{width: '80px', height: '80px', backgroundColor: '#f3f4f6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px'}}>
              <BookOpen className="w-10 h-10 text-gray-400" style={{width: '40px', height: '40px', color: '#9ca3af'}} />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2" style={{fontSize: '20px', fontWeight: '600', color: '#1f2937', marginBottom: '8px'}}>No Books Found</h3>
            <p className="text-gray-600 mb-6" style={{color: '#4b5563', marginBottom: '24px'}}>Start by adding your first book to the collection.</p>
            {isAdmin && (
              <Link to="/add-book">
                <button className="bg-gradient-to-r from-green-600 to-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-teal-700 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl mx-auto" 
                        style={{background: 'linear-gradient(90deg, #059669 0%, #14b8a6 100%)', color: 'white', padding: '12px 24px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', margin: '0 auto'}}>
                  <Plus className="w-5 h-5" style={{width: '20px', height: '20px'}} />
                  Add Your First Book
                </button>
              </Link>
            )}
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center" style={{backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', padding: '48px', textAlign: 'center'}}>
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4" style={{width: '80px', height: '80px', backgroundColor: '#fef3c7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px'}}>
              <Search className="w-10 h-10 text-yellow-600" style={{width: '40px', height: '40px', color: '#d97706'}} />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2" style={{fontSize: '20px', fontWeight: '600', color: '#1f2937', marginBottom: '8px'}}>No Matching Books</h3>
            <p className="text-gray-600 mb-6" style={{color: '#4b5563', marginBottom: '24px'}}>Try adjusting your search criteria or filters.</p>
            <button
              onClick={clearFilters}
              className="bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors flex items-center gap-2 mx-auto"
              style={{backgroundColor: '#4b5563', color: 'white', padding: '12px 24px', borderRadius: '8px', fontWeight: '500', cursor: 'pointer', transition: 'background-color 0.2s', display: 'flex', alignItems: 'center', gap: '8px', border: 'none', margin: '0 auto'}}
            >
              <X className="w-5 h-5" style={{width: '20px', height: '20px'}} />
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px'}}>
              {filteredBooks.map(book => (
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
                  </div>
                  
                  {/* Book Card Header */}
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4" style={{background: 'linear-gradient(90deg, #2563eb 0%, #4f46e5 100%)', padding: '16px'}}>
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
                          View
                        </button>
                      </Link>
                      
                      {/* Cart Button */}
                      <button 
                        onClick={() => addToCart(book.id)}
                        className="bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded-lg font-medium transition-colors flex items-center justify-center text-sm"
                        style={{
                          padding: '8px 12px', 
                          borderRadius: '8px', 
                          fontWeight: '500', 
                          cursor: 'pointer', 
                          transition: 'background-color 0.2s', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          gap: '4px', 
                          fontSize: '14px', 
                          border: 'none',
                          backgroundColor: '#059669',
                          color: 'white'
                        }}
                        title="Add to Cart"
                      >
                        <ShoppingCart className="w-3 h-3" style={{width: '12px', height: '12px'}} />
                        Cart
                      </button>
                      
                      {/* Wishlist Button */}
                      <button 
                        onClick={() => toggleWishlist(book.id)}
                        className={`py-2 px-3 rounded-lg font-medium transition-colors flex items-center justify-center text-sm ${
                          wishlistItems.has(book.id) 
                            ? 'bg-red-500 hover:bg-red-600 text-white' 
                            : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                        }`}
                        style={{
                          padding: '8px 12px', 
                          borderRadius: '8px', 
                          fontWeight: '500', 
                          cursor: 'pointer', 
                          transition: 'background-color 0.2s', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          gap: '4px', 
                          fontSize: '14px', 
                          border: 'none',
                          backgroundColor: wishlistItems.has(book.id) ? '#ef4444' : '#e5e7eb',
                          color: wishlistItems.has(book.id) ? 'white' : '#374151'
                        }}
                      >
                        <Heart className={`w-3 h-3 ${wishlistItems.has(book.id) ? 'fill-current' : ''}`} style={{width: '12px', height: '12px'}} />
                        {wishlistItems.has(book.id) ? 'Saved' : 'Save'}
                      </button>
                      
                      {isAdmin && (
                        <Link to={`/edit-book/${book.id}`} className="flex-1">
                          <button className="w-full bg-orange-600 text-white py-2 px-3 rounded-lg font-medium hover:bg-orange-700 transition-colors flex items-center justify-center gap-1 text-sm"
                                  style={{backgroundColor: '#ea580c', color: 'white', padding: '8px 12px', borderRadius: '8px', fontWeight: '500', cursor: 'pointer', transition: 'background-color 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', fontSize: '14px', border: 'none'}}>
                            <Edit className="w-3 h-3" style={{width: '12px', height: '12px'}} />
                            Edit
                          </button>
                        </Link>
                      )}
                      
                      {isAdmin && (
                        <button 
                          onClick={() => handleDelete(book.id)}
                          className="bg-red-600 text-white py-2 px-3 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center text-sm"
                          style={{backgroundColor: '#dc2626', color: 'white', padding: '8px 12px', borderRadius: '8px', fontWeight: '500', cursor: 'pointer', transition: 'background-color 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', border: 'none'}}
                        >
                          <Trash2 className="w-3 h-3" style={{width: '12px', height: '12px'}} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <div className="bg-white rounded-xl shadow-lg p-2 flex items-center gap-2" style={{backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', padding: '8px', display: 'flex', alignItems: 'center', gap: '8px'}}>
                  {/* Previous Button */}
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    style={{padding: '8px', borderRadius: '8px', backgroundColor: '#f3f4f6', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', opacity: currentPage === 1 ? 0.5 : 1, transition: 'background-color 0.2s', border: 'none'}}
                  >
                    <ChevronLeft className="w-5 h-5" style={{width: '20px', height: '20px'}} />
                  </button>

                  {/* Page Numbers */}
                  <div className="flex items-center gap-1" style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                      let pageNum;
                      if (pagination.totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= pagination.totalPages - 2) {
                        pageNum = pagination.totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                            currentPage === pageNum 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                          }`}
                          style={{
                            width: '40px', 
                            height: '40px', 
                            borderRadius: '8px', 
                            fontWeight: '500', 
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            border: 'none',
                            backgroundColor: currentPage === pageNum ? '#2563eb' : '#f3f4f6',
                            color: currentPage === pageNum ? 'white' : '#374151'
                          }}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === pagination.totalPages}
                    className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    style={{padding: '8px', borderRadius: '8px', backgroundColor: '#f3f4f6', cursor: currentPage === pagination.totalPages ? 'not-allowed' : 'pointer', opacity: currentPage === pagination.totalPages ? 0.5 : 1, transition: 'background-color 0.2s', border: 'none'}}
                  >
                    <ChevronRight className="w-5 h-5" style={{width: '20px', height: '20px'}} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Books;
