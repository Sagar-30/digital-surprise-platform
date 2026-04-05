import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './hooks/useAuth';
import LandingPage from './pages/LandingPage';
import CreateSurprisePage from './pages/CreateSurprisePage';
import SurpriseViewerPage from './pages/SurpriseViewerPage';
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/create" element={<CreateSurprisePage />} />
        <Route path="/surprise/:id" element={<SurpriseViewerPage />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;