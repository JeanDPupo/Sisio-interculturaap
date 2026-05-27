import React, { useEffect, useMemo, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, Box } from '@mui/material';
import { useAuthStore, colors } from '@sisio/shared';
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
  const [darkMode, setDarkMode] = React.useState(true);
  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? 'dark' : 'light',
          primary: {
            main: colors.verdeSelva,
            light: colors.verdeHoja,
            dark: colors.negroSelva,
          },
          secondary: {
            main: colors.oroIndigena,
            light: colors.ambarSolar,
          },
          ...(darkMode
            ? {
                background: {
                  default: colors.negroSelva,
                  paper: '#1a2e1e',
                },
                text: {
                  primary: colors.blancoNiebla,
                  secondary: '#b0c4a0',
                },
              }
            : {
                background: {
                  default: colors.blancoNiebla,
                  paper: '#ffffff',
                },
                text: {
                  primary: colors.negroSelva,
                  secondary: '#5a6b52',
                },
              }),
          error: { main: colors.riesgoAlto },
          warning: { main: colors.riesgoMedio },
          success: { main: colors.riesgoBajo },
        },
        typography: {
          fontFamily: '"Inter", "DM Sans", "Roboto", sans-serif',
          h4: { fontFamily: '"Playfair Display", serif', fontWeight: 700 },
          h5: { fontFamily: '"Playfair Display", serif', fontWeight: 600 },
          h6: { fontWeight: 600 },
        },
        shape: { borderRadius: 12 },
        components: {
          MuiCard: {
            styleOverrides: {
              root: {
                backdropFilter: 'blur(20px)',
                background: darkMode
                  ? 'rgba(255,255,255,0.05)'
                  : 'rgba(255,255,255,0.8)',
                border: darkMode
                  ? '1px solid rgba(255,255,255,0.1)'
                  : '1px solid rgba(0,0,0,0.08)',
                borderRadius: 20,
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 12,
                textTransform: 'none',
                fontWeight: 600,
                padding: '10px 24px',
              },
              containedPrimary: {
                background: `linear-gradient(135deg, ${colors.verdeSelva}, ${colors.oroIndigena})`,
                '&:hover': {
                  background: `linear-gradient(135deg, ${colors.verdeMusgo}, ${colors.ambarSolar})`,
                },
              },
            },
          },
          MuiCssBaseline: {
            styleOverrides: {
              body: {
                scrollBehavior: 'smooth',
              },
            },
          },
        },
      }),
    [darkMode]
  );

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
