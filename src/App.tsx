import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import { LandingPage } from './LandingPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
