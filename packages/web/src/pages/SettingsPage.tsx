import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Switch,
  Button,
  Stack,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import LogoutIcon from '@mui/icons-material/Logout';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import NotificationsIcon from '@mui/icons-material/Notifications';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import InfoIcon from '@mui/icons-material/Info';
import LanguageIcon from '@mui/icons-material/Language';
import { useAuth, useAuthStore } from '@sisio/shared';

const verdeSelva = '#2D5016';
const verdeMusgo = '#4A7C2F';
const verdeHoja = '#8BC34A';
const azulNoche = '#1A3A4A';
const azulCielo = '#2E7D9A';
const azulClaro = '#64B5F6';
const oroIndigena = '#D4A017';
const ambarSolar = '#F5C842';
const naranjaAtardecer = '#FF8F00';
const negroSelva = '#0D1B0F';
const blancoNiebla = '#F0F7EE';
const riesgoAlto = '#F44336';

const glassmorphism = {
  background: 'rgba(13, 27, 15, 0.65)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 16,
  overflow: 'hidden',
};

const languages = [
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'kog', label: 'Kogui', flag: '🏔️' },
  { code: 'wiw', label: 'Wiwa', flag: '🌿' },
  { code: 'arh', label: 'Arhuaco', flag: '🪶' },
];

interface ThemeToggleProps {
  darkMode: boolean;
  onToggle: () => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ darkMode, onToggle }) => (
  <Box
    onClick={onToggle}
    sx={{
      width: 64,
      height: 34,
      borderRadius: 17,
      bgcolor: darkMode ? azulNoche : ambarSolar,
      position: 'relative',
      cursor: 'pointer',
      transition: 'background-color 0.4s ease',
      border: `2px solid ${darkMode ? azulClaro : oroIndigena}44`,
      mx: 'auto',
    }}
  >
    <motion.div
      animate={{
        x: darkMode ? 32 : 4,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      style={{
        position: 'absolute',
        top: 2,
        width: 26,
        height: 26,
        borderRadius: '50%',
        background: darkMode
          ? `linear-gradient(135deg, ${azulClaro}, ${azulCielo})`
          : `linear-gradient(135deg, ${ambarSolar}, ${naranjaAtardecer})`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: darkMode
          ? `0 0 12px ${azulClaro}66`
          : `0 0 12px ${ambarSolar}66`,
      }}
    >
      <AnimatePresence mode="wait">
        {darkMode ? (
          <motion.div
            key="moon"
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <DarkModeIcon sx={{ fontSize: 16, color: '#fff' }} />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ rotate: 90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: -90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <LightModeIcon sx={{ fontSize: 16, color: '#fff' }} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  </Box>
);

export const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { user } = useAuthStore();
  const [darkMode, setDarkMode] = useState(true);
  const [language, setLanguage] = useState('es');
  const [notifications, setNotifications] = useState(true);
  const [offlineMode, setOfflineMode] = useState(true);
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
  const [openClearDataDialog, setOpenClearDataDialog] = useState(false);

  const handleLogout = async () => {
    setOpenLogoutDialog(false);
    await logout();
    navigate('/login');
  };

  const handleClearData = async () => {
    setOpenClearDataDialog(false);
    try {
      localStorage.clear();
      sessionStorage.clear();
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map((name) => caches.delete(name)));
      }
      if ('indexedDB' in window) {
        const databases = await indexedDB.databases();
        for (const db of databases) {
          if (db.name) indexedDB.deleteDatabase(db.name);
        }
      }
      navigate('/');
      window.location.reload();
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  };

  const handleExportData = async () => {
    try {
      const userData = {
        user: user,
        exportedAt: new Date().toISOString(),
      };
      const dataStr = JSON.stringify(userData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `sisio-data-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: negroSelva }}>
      <Box
        sx={{
          background: `linear-gradient(180deg, ${negroSelva} 0%, ${azulNoche}44 50%, ${negroSelva} 100%)`,
          pt: 3,
          pb: 6,
          px: { xs: 2, sm: 3 },
        }}
      >
        <Box sx={{ maxWidth: 600, mx: 'auto' }}>
          <Typography
            variant="h4"
            sx={{
              fontFamily: '"Playfair Display", serif',
              fontWeight: 700,
              color: blancoNiebla,
              mb: 4,
              textAlign: 'center',
              fontSize: { xs: '1.8rem', sm: '2.2rem' },
            }}
          >
            Configuración
          </Typography>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
            <Box sx={{ ...glassmorphism, p: 3, mb: 3 }}>
              <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: 2,
                    bgcolor: `${ambarSolar}22`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {darkMode ? (
                    <DarkModeIcon sx={{ color: azulClaro, fontSize: 20 }} />
                  ) : (
                    <LightModeIcon sx={{ color: ambarSolar, fontSize: 20 }} />
                  )}
                </Box>
                <Box>
                  <Typography variant="subtitle2" sx={{ color: blancoNiebla, fontWeight: 600 }}>
                    Apariencia
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>
                    {darkMode ? 'Modo oscuro activado' : 'Modo claro activado'}
                  </Typography>
                </Box>
              </Stack>
              <ThemeToggle darkMode={darkMode} onToggle={() => setDarkMode(!darkMode)} />
            </Box>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Box sx={{ ...glassmorphism, p: 3, mb: 3 }}>
              <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2.5 }}>
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: 2,
                    bgcolor: `${verdeHoja}22`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <LanguageIcon sx={{ color: verdeHoja, fontSize: 20 }} />
                </Box>
                <Box>
                  <Typography variant="subtitle2" sx={{ color: blancoNiebla, fontWeight: 600 }}>
                    Idioma
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>
                    Selecciona tu idioma preferido
                  </Typography>
                </Box>
              </Stack>
              <Stack spacing={1}>
                {languages.map((lang) => (
                  <Box
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      p: 1.5,
                      borderRadius: 2,
                      cursor: 'pointer',
                      bgcolor: language === lang.code ? `${verdeHoja}15` : 'transparent',
                      border: `1px solid ${language === lang.code ? verdeHoja : 'rgba(255,255,255,0.06)'}`,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        bgcolor: language === lang.code ? `${verdeHoja}20` : 'rgba(255,255,255,0.03)',
                      },
                    }}
                  >
                    <Typography variant="h6" sx={{ fontSize: 20, lineHeight: 1 }}>
                      {lang.flag}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: language === lang.code ? verdeHoja : blancoNiebla,
                        fontWeight: language === lang.code ? 600 : 400,
                        flex: 1,
                      }}
                    >
                      {lang.label}
                    </Typography>
                    {language === lang.code && (
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          bgcolor: verdeHoja,
                          boxShadow: `0 0 8px ${verdeHoja}66`,
                        }}
                      />
                    )}
                  </Box>
                ))}
              </Stack>
            </Box>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Box sx={{ ...glassmorphism, p: 3, mb: 3 }}>
              <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: 2,
                    bgcolor: `${naranjaAtardecer}22`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <NotificationsIcon sx={{ color: naranjaAtardecer, fontSize: 20 }} />
                </Box>
                <Box>
                  <Typography variant="subtitle2" sx={{ color: blancoNiebla, fontWeight: 600 }}>
                    Notificaciones
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>
                    Gestiona tus preferencias de notificación
                  </Typography>
                </Box>
              </Stack>
              <Stack divider={<Divider sx={{ borderColor: 'rgba(255,255,255,0.06)' }} />}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ py: 1.5 }}>
                  <Box>
                    <Typography variant="body2" sx={{ color: blancoNiebla, fontWeight: 500 }}>
                      Notificaciones Push
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.35)' }}>
                      Recibe alertas sobre actividad
                    </Typography>
                  </Box>
                  <Switch
                    checked={notifications}
                    onChange={(e) => setNotifications(e.target.checked)}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': { color: verdeHoja },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: verdeHoja },
                    }}
                  />
                </Stack>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ py: 1.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <WifiOffIcon sx={{ color: azulClaro, fontSize: 18 }} />
                    <Box>
                      <Typography variant="body2" sx={{ color: blancoNiebla, fontWeight: 500 }}>
                        Modo Offline
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.35)' }}>
                        Usa la app sin conexión
                      </Typography>
                    </Box>
                  </Box>
                  <Switch
                    checked={offlineMode}
                    onChange={(e) => setOfflineMode(e.target.checked)}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': { color: azulClaro },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: azulClaro },
                    }}
                  />
                </Stack>
              </Stack>
            </Box>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Box sx={{ ...glassmorphism, p: 3, mb: 3 }}>
              <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2.5 }}>
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: 2,
                    bgcolor: `${azulClaro}22`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <CloudDownloadIcon sx={{ color: azulClaro, fontSize: 20 }} />
                </Box>
                <Box>
                  <Typography variant="subtitle2" sx={{ color: blancoNiebla, fontWeight: 600 }}>
                    Datos & Privacidad
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>
                    Exporta o elimina tus datos
                  </Typography>
                </Box>
              </Stack>
              <Stack spacing={2}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<CloudDownloadIcon />}
                  onClick={handleExportData}
                  sx={{
                    py: 1.5,
                    color: azulClaro,
                    borderColor: `${azulClaro}44`,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    '&:hover': { borderColor: azulClaro, background: `${azulClaro}11` },
                  }}
                >
                  Descargar Mis Datos
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<DeleteIcon />}
                  onClick={() => setOpenClearDataDialog(true)}
                  sx={{
                    py: 1.5,
                    color: riesgoAlto,
                    borderColor: `${riesgoAlto}44`,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    '&:hover': { borderColor: riesgoAlto, background: `${riesgoAlto}11` },
                  }}
                >
                  Eliminar Datos Locales
                </Button>
              </Stack>
            </Box>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Box sx={{ ...glassmorphism, p: 3, mb: 3 }}>
              <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2.5 }}>
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: 2,
                    bgcolor: `${riesgoAlto}22`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <LogoutIcon sx={{ color: riesgoAlto, fontSize: 20 }} />
                </Box>
                <Box>
                  <Typography variant="subtitle2" sx={{ color: blancoNiebla, fontWeight: 600 }}>
                    Cuenta
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>
                    Gestiona tu sesión
                  </Typography>
                </Box>
              </Stack>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<LogoutIcon />}
                onClick={() => setOpenLogoutDialog(true)}
                sx={{
                  py: 1.5,
                  color: riesgoAlto,
                  borderColor: `${riesgoAlto}44`,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  '&:hover': { borderColor: riesgoAlto, background: `${riesgoAlto}11` },
                }}
              >
                Cerrar Sesión
              </Button>
            </Box>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <Box
              sx={{
                ...glassmorphism,
                p: 3,
                textAlign: 'center',
                background: 'rgba(13, 27, 15, 0.4)',
              }}
            >
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: 3,
                  background: `linear-gradient(135deg, ${verdeSelva}, ${azulNoche})`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 2,
                  border: `1px solid ${verdeHoja}33`,
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    fontFamily: '"Playfair Display", serif',
                    fontWeight: 700,
                    color: verdeHoja,
                  }}
                >
                  S
                </Typography>
              </Box>
              <Typography
                variant="subtitle1"
                sx={{
                  fontFamily: '"Playfair Display", serif',
                  fontWeight: 700,
                  color: blancoNiebla,
                  mb: 0.5,
                }}
              >
                Sisio
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', display: 'block', mb: 1.5 }}>
                Versión 1.0.0
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, maxWidth: 400, mx: 'auto' }}>
                Una plataforma para documentar y proteger la biodiversidad de la Sierra Nevada de Santa Marta, integrando el saber ancestral de los pueblos Arhuaco, Kogui, Wiwa y Kankuamo.
              </Typography>
            </Box>
          </motion.div>
        </Box>
      </Box>

      <Dialog
        open={openLogoutDialog}
        onClose={() => setOpenLogoutDialog(false)}
        PaperProps={{
          sx: {
            bgcolor: '#1a2e1c',
            backgroundImage: 'none',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 3,
            maxWidth: 380,
          },
        }}
      >
        <DialogTitle sx={{ color: blancoNiebla, fontFamily: '"Playfair Display", serif', fontWeight: 700 }}>
          Cerrar Sesión
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: 'rgba(255,255,255,0.6)' }}>
            ¿Estás seguro de que deseas cerrar sesión? Tendrás que iniciar sesión nuevamente para acceder a tu perfil y avistamientos.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={() => setOpenLogoutDialog(false)}
            sx={{ color: 'rgba(255,255,255,0.5)', textTransform: 'none' }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleLogout}
            variant="contained"
            sx={{
              bgcolor: riesgoAlto,
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': { bgcolor: '#d32f2f' },
            }}
          >
            Cerrar Sesión
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openClearDataDialog}
        onClose={() => setOpenClearDataDialog(false)}
        PaperProps={{
          sx: {
            bgcolor: '#1a2e1c',
            backgroundImage: 'none',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 3,
            maxWidth: 380,
          },
        }}
      >
        <DialogTitle sx={{ color: blancoNiebla, fontFamily: '"Playfair Display", serif', fontWeight: 700 }}>
          Eliminar Datos Locales
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: 'rgba(255,255,255,0.6)', mb: 2 }}>
            ¿Estás seguro? Esta acción eliminará todos los datos almacenados en tu dispositivo y no se puede deshacer.
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.35)' }}>
            Se borrarán: cachés, bases de datos locales, cookies y almacenamiento local. Tus datos en el servidor permanecerán intactos.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={() => setOpenClearDataDialog(false)}
            sx={{ color: 'rgba(255,255,255,0.5)', textTransform: 'none' }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleClearData}
            variant="contained"
            startIcon={<DeleteIcon />}
            sx={{
              bgcolor: riesgoAlto,
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': { bgcolor: '#d32f2f' },
            }}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
