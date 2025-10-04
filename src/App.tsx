import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { HomePage } from './pages/home-page';
import { SavedRecipesProvider } from './context/SavedRecipesContext';
import { SavedPage } from './pages/saved-page';

function App() {
  return (
    <SavedRecipesProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/saved" element={<SavedPage />} />
        </Routes>
      </BrowserRouter>
    </SavedRecipesProvider>
  );
}

export default App;
