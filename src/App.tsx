import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { SavedRecipesProvider } from './context/SavedRecipesContext';
import { HomePage } from './pages/home-page';
import ProfilePage from './pages/profile-page';
import { SavedPage } from './pages/saved-page';
import RecipeDetail from './pages/recipe-detail';
import { WeekplanPage } from './pages/weekplan-page';

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
        </Routes>
      </BrowserRouter>
    </SavedRecipesProvider>
  );
}

export default App;
