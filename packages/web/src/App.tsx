import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, Box } from '@mui/material';
import { useAuthStore } from '@sisio/shared';
import { HomePage, PhotoUploadPage, BirdResultPage, SightingsPage } from './pages';

// Placeholder pages (to be implemented)
const AudioUploadPage = () => <div>Audio Upload Page</div>;
const MapPage = () => <div>Map Page</div>;
const ProfilePage = () => <div>Profile Page</div>;
const SettingsPage = () => <div>Settings Page</div>;
const LoginPage = () => <div>Login Page</div>;
const OnboardingPage = () => <div>Onboarding Page</div>;
const AdminPage = () => <div>Admin Page</div>;

const MainLayout = ({ children }: { children: React.ReactNode }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
    {/* Header/Navigation */}
    {children}
    {/* Footer */}
  </Box>
);

export default function App() {
  const { user, isGuest, isAuthenticated } = useAuthStore();
  const theme = createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: '#2196F3',
      },
      secondary: {
        main: '#4CAF50',
      },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    },
  });

  useEffect(() => {
    // Initialize app
    const initializeApp = async () => {
      // Check if user is logged in
      // Load user profile if available
    };

    initializeApp();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          {!isAuthenticated && !isGuest ? (
            <>
              <Route path="/onboarding" element={<OnboardingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="*" element={<Navigate to="/onboarding" replace />} />
            </>
          ) : (
            <>
              <Route
                path="/"
                element={
                  <MainLayout>
                    <HomePage />
                  </MainLayout>
                }
              />
              <Route path="/photo-upload" element={<PhotoUploadPage />} />
              <Route path="/audio-upload" element={<AudioUploadPage />} />
              <Route path="/bird-result" element={<BirdResultPage />} />
              <Route path="/sightings" element={<SightingsPage />} />
              <Route path="/map" element={<MapPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          )}
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
