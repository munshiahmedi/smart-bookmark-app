import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, requireAdmin = false }) {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  if (!token) {
    return <Navigate to="/login" />;
  }

  // Check if admin role is required
  if (requireAdmin && user.role !== 'admin') {
    return <Navigate to="/dashboard" />; // Redirect non-admin users to dashboard
  }

  return children;
}

export default ProtectedRoute;
