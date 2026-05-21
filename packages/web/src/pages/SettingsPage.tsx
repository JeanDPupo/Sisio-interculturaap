import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Box,
  Typography,
  Switch,
  FormControlLabel,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  List,
  ListItem,
  ListItemText,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth, useAuthStore } from '@sisio/shared';

export const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { user } = useAuthStore();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
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
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
          Configuración
        </Typography>

        {/* Display & Theme Settings */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Apariencia
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Box sx={{ mb: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Tema</InputLabel>
              <Select value={theme} onChange={(e) => setTheme(e.target.value as 'light' | 'dark')}>
                <MenuItem value="light">Claro</MenuItem>
                <MenuItem value="dark">Oscuro</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box>
            <FormControl fullWidth>
              <InputLabel>Idioma</InputLabel>
              <Select value={language} onChange={(e) => setLanguage(e.target.value)}>
                <MenuItem value="es">Español</MenuItem>
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="pt">Português</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Paper>

        {/* Notification Settings */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Notificaciones
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <List>
            <ListItem>
              <ListItemText
                primary="Notificaciones Push"
                secondary="Recibe alertas sobre comentarios y respuestas"
              />
              <Switch
                edge="end"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Modo Offline"
                secondary="Permite usar la app sin conexión a internet"
              />
              <Switch
                edge="end"
                checked={offlineMode}
                onChange={(e) => setOfflineMode(e.target.checked)}
              />
            </ListItem>
          </List>
        </Paper>

        {/* Data & Privacy */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Datos & Privacidad
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<CloudDownloadIcon />}
              onClick={handleExportData}
            >
              Descargar Mis Datos
            </Button>

            <Typography variant="caption" color="textSecondary">
              Los datos se descargarán en formato JSON con tu información de perfil y
              avistamientos.
            </Typography>

            <Button
              fullWidth
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => setOpenClearDataDialog(true)}
            >
              Eliminar Todos los Datos Locales
            </Button>

            <Typography variant="caption" color="textSecondary">
              Esto eliminará todos los datos almacenados en tu dispositivo (cachés, bases de datos
              locales, etc.). Tus datos en el servidor permanecerán intactos.
            </Typography>
          </Box>
        </Paper>

        {/* Account Actions */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Cuenta
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              color="error"
              startIcon={<LogoutIcon />}
              onClick={() => setOpenLogoutDialog(true)}
            >
              Cerrar Sesión
            </Button>

            <Typography variant="caption" color="textSecondary">
              Esto cerrará tu sesión en este dispositivo.
            </Typography>
          </Box>
        </Paper>

        {/* About */}
        <Paper sx={{ p: 3, bgcolor: '#f5f5f5' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
            Acerca de Sisio
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Versión 1.0.0
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Una plataforma para documentar y proteger la biodiversidad local con el saber
            ancestral de comunidades indígenas.
          </Typography>
        </Paper>
      </Box>

      {/* Logout Dialog */}
      <Dialog open={openLogoutDialog} onClose={() => setOpenLogoutDialog(false)}>
        <DialogTitle>Cerrar Sesión</DialogTitle>
        <DialogContent>
          <Typography>¿Estás seguro de que deseas cerrar sesión?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenLogoutDialog(false)}>Cancelar</Button>
          <Button onClick={handleLogout} color="error" variant="contained">
            Cerrar Sesión
          </Button>
        </DialogActions>
      </Dialog>

      {/* Clear Data Dialog */}
      <Dialog open={openClearDataDialog} onClose={() => setOpenClearDataDialog(false)}>
        <DialogTitle>Eliminar Datos Locales</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>
            ¿Estás seguro de que deseas eliminar todos los datos almacenados localmente? Esta
            acción no se puede deshacer.
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Se borrarán: cachés, bases de datos locales, cookies y almacenamiento local.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenClearDataDialog(false)}>Cancelar</Button>
          <Button onClick={handleClearData} color="error" variant="contained">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
