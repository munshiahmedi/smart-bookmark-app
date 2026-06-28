import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { BookOpen, LogOut, User, Library, PlusCircle, Home, Heart } from 'lucide-react';

function Sidebar() {
  const [userRole, setUserRole] = useState(null);
  const location = useLocation();

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
    { path: '/wishlist', label: 'Wishlist', icon: Heart },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  // Add Book item only for admins
  const navItems = userRole === 'admin' 
    ? [...baseNavItems, { path: '/add-book', label: 'Add Book', icon: PlusCircle }]
    : baseNavItems;

  return (
    <div 
      className="h-full w-64 bg-white shadow-xl"
      style={{height: '100vh', width: '256px', backgroundColor: 'white', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}}
    >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6" style={{background: 'linear-gradient(90deg, #2563eb 0%, #4f46e5 100%)', padding: '24px'}}>
          <div className="flex items-center mb-4" style={{display: 'flex', alignItems: 'center', marginBottom: '16px'}}>
            <Link to="/dashboard" className="flex items-center gap-3 text-white" style={{display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', color: 'white'}}>
              <BookOpen className="w-8 h-8" style={{width: '32px', height: '32px'}} />
              <span className="text-xl font-bold" style={{fontSize: '20px', fontWeight: 'bold'}}>Smart Book</span>
            </Link>
          </div>
          <div className="text-blue-100 text-sm" style={{color: '#dbeafe', fontSize: '14px'}}>
            Welcome back!
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4" style={{padding: '16px'}}>
          <div className="space-y-2" style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => onClose()}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                    isActive(item.path)
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                  style={{display: 'flex', alignItems: 'center', gap: '12px', paddingLeft: '16px', paddingRight: '16px', paddingTop: '12px', paddingBottom: '12px', borderRadius: '8px', fontWeight: '500', textDecoration: 'none', transition: 'all 0.2s', backgroundColor: isActive(item.path) ? '#dbeafe' : 'transparent', color: isActive(item.path) ? '#1d4ed8' : '#4b5563'}}
                >
                  <Icon className="w-5 h-5" style={{width: '20px', height: '20px'}} />
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Logout Button */}
          <div className="mt-8 pt-8 border-t border-gray-200" style={{marginTop: '32px', paddingTop: '32px', borderTop: '1px solid #e5e7eb'}}>
            <button
              onClick={logout}
              className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg font-medium transition-colors"
              style={{display: 'flex', alignItems: 'center', gap: '12px', width: '100%', paddingLeft: '16px', paddingRight: '16px', paddingTop: '12px', paddingBottom: '12px', color: '#dc2626', borderRadius: '8px', fontWeight: '500', cursor: 'pointer', background: 'none', border: 'none', transition: 'all 0.2s'}}
              onMouseEnter={(e) => {e.target.style.backgroundColor = '#fef2f2'; e.target.style.color = '#b91c1c';}}
              onMouseLeave={(e) => {e.target.style.backgroundColor = 'transparent'; e.target.style.color = '#dc2626';}}
            >
              <LogOut className="w-5 h-5" style={{width: '20px', height: '20px'}} />
              Logout
            </button>
          </div>
        </nav>
      </div>
  );
}

export default Sidebar;
