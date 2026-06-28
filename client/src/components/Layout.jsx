import Sidebar from './Sidebar';

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center" style={{minHeight: '100vh', background: 'linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%)'}}>
      <div className="w-full max-w-7xl flex h-screen">
        <div className="w-64 flex-shrink-0">
          <Sidebar />
        </div>
        
        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          <div className="px-2 py-2 h-full overflow-auto w-full" style={{paddingLeft: '8px', paddingRight: '8px', paddingTop: '8px', paddingBottom: '8px'}}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Layout;
