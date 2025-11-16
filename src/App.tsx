import EditProfilePage from '@features/profile/pages/edit-profile-page';
import RecipeDetail from '@features/recipes/pages/recipe-detail';
import { RecipeCreatePage } from '@features/recipes/pages/recipe-create';
import { RecipeEditPage } from '@features/recipes/pages/recipe-edit';
import CookbookPage from '@features/cookbook/pages/cookbook-page';
import { WeekplanPage } from '@features/weekplans/pages/weekplan-cards-page';
import WeekPlanner from '@features/weekplans/pages/weekplan';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { HomePage } from './features/home/pages/home-page';
import SettingsPage from './features/preferences/pages/preferences-page';
import { SavedRecipesProvider } from './features/recipes/context/SavedRecipesContext';

function App() {
  return (
    <SavedRecipesProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cookbook" element={<CookbookPage />} />
          <Route path="/recipe/create" element={<RecipeCreatePage />} />
          <Route path="/recipe/edit/:id" element={<RecipeEditPage />} />
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
