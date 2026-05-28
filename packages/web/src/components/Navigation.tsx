import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar, Toolbar, Typography, Button, Box, IconButton, Drawer,
  List, ListItem, ListItemIcon, ListItemText, Divider, Avatar, Chip,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import PetsIcon from '@mui/icons-material/Pets';
import ListIcon from '@mui/icons-material/List';
import MapIcon from '@mui/icons-material/Map';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LogoutIcon from '@mui/icons-material/Logout';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import MicIcon from '@mui/icons-material/Mic';
import { useAuth } from '@sisio/shared';

export const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const menuItems = [
    { label: 'Inicio', path: '/', icon: <HomeIcon /> },
    { label: 'Aves', path: '/birds', icon: <PetsIcon /> },
    { label: 'Avistamientos', path: '/sightings', icon: <ListIcon /> },
    { label: 'Mapa', path: '/map', icon: <MapIcon /> },
    { label: 'Perfil', path: '/profile', icon: <PersonIcon /> },
  ];

  const identifyItems = [
    { label: 'Foto', path: '/photo-upload', icon: <CameraAltIcon /> },
    { label: 'Canto', path: '/audio-upload', icon: <MicIcon /> },
  ];

  return (
    <>
      {/* Top AppBar - hidden on mobile (BottomNav used instead) */}
      <AppBar
        position="sticky"
        sx={{
          background: 'rgba(13,27,15,0.92)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          display: { xs: 'none', sm: 'block' },
        }}
      >
        <Toolbar>
          {/* Logo */}
          <Box
            sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer', mr: 2 }}
            onClick={() => navigate('/')}
          >
            <Typography sx={{ fontSize: 24 }}>🦅</Typography>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 'bold',
                fontFamily: '"Playfair Display", serif',
                color: '#F0F7EE',
              }}
            >
              Sisio
            </Typography>
          </Box>

          {/* Desktop navigation */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 0.5, flex: 1 }}>
            {menuItems.map((item) => (
              <Button
                key={item.path}
                onClick={() => navigate(item.path)}
                startIcon={item.icon}
                sx={{
                  color: location.pathname === item.path ? '#D4A017' : '#b0c4a0',
                  borderRadius: 20,
                  px: 2,
                  fontSize: '0.85rem',
                  background: location.pathname === item.path ? 'rgba(212,160,23,0.1)' : 'transparent',
                  '&:hover': { background: 'rgba(255,255,255,0.05)', color: '#F0F7EE' },
                }}
              >
                {item.label}
              </Button>
            ))}
            {user?.is_admin && (
              <Button
                onClick={() => navigate('/admin')}
                startIcon={<AdminPanelSettingsIcon />}
                sx={{
                  color: location.pathname === '/admin' ? '#D4A017' : '#b0c4a0',
                  borderRadius: 20,
                  fontSize: '0.85rem',
                }}
              >
                Admin
              </Button>
            )}
          </Box>

          {/* Tablet nav: icons only */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, gap: 0.25, flex: 1, justifyContent: 'center' }}>
            {menuItems.map((item) => (
              <IconButton
                key={item.path}
                onClick={() => navigate(item.path)}
                sx={{
                  color: location.pathname === item.path ? '#D4A017' : '#8D6E63',
                  borderRadius: 2,
                  px: 1.5,
                }}
              >
                {item.icon}
              </IconButton>
            ))}
            {identifyItems.map((item) => (
              <IconButton
                key={item.path}
                onClick={() => navigate(item.path)}
                sx={{
                  color: location.pathname === item.path ? '#D4A017' : '#8D6E63',
                  borderRadius: 2,
                  px: 1.5,
                }}
              >
                {item.icon}
              </IconButton>
            ))}
            {user?.is_admin && (
              <IconButton
                onClick={() => navigate('/admin')}
                sx={{ color: location.pathname === '/admin' ? '#D4A017' : '#8D6E63', borderRadius: 2, px: 1.5 }}
              >
                <AdminPanelSettingsIcon />
              </IconButton>
            )}
          </Box>

          {/* Right side: settings + hamburger */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <IconButton onClick={() => navigate('/settings')} sx={{ color: '#b0c4a0' }}>
              <SettingsIcon />
            </IconButton>
            <IconButton
              color="inherit"
              onClick={() => setMobileOpen(true)}
              sx={{ display: { md: 'none' }, color: '#F0F7EE' }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile/Tablet Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        PaperProps={{
          sx: {
            background: 'rgba(13,27,15,0.98)',
            backdropFilter: 'blur(20px)',
            color: '#F0F7EE',
            width: 280,
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          {/* User info */}
          {user && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, p: 2, borderRadius: 3, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <Avatar sx={{ bgcolor: '#2D5016', color: '#D4A017', fontWeight: 700 }}>
                {user.name?.charAt(0).toUpperCase() || 'U'}
              </Avatar>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#F0F7EE' }}>
                  {user.name || 'Explorador'}
                </Typography>
                <Typography variant="caption" sx={{ color: '#b0c4a0' }}>
                  {user.email || (user.is_guest ? 'Modo invitado' : '')}
                </Typography>
              </Box>
            </Box>
          )}

          <Typography
            variant="h6"
            sx={{ fontFamily: '"Playfair Display", serif', color: '#D4A017', mb: 1, px: 1 }}
          >
            Navegación
          </Typography>
          <Divider sx={{ mb: 1, borderColor: 'rgba(255,255,255,0.08)' }} />

          <List>
            {menuItems.map((item) => (
              <ListItem
                key={item.path}
                onClick={() => { navigate(item.path); setMobileOpen(false); }}
                sx={{
                  borderRadius: 3,
                  mb: 0.5,
                  cursor: 'pointer',
                  background: location.pathname === item.path ? 'rgba(212,160,23,0.1)' : 'transparent',
                  borderLeft: location.pathname === item.path ? '3px solid #D4A017' : '3px solid transparent',
                  '&:hover': { background: 'rgba(255,255,255,0.05)' },
                }}
              >
                <ListItemIcon sx={{ color: location.pathname === item.path ? '#D4A017' : '#8D6E63', minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  sx={{ '& .MuiTypography-root': { color: location.pathname === item.path ? '#D4A017' : '#F0F7EE', fontWeight: location.pathname === item.path ? 600 : 400 } }}
                />
              </ListItem>
            ))}
          </List>

          <Divider sx={{ my: 1, borderColor: 'rgba(255,255,255,0.08)' }} />

          <Typography variant="caption" sx={{ color: '#8D6E63', px: 2, display: 'block', mb: 1 }}>
            IDENTIFICAR
          </Typography>
          <List>
            {identifyItems.map((item) => (
              <ListItem
                key={item.path}
                onClick={() => { navigate(item.path); setMobileOpen(false); }}
                sx={{
                  borderRadius: 3,
                  mb: 0.5,
                  cursor: 'pointer',
                  '&:hover': { background: 'rgba(255,255,255,0.05)' },
                }}
              >
                <ListItemIcon sx={{ color: '#D4A017', minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItem>
            ))}
          </List>

          {user?.is_admin && (
            <>
              <Divider sx={{ my: 1, borderColor: 'rgba(255,255,255,0.08)' }} />
              <List>
                <ListItem
                  onClick={() => { navigate('/admin'); setMobileOpen(false); }}
                  sx={{ borderRadius: 3, mb: 0.5, cursor: 'pointer', '&:hover': { background: 'rgba(255,255,255,0.05)' } }}
                >
                  <ListItemIcon sx={{ color: '#8D6E63', minWidth: 40 }}><AdminPanelSettingsIcon /></ListItemIcon>
                  <ListItemText primary="Admin" />
                </ListItem>
              </List>
            </>
          )}

          <Divider sx={{ my: 1, borderColor: 'rgba(255,255,255,0.08)' }} />

          <List>
            <ListItem
              onClick={() => { navigate('/settings'); setMobileOpen(false); }}
              sx={{ borderRadius: 3, mb: 0.5, cursor: 'pointer', '&:hover': { background: 'rgba(255,255,255,0.05)' } }}
            >
              <ListItemIcon sx={{ color: '#8D6E63', minWidth: 40 }}><SettingsIcon /></ListItemIcon>
              <ListItemText primary="Configuración" />
            </ListItem>
            <ListItem
              onClick={handleLogout}
              sx={{ borderRadius: 3, cursor: 'pointer', '&:hover': { background: 'rgba(244,67,54,0.08)' } }}
            >
              <ListItemIcon sx={{ color: '#F44336', minWidth: 40 }}><LogoutIcon /></ListItemIcon>
              <ListItemText primary="Cerrar Sesión" sx={{ '& .MuiTypography-root': { color: '#F44336' } }} />
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </>
  );
};
