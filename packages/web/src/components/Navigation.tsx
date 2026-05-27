import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar, Toolbar, Typography, Button, Box, IconButton, Drawer,
  List, ListItem, ListItemIcon, ListItemText, Divider,
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

  return (
    <>
      <AppBar position="sticky" sx={{ background: 'rgba(13,27,15,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <Toolbar>
          <Typography
            variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold', cursor: 'pointer', fontFamily: '"Playfair Display", serif', color: '#F0F7EE' }}
            onClick={() => navigate('/')}
          >
            Sisio
          </Typography>

          <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 0.5 }}>
            {menuItems.map((item) => (
              <Button key={item.path} onClick={() => navigate(item.path)}
                sx={{
                  color: location.pathname === item.path ? '#D4A017' : '#b0c4a0',
                  borderRadius: 20, px: 2,
                  background: location.pathname === item.path ? 'rgba(212,160,23,0.1)' : 'transparent',
                  '&:hover': { background: 'rgba(255,255,255,0.05)', color: '#F0F7EE' },
                }}
              >
                {item.label}
              </Button>
            ))}
            {user?.is_admin && (
              <Button onClick={() => navigate('/admin')}
                sx={{ color: location.pathname === '/admin' ? '#D4A017' : '#b0c4a0', borderRadius: 20 }}>
                Admin
              </Button>
            )}
            <IconButton onClick={() => navigate('/settings')} sx={{ color: '#b0c4a0', ml: 1 }}>
              <SettingsIcon />
            </IconButton>
          </Box>

          <IconButton color="inherit" onClick={() => setMobileOpen(true)} sx={{ display: { xs: 'flex', sm: 'none' }, color: '#F0F7EE' }}>
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer anchor="right" open={mobileOpen} onClose={() => setMobileOpen(false)}
        PaperProps={{ sx: { background: '#0D1B0F', color: '#F0F7EE', width: 250 } }}>
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ fontFamily: '"Playfair Display", serif', color: '#D4A017', mb: 2 }}>
            Menú
          </Typography>
          <Divider sx={{ mb: 2, borderColor: 'rgba(255,255,255,0.08)' }} />
          <List>
            {menuItems.map((item) => (
              <ListItem key={item.path} onClick={() => { navigate(item.path); setMobileOpen(false); }}
                sx={{ borderRadius: 12, mb: 0.5, cursor: 'pointer', '&:hover': { background: 'rgba(255,255,255,0.05)' } }}>
                <ListItemIcon sx={{ color: location.pathname === item.path ? '#D4A017' : '#b0c4a0', minWidth: 40 }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} sx={{ '& .MuiTypography-root': { color: location.pathname === item.path ? '#D4A017' : '#F0F7EE' } }} />
              </ListItem>
            ))}
            {user?.is_admin && (
              <ListItem onClick={() => { navigate('/admin'); setMobileOpen(false); }}
                sx={{ borderRadius: 12, mb: 0.5, cursor: 'pointer', '&:hover': { background: 'rgba(255,255,255,0.05)' } }}>
                <ListItemIcon sx={{ color: '#b0c4a0', minWidth: 40 }}><AdminPanelSettingsIcon /></ListItemIcon>
                <ListItemText primary="Admin" />
              </ListItem>
            )}
            <ListItem onClick={() => { navigate('/settings'); setMobileOpen(false); }}
              sx={{ borderRadius: 12, mb: 0.5, cursor: 'pointer', '&:hover': { background: 'rgba(255,255,255,0.05)' } }}>
              <ListItemIcon sx={{ color: '#b0c4a0', minWidth: 40 }}><SettingsIcon /></ListItemIcon>
              <ListItemText primary="Configuración" />
            </ListItem>
            <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.08)' }} />
            <ListItem onClick={handleLogout} sx={{ borderRadius: 12, cursor: 'pointer', '&:hover': { background: 'rgba(255,255,255,0.05)' } }}>
              <ListItemIcon sx={{ color: '#b0c4a0', minWidth: 40 }}><LogoutIcon /></ListItemIcon>
              <ListItemText primary="Cerrar Sesión" />
            </ListItem>
          </List>
          {user && (
            <Box sx={{ mt: 3, p: 2, borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#F0F7EE' }}>{user.name || 'Usuario'}</Typography>
              <Typography variant="caption" sx={{ color: '#b0c4a0' }}>{user.email}</Typography>
            </Box>
          )}
        </Box>
      </Drawer>
    </>
  );
};
