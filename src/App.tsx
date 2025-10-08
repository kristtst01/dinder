import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { HomePage } from './pages/home-page';
<<<<<<< Updated upstream

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
=======
import { SavedRecipesProvider } from './context/SavedRecipesContext';
import { SavedPage } from './pages/saved-page';
import RecipeDetail from './pages/recipe-detail';

function App() {
  return (
    <SavedRecipesProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/saved" element={<SavedPage />} />
          <Route path="/recipe/:id" element={<RecipeDetail/>} />
        </Routes>
      </BrowserRouter>
    </SavedRecipesProvider>
>>>>>>> Stashed changes
  );
}

export default App;
