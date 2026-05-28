import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, IconButton, Typography, Badge } from '@mui/material';
import { motion } from 'framer-motion';

const navItems = [
  { label: 'Inicio', path: '/', icon: '🏠' },
  { label: 'Aves', path: '/birds', icon: '🦅' },
  { label: 'Mapa', path: '/map', icon: '🗺️' },
  { label: 'Perfil', path: '/profile', icon: '👤' },
];

export const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1200,
        display: { xs: 'flex', sm: 'none' },
        alignItems: 'center',
        justifyContent: 'space-around',
        height: 64,
        pb: 'env(safe-area-inset-bottom, 0px)',
        background: 'rgba(13, 27, 15, 0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      {navItems.slice(0, 2).map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <motion.div
            key={item.path}
            whileTap={{ scale: 0.9 }}
            style={{ flex: 1, display: 'flex', justifyContent: 'center' }}
          >
            <IconButton
              onClick={() => navigate(item.path)}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 0.25,
                color: isActive ? '#D4A017' : '#8D6E63',
                borderRadius: 3,
                px: 2,
                py: 0.5,
                transition: 'color 0.2s',
              }}
            >
              <Typography sx={{ fontSize: 22, lineHeight: 1 }}>{item.icon}</Typography>
              <Typography sx={{ fontSize: 10, fontWeight: isActive ? 700 : 500 }}>{item.label}</Typography>
            </IconButton>
          </motion.div>
        );
      })}

      {/* Central FAB for identification */}
      <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', mt: -3 }}>
        <motion.div whileTap={{ scale: 0.9 }}>
          <IconButton
            onClick={() => navigate('/photo-upload')}
            sx={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #2D5016, #D4A017)',
              boxShadow: '0 4px 20px rgba(212, 160, 23, 0.4)',
              color: '#F0F7EE',
              fontSize: 26,
              animation: 'glowPulse 2s ease-in-out infinite',
              '&:hover': {
                background: 'linear-gradient(135deg, #4A7C2F, #F5C842)',
              },
            }}
          >
            📷
          </IconButton>
        </motion.div>
      </Box>

      {navItems.slice(2).map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <motion.div
            key={item.path}
            whileTap={{ scale: 0.9 }}
            style={{ flex: 1, display: 'flex', justifyContent: 'center' }}
          >
            <IconButton
              onClick={() => navigate(item.path)}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 0.25,
                color: isActive ? '#D4A017' : '#8D6E63',
                borderRadius: 3,
                px: 2,
                py: 0.5,
                transition: 'color 0.2s',
              }}
            >
              <Typography sx={{ fontSize: 22, lineHeight: 1 }}>{item.icon}</Typography>
              <Typography sx={{ fontSize: 10, fontWeight: isActive ? 700 : 500 }}>{item.label}</Typography>
            </IconButton>
          </motion.div>
        );
      })}
    </Box>
  );
};
