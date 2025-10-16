import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Analytics } from '@vercel/analytics/react';
import { SavedRecipesProvider } from './features/recipes/context/SavedRecipesContext';
import { HomePage } from './features/home/pages/home-page';
import ProfilePage from './features/profile/pages/profile-page';
import SavedPage from '@features/saved-hub/pages/saved-recipes-page';
import RecipeDetail from '@features/recipes/pages/recipe-detail';
import WeekplanPage from '@features/weekplans/pages/weekplan';
import WeekPlanner from '@features/weekplans/pages/weekplan';

function App() {
  return (
    <SavedRecipesProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/saved" element={<SavedPage />} />
          <Route path="/recipe/:id" element={<RecipeDetail />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/weekplans" element={<WeekplanPage />} />
          <Route path="/weekplanner" element={<WeekPlanner />} />
        </Routes>
      </BrowserRouter>
      <SpeedInsights />
      <Analytics />
    </SavedRecipesProvider>
  );
}

export default App;
