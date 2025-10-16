import EditProfilePage from '@features/profile/pages/edit-profile-page';
import RecipeDetail from '@features/recipes/pages/recipe-detail';
import SavedPage from '@features/saved-hub/pages/saved-recipes-page';
import {
  default as WeekPlanner,
  default as WeekplanPage,
} from '@features/weekplans/pages/weekplan';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { HomePage } from './features/home/pages/home-page';
import SettingsPage from './features/profile/pages/settings-page';
import { SavedRecipesProvider } from './features/recipes/context/SavedRecipesContext';

function App() {
  return (
    <SavedRecipesProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/saved" element={<SavedPage />} />
          <Route path="/recipe/:id" element={<RecipeDetail />} />
          <Route path="/preferences" element={<SettingsPage />} />
          <Route path="/weekplans" element={<WeekplanPage />} />
          <Route path="/weekplanner" element={<WeekPlanner />} />
          <Route path="/profile" element={<EditProfilePage />} />
        </Routes>
      </BrowserRouter>
      <SpeedInsights />
      <Analytics />
    </SavedRecipesProvider>
  );
}

export default App;
