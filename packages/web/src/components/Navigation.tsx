import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Menu,
  MenuItem,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import ListIcon from '@mui/icons-material/List';
import MapIcon from '@mui/icons-material/Map';
import PetsIcon from '@mui/icons-material/Pets';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '@sisio/shared';

export const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
    handleMenuClose();
  };

  const menuItems = [
    { label: 'Inicio', path: '/', icon: <HomeIcon /> },
    { label: 'Aves', path: '/birds', icon: <PetsIcon /> },
    { label: 'Avistamientos', path: '/sightings', icon: <ListIcon /> },
    { label: 'Mapa', path: '/map', icon: <MapIcon /> },
    { label: 'Perfil', path: '/profile', icon: <PersonIcon /> },
  ];

  const adminMenuItems = user?.is_admin ? [
    { label: 'Admin', path: '/admin', icon: <AdminPanelSettingsIcon /> },
  ] : [];

  return (
    <>
      <AppBar position="sticky">
        <Toolbar>
          <Typography
            variant="h6"
            sx={{ flexGrow: 1, fontWeight: 'bold', cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
            🦅 Sisio
          </Typography>

          {/* Desktop Menu */}
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 1 }}>
            {menuItems.map((item) => (
              <Button
                key={item.path}
                color="inherit"
                onClick={() => navigate(item.path)}
                sx={{
                  backgroundColor:
                    location.pathname === item.path ? 'rgba(255,255,255,0.2)' : 'transparent',
                  borderRadius: '4px',
                }}
              >
                {item.label}
              </Button>
            ))}

            {user?.is_admin && (
              <Button
                color="inherit"
                onClick={() => navigate('/admin')}
                sx={{
                  backgroundColor: location.pathname === '/admin' ? 'rgba(255,255,255,0.2)' : 'transparent',
                  borderRadius: '4px',
                }}
              >
                Admin
              </Button>
            )}

            <Button
              color="inherit"
              onClick={() => navigate('/settings')}
              startIcon={<SettingsIcon />}
              sx={{
                backgroundColor: location.pathname === '/settings' ? 'rgba(255,255,255,0.2)' : 'transparent',
                borderRadius: '4px',
              }}
            >
              Config
            </Button>
          </Box>

          {/* Mobile Menu Button */}
          <IconButton
            color="inherit"
            onClick={() => setMobileOpen(true)}
            sx={{ display: { xs: 'flex', sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer anchor="right" open={mobileOpen} onClose={() => setMobileOpen(false)}>
        <Box sx={{ width: 250, p: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
            Menú
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <List>
            {menuItems.map((item) => (
              <ListItem
                key={item.path}
                button
                onClick={() => {
                  navigate(item.path);
                  setMobileOpen(false);
                }}
                selected={location.pathname === item.path}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItem>
            ))}

            {user?.is_admin && (
              <ListItem
                button
                onClick={() => {
                  navigate('/admin');
                  setMobileOpen(false);
                }}
                selected={location.pathname === '/admin'}
              >
                <ListItemIcon>
                  <AdminPanelSettingsIcon />
                </ListItemIcon>
                <ListItemText primary="Admin" />
              </ListItem>
            )}

            <ListItem
              button
              onClick={() => {
                navigate('/settings');
                setMobileOpen(false);
              }}
              selected={location.pathname === '/settings'}
            >
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Configuración" />
            </ListItem>

            <Divider sx={{ my: 2 }} />

            {user && (
              <ListItem button onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="Cerrar Sesión" />
              </ListItem>
            )}
          </List>

          {user && (
            <Box sx={{ mt: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                {user.name || 'Usuario'}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {user.email}
              </Typography>
            </Box>
          )}
        </Box>
      </Drawer>
    </>
  );
};
