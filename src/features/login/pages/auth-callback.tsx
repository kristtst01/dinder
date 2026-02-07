import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../lib/supabase/supabase';
import logo from '@shared/logo.svg';

export function AuthCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the session from the URL hash parameters
        const { data, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          throw sessionError;
        }

        if (data.session) {
          // Session established successfully, redirect to home
          navigate('/home', { replace: true });
        } else {
          // No session found, redirect back to login
          setError('Authentication failed. Please try again.');
          setTimeout(() => {
            navigate('/', { replace: true });
          }, 3000);
        }
      } catch (err) {
        console.error('Auth callback error:', err);
        setError(err instanceof Error ? err.message : 'An error occurred during authentication');
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 3000);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-orange-50 px-4">
      <div className="flex items-center gap-4 mb-8">
        <img src={logo} alt="Dinder" className="w-16 h-16" />
        <span className="text-orange-600 font-black text-5xl tracking-tighter">Dinder</span>
      </div>

      {error ? (
        <div className="text-center">
          <div className="bg-red-50 text-red-700 px-6 py-4 rounded-2xl font-medium mb-4 max-w-md">
            {error}
          </div>
          <p className="text-gray-600 text-sm">Redirecting you back to login...</p>
        </div>
      ) : (
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4 mx-auto" />
          <p className="text-gray-700 font-medium text-lg">Completing sign in...</p>
        </div>
      )}
    </div>
  );
}
