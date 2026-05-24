import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, Box } from '@mui/material';
import { useAuthStore } from '@sisio/shared';
import { ErrorBoundary } from './components/ErrorBoundary';
import { OfflineIndicator } from './components/OfflineIndicator';
import {
  HomePage,
  PhotoUploadPage,
  BirdResultPage,
  SightingsPage,
  AudioUploadPage,
  MapPage,
  ProfilePage,
  SettingsPage,
  AdminPage,
  BirdsListPage,
  BirdDetailPage,
} from './pages';

// Auth pages
import { LoginPage } from './pages/LoginPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { Navigation } from './components/Navigation';

const MainLayout = ({ children }: { children: React.ReactNode }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
    <Navigation />
    {children}
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
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <OfflineIndicator />
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
              <Route
                path="/photo-upload"
                element={
                  <MainLayout>
                    <PhotoUploadPage />
                  </MainLayout>
                }
              />
              <Route
                path="/audio-upload"
                element={
                  <MainLayout>
                    <AudioUploadPage />
                  </MainLayout>
                }
              />
              <Route
                path="/bird-result"
                element={
                  <MainLayout>
                    <BirdResultPage />
                  </MainLayout>
                }
              />
              <Route
                path="/birds"
                element={
                  <MainLayout>
                    <BirdsListPage />
                  </MainLayout>
                }
              />
              <Route
                path="/bird/:id"
                element={
                  <MainLayout>
                    <BirdDetailPage />
                  </MainLayout>
                }
              />
              <Route
                path="/sightings"
                element={
                  <MainLayout>
                    <SightingsPage />
                  </MainLayout>
                }
              />
              <Route
                path="/map"
                element={
                  <MainLayout>
                    <MapPage />
                  </MainLayout>
                }
              />
              <Route
                path="/profile"
                element={
                  <MainLayout>
                    <ProfilePage />
                  </MainLayout>
                }
              />
              <Route
                path="/settings"
                element={
                  <MainLayout>
                    <SettingsPage />
                  </MainLayout>
                }
              />
              <Route
                path="/admin"
                element={
                  <MainLayout>
                    <AdminPage />
                  </MainLayout>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          )}
        </Routes>
      </BrowserRouter>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
