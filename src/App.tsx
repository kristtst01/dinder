import EditProfilePage from '@features/profile/pages/edit-profile-page';
import RecipeDetail from '@features/recipes/pages/recipe-detail';
import { RecipeCreatePage } from '@features/recipes/pages/recipe-create';
import { RecipeEditPage } from '@features/recipes/pages/recipe-edit';
import CookbookPage from '@features/cookbook/pages/cookbook-page';
import { WeekplanPage } from '@features/weekplans/pages/weekplan-cards-page';
import WeekPlanner from '@features/weekplans/pages/weekplan';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { HomePage } from './features/home/pages/home-page';
import SettingsPage from './features/preferences/pages/preferences-page';
import { SavedRecipesProvider } from './features/recipes/context/SavedRecipesContext';
import { LandingPage } from './features/login/pages/landing-page';
import { useAuth } from '@common/hooks/use-auth';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function App() {
  return (
    <SavedRecipesProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/cookbook" element={<CookbookPage />} />
          <Route
            path="/recipe/create"
            element={
              <ProtectedRoute>
                <RecipeCreatePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recipe/edit/:id"
            element={
              <ProtectedRoute>
                <RecipeEditPage />
              </ProtectedRoute>
            }
          />
          <Route path="/recipe/:id" element={<RecipeDetail />} />
          <Route
            path="/preferences"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/weekplans"
            element={
              <ProtectedRoute>
                <WeekplanPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/weekplanner"
            element={
              <ProtectedRoute>
                <WeekPlanner />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <EditProfilePage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
      <SpeedInsights />
      <Analytics />
    </SavedRecipesProvider>
  );
}

export default App;
