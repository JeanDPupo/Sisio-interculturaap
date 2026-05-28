import React, { Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, Box, CircularProgress } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuthStore, colors } from '@sisio/shared';
import { ErrorBoundary } from './components/ErrorBoundary';
import { OfflineIndicator } from './components/OfflineIndicator';
import { Navigation } from './components/Navigation';
import { BottomNav } from './components/BottomNav';
import { LeafParticles } from './components/ui/LeafParticles';

// Lazy-loaded pages
const HomePage = React.lazy(() => import('./pages/HomePage').then(m => ({ default: m.HomePage })));
const OnboardingPage = React.lazy(() => import('./pages/OnboardingPage').then(m => ({ default: m.OnboardingPage })));
const LoginPage = React.lazy(() => import('./pages/LoginPage').then(m => ({ default: m.LoginPage })));
const PhotoUploadPage = React.lazy(() => import('./pages/PhotoUploadPage').then(m => ({ default: m.PhotoUploadPage })));
const AudioUploadPage = React.lazy(() => import('./pages/AudioUploadPage').then(m => ({ default: m.AudioUploadPage })));
const BirdResultPage = React.lazy(() => import('./pages/BirdResultPage').then(m => ({ default: m.BirdResultPage })));
const BirdsListPage = React.lazy(() => import('./pages/BirdsListPage').then(m => ({ default: m.BirdsListPage })));
const BirdDetailPage = React.lazy(() => import('./pages/BirdDetailPage').then(m => ({ default: m.BirdDetailPage })));
const SightingsPage = React.lazy(() => import('./pages/SightingsPage').then(m => ({ default: m.SightingsPage })));
const MapPage = React.lazy(() => import('./pages/MapPage').then(m => ({ default: m.MapPage })));
const ProfilePage = React.lazy(() => import('./pages/ProfilePage').then(m => ({ default: m.ProfilePage })));
const SettingsPage = React.lazy(() => import('./pages/SettingsPage').then(m => ({ default: m.SettingsPage })));
const AdminPage = React.lazy(() => import('./pages/AdminPage').then(m => ({ default: m.AdminPage })));

const LoadingFallback = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#0D1B0F' }}>
    <Box sx={{ textAlign: 'center' }}>
      <Box sx={{ fontSize: 48, animation: 'spinBird 2s linear infinite', display: 'inline-block' }}>🦅</Box>
      <Box sx={{ color: '#b0c4a0', mt: 2, fontFamily: '"Playfair Display", serif' }}>Cargando...</Box>
    </Box>
  </Box>
);

const pageVariants = {
  initial: { opacity: 0, y: 12, filter: 'blur(4px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.35, ease: 'easeOut' } },
  exit: { opacity: 0, y: -8, filter: 'blur(4px)', transition: { duration: 0.2 } },
};

const AnimatedPage: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" style={{ flex: 1 }}>
    {children}
  </motion.div>
);

const MainLayout = ({ children }: { children: React.ReactNode }) => (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: { xs: '100dvh', sm: '100vh' } }}>
    <Navigation />
    <AnimatedPage>{children}</AnimatedPage>
    <BottomNav />
  </Box>
);

const AnimatedRoutes = () => {
  const location = useLocation();
  const { user, isGuest, isAuthenticated } = useAuthStore();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {!isAuthenticated && !isGuest ? (
          <>
            <Route path="/onboarding" element={<Suspense fallback={<LoadingFallback />}><AnimatedPage><OnboardingPage /></AnimatedPage></Suspense>} />
            <Route path="/login" element={<Suspense fallback={<LoadingFallback />}><AnimatedPage><LoginPage /></AnimatedPage></Suspense>} />
            <Route path="*" element={<Navigate to="/onboarding" replace />} />
          </>
        ) : (
          <>
            <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
            <Route path="/photo-upload" element={<MainLayout><PhotoUploadPage /></MainLayout>} />
            <Route path="/audio-upload" element={<MainLayout><AudioUploadPage /></MainLayout>} />
            <Route path="/bird-result" element={<MainLayout><BirdResultPage /></MainLayout>} />
            <Route path="/birds" element={<MainLayout><BirdsListPage /></MainLayout>} />
            <Route path="/bird/:id" element={<MainLayout><BirdDetailPage /></MainLayout>} />
            <Route path="/sightings" element={<MainLayout><SightingsPage /></MainLayout>} />
            <Route path="/map" element={<MainLayout><MapPage /></MainLayout>} />
            <Route path="/profile" element={<MainLayout><ProfilePage /></MainLayout>} />
            <Route path="/settings" element={<MainLayout><SettingsPage /></MainLayout>} />
            <Route path="/admin" element={<MainLayout><AdminPage /></MainLayout>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>
    </AnimatePresence>
  );
};

export default function App() {
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
          h1: { fontFamily: '"Playfair Display", serif', fontWeight: 700 },
          h2: { fontFamily: '"Playfair Display", serif', fontWeight: 700 },
          h3: { fontFamily: '"Playfair Display", serif', fontWeight: 700 },
          h4: { fontFamily: '"Playfair Display", serif', fontWeight: 700 },
          h5: { fontFamily: '"Playfair Display", serif', fontWeight: 600 },
          h6: { fontWeight: 600 },
        },
        shape: { borderRadius: 12 },
        components: {
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

  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <OfflineIndicator />
        <LeafParticles count={6} />
        <BrowserRouter>
          <AnimatedRoutes />
        </BrowserRouter>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
