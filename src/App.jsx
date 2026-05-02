import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './hooks/useAuth.jsx';
import LandingPage from './pages/LandingPage.jsx';
import CreateSurprisePage from './pages/CreateSurprisePage.jsx';
import SurpriseViewerPage from './pages/SurpriseViewerPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SharePage from './pages/SharePage.jsx';

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/create" element={<CreateSurprisePage />} />
        <Route path="/share" element={<SharePage />} />
        <Route path="/surprise/:id" element={<SurpriseViewerPage />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;