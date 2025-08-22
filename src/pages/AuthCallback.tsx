import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    // Check if user is authenticated
    if (user) {
      // User is authenticated, redirect to dashboard
      navigate('/dashboard');
    } else {
      // User is not authenticated, redirect to login
      navigate('/login');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-black mb-4">
          <img
            src="/kosc-logo.png"
            alt="KOSC"
            className="h-8 w-auto"
          />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Verificatie...
        </h2>
        <p className="text-gray-600">
          Je wordt doorgestuurd...
        </p>
      </div>
    </div>
  );
};

export default AuthCallback;
