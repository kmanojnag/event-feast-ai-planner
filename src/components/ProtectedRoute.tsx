
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'customer' | 'provider' | 'organizer';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log('Unauthorized access attempt - redirecting to auth');
    return <Navigate to="/auth" replace />;
  }

  if (requiredRole && profile?.role !== requiredRole) {
    console.log('Insufficient role permissions:', { 
      required: requiredRole, 
      actual: profile?.role,
      userId: user.id
    });
    
    // Redirect to their appropriate dashboard
    return <Navigate to={`/dashboard/${profile?.role}`} replace />;
  }

  // Log successful authorized access
  console.log('Authorized access granted:', {
    userId: user.id,
    role: profile?.role,
    requiredRole
  });

  return <>{children}</>;
};

export default ProtectedRoute;
