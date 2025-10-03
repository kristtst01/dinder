import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import { HomePage } from './pages/HomePage';
import { RecipeCardDemo } from './pages/RecipeCardDemo';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/demo" element={<RecipeCardDemo />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
