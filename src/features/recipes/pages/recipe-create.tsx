import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/common/hooks/use-auth';
import { RecipeUploadForm } from '../components/recipe-upload-form';

export function RecipeCreatePage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-8 lg:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-3 tracking-tight">
            Create Recipe
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">
            Share your culinary masterpiece with the community.
          </p>
        </div>

        <RecipeUploadForm />
      </div>
    </div>
  );
}
