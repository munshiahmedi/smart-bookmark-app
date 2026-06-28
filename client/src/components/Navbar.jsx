import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { BookOpen, LogOut, User, Library, PlusCircle, Home, Heart, ShoppingCart, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';

function Navbar() {
  const [userRole, setUserRole] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { cartCount } = useCart();

  useEffect(() => {
    // Get user role from localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    setUserRole(user?.role || 'user');
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const isActive = (path) => location.pathname === path;

  const baseNavItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/books', label: 'Books', icon: Library },
    { path: '/cart', label: 'Cart', icon: ShoppingCart },
    { path: '/wishlist', label: 'Wishlist', icon: Heart },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  // Add Book item only for admins
  const navItems = userRole === 'admin' 
    ? [...baseNavItems, { path: '/add-book', label: 'Add Book', icon: PlusCircle }]
    : baseNavItems;

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50" style={{backgroundColor: 'white', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', borderBottom: '1px solid #e5e7eb', position: 'sticky', top: '0', zIndex: '50'}}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{maxWidth: '1280px', margin: '0 auto', paddingLeft: '16px', paddingRight: '16px'}}>
        <div className="flex justify-between items-center h-16" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '64px'}}>
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2 text-xl font-bold text-blue-600 hover:text-blue-700 transition-colors" style={{display: 'flex', alignItems: 'center', gap: '8px', fontSize: '20px', fontWeight: 'bold', color: '#2563eb', textDecoration: 'none'}}>
            <BookOpen className="w-8 h-8" style={{width: '32px', height: '32px'}} />
            <span>Smart Book</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1" style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isCart = item.path === '/cart';
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors relative ${
                    isActive(item.path)
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                  style={{display: 'flex', alignItems: 'center', gap: '8px', paddingLeft: '16px', paddingRight: '16px', paddingTop: '8px', paddingBottom: '8px', borderRadius: '8px', fontWeight: '500', textDecoration: 'none', transition: 'all 0.2s', backgroundColor: isActive(item.path) ? '#dbeafe' : 'transparent', color: isActive(item.path) ? '#1d4ed8' : '#4b5563'}}
                >
                  <Icon className="w-4 h-4" style={{width: '16px', height: '16px'}} />
                  {item.label}
                  {isCart && cartCount > 0 && (
                    <span 
                      className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold"
                      style={{
                        position: 'absolute',
                        top: '-4px',
                        right: '-4px',
                        backgroundColor: '#ef4444',
                        color: 'white',
                        fontSize: '10px',
                        borderRadius: '50%',
                        width: '20px',
                        height: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold'
                      }}
                    >
                      {cartCount > 99 ? '99+' : cartCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            {/* Cart Link for Mobile */}
            <Link
              to="/cart"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-colors relative ${
                isActive('/cart')
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
              style={{display: 'flex', alignItems: 'center', gap: '8px', paddingLeft: '12px', paddingRight: '12px', paddingTop: '8px', paddingBottom: '8px', borderRadius: '8px', fontWeight: '500', textDecoration: 'none', transition: 'all 0.2s', backgroundColor: isActive('/cart') ? '#dbeafe' : 'transparent', color: isActive('/cart') ? '#1d4ed8' : '#4b5563'}}
            >
              <ShoppingCart className="w-4 h-4" style={{width: '16px', height: '16px'}} />
              {cartCount > 0 && (
                <span 
                  className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold"
                  style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    backgroundColor: '#ef4444',
                    color: 'white',
                    fontSize: '10px',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold'
                  }}
                >
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>
            
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              style={{padding: '8px', borderRadius: '8px', color: '#4b5563', backgroundColor: 'transparent', border: 'none', cursor: 'pointer'}}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" style={{width: '24px', height: '24px'}} /> : <Menu className="w-6 h-6" style={{width: '24px', height: '24px'}} />}
            </button>
          </div>

          {/* Logout Button - Desktop */}
          <div className="hidden md:flex items-center" style={{display: 'flex', alignItems: 'center'}}>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg font-medium transition-colors"
              style={{display: 'flex', alignItems: 'center', gap: '8px', paddingLeft: '16px', paddingRight: '16px', paddingTop: '8px', paddingBottom: '8px', color: '#dc2626', borderRadius: '8px', fontWeight: '500', cursor: 'pointer', background: 'none', border: 'none', transition: 'all 0.2s'}}
              onMouseEnter={(e) => {e.target.style.backgroundColor = '#fef2f2'; e.target.style.color = '#b91c1c';}}
              onMouseLeave={(e) => {e.target.style.backgroundColor = 'transparent'; e.target.style.color = '#dc2626';}}
            >
              <LogOut className="w-4 h-4" style={{width: '16px', height: '16px'}} />
              Logout
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-lg border-t border-gray-200" style={{position: 'absolute', top: '64px', left: '0', right: '0', backgroundColor: 'white', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', borderTop: '1px solid #e5e7eb'}}>
              <div className="px-4 py-2 space-y-1" style={{paddingLeft: '16px', paddingRight: '16px', paddingTop: '8px', paddingBottom: '8px', display: 'flex', flexDirection: 'column', gap: '4px'}}>
                {navItems.filter(item => item.path !== '/cart').map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${
                        isActive(item.path)
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                      style={{display: 'flex', alignItems: 'center', gap: '12px', paddingLeft: '12px', paddingRight: '12px', paddingTop: '8px', paddingBottom: '8px', borderRadius: '8px', fontWeight: '500', textDecoration: 'none', transition: 'all 0.2s', backgroundColor: isActive(item.path) ? '#dbeafe' : 'transparent', color: isActive(item.path) ? '#1d4ed8' : '#4b5563'}}
                    >
                      <Icon className="w-4 h-4" style={{width: '16px', height: '16px'}} />
                      {item.label}
                    </Link>
                  );
                })}
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-3 px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg font-medium transition-colors w-full"
                  style={{display: 'flex', alignItems: 'center', gap: '12px', paddingLeft: '12px', paddingRight: '12px', paddingTop: '8px', paddingBottom: '8px', color: '#dc2626', borderRadius: '8px', fontWeight: '500', cursor: 'pointer', background: 'none', border: 'none', transition: 'all 0.2s', width: '100%', textAlign: 'left'}}
                >
                  <LogOut className="w-4 h-4" style={{width: '16px', height: '16px'}} />
                  Logout
                </button>
              </div>
            </div>
          )}

                  </div>

      </div>
    </nav>
  );
}

export default Navbar;
