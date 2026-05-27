import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Button, Paper, Grid, Chip } from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import MicIcon from '@mui/icons-material/Mic';
import PetsIcon from '@mui/icons-material/Pets';
import MapIcon from '@mui/icons-material/Map';
import ListIcon from '@mui/icons-material/List';
import { useAuth, useOffline } from '@sisio/shared';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isGuest } = useAuth();
  const { isOnline } = useOffline();

  const heroBg = {
    background: 'linear-gradient(135deg, #0D1B0F 0%, #1A3A4A 50%, #2D5016 100%)',
    position: 'relative' as const,
    overflow: 'hidden',
  };

  return (
    <Box sx={{ ...heroBg, minHeight: 'calc(100vh - 64px)' }}>
      {!isOnline && (
        <Paper sx={{ p: 2, bgcolor: 'rgba(244,67,54,0.9)', color: 'white', borderRadius: 0, textAlign: 'center' }}>
          <Typography variant="body2">📴 Sin conexión — Tus identificaciones se guardarán y procesarán después</Typography>
        </Paper>
      )}

      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 5, mt: 2 }}>
          <Typography
            variant="h3"
            sx={{
              fontFamily: '"Playfair Display", serif',
              fontWeight: 700,
              color: '#F0F7EE',
              mb: 1,
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
            }}
          >
            Sisio
          </Typography>
          <Typography variant="body1" sx={{ color: '#b0c4a0', mb: 3 }}>
            {isGuest
              ? 'Explora la sabiduría ancestral de la Sierra Nevada'
              : `Bienvenido de vuelta, ${user?.name || 'explorador'}`}
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<PhotoCameraIcon />}
              onClick={() => navigate('/photo-upload')}
              sx={{
                py: 2,
                px: 4,
                background: 'linear-gradient(135deg, #2D5016, #D4A017)',
                borderRadius: 20,
                fontSize: '1rem',
                minWidth: 200,
                '&:hover': {
                  background: 'linear-gradient(135deg, #4A7C2F, #F5C842)',
                },
              }}
            >
              Identificar por Foto
            </Button>
            <Button
              variant="contained"
              size="large"
              startIcon={<MicIcon />}
              onClick={() => navigate('/audio-upload')}
              sx={{
                py: 2,
                px: 4,
                background: 'linear-gradient(135deg, #D4A017, #FF8F00)',
                borderRadius: 20,
                fontSize: '1rem',
                minWidth: 200,
                '&:hover': {
                  background: 'linear-gradient(135deg, #F5C842, #FF8F00)',
                },
              }}
            >
              Identificar por Canto
            </Button>
          </Box>
        </Box>

        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={6} sm={3}>
            <Paper
              sx={{
                p: 2,
                textAlign: 'center',
                cursor: 'pointer',
                backdropFilter: 'blur(20px)',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 20,
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' },
              }}
              onClick={() => navigate('/birds')}
            >
              <PetsIcon sx={{ fontSize: 32, color: '#8BC34A', mb: 1 }} />
              <Typography variant="body2" sx={{ color: '#F0F7EE', fontWeight: 600 }}>Aves</Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Paper
              sx={{
                p: 2,
                textAlign: 'center',
                cursor: 'pointer',
                backdropFilter: 'blur(20px)',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 20,
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' },
              }}
              onClick={() => navigate('/sightings')}
            >
              <ListIcon sx={{ fontSize: 32, color: '#64B5F6', mb: 1 }} />
              <Typography variant="body2" sx={{ color: '#F0F7EE', fontWeight: 600 }}>Avistamientos</Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Paper
              sx={{
                p: 2,
                textAlign: 'center',
                cursor: 'pointer',
                backdropFilter: 'blur(20px)',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 20,
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' },
              }}
              onClick={() => navigate('/map')}
            >
              <MapIcon sx={{ fontSize: 32, color: '#4CAF50', mb: 1 }} />
              <Typography variant="body2" sx={{ color: '#F0F7EE', fontWeight: 600 }}>Mapa</Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Paper
              sx={{
                p: 2,
                textAlign: 'center',
                cursor: 'pointer',
                backdropFilter: 'blur(20px)',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 20,
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' },
              }}
              onClick={() => navigate('/profile')}
            >
              <PetsIcon sx={{ fontSize: 32, color: '#D4A017', mb: 1 }} />
              <Typography variant="body2" sx={{ color: '#F0F7EE', fontWeight: 600 }}>Perfil</Typography>
            </Paper>
          </Grid>
        </Grid>

        <Paper
          sx={{
            p: 3,
            backdropFilter: 'blur(20px)',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 20,
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{ fontFamily: '"Playfair Display", serif', color: '#D4A017', mb: 2, fontWeight: 600 }}
          >
            Conocimiento Ancestral
          </Typography>
          <Typography variant="body2" sx={{ color: '#b0c4a0', lineHeight: 1.7 }}>
            Cada ave en la Sierra Nevada de Santa Marta guarda historias y significados transmitidos
            por generaciones por los pueblos Arhuaco, Kogui, Wiwa y Kankuamo.
            Identifica, aprende y preserva esta sabiduría.
          </Typography>
          <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip label="Arhuaco" size="small" sx={{ color: '#F0F7EE', borderColor: '#8BC34A' }} variant="outlined" />
            <Chip label="Kogui" size="small" sx={{ color: '#F0F7EE', borderColor: '#D4A017' }} variant="outlined" />
            <Chip label="Wiwa" size="small" sx={{ color: '#F0F7EE', borderColor: '#64B5F6' }} variant="outlined" />
            <Chip label="Kankuamo" size="small" sx={{ color: '#F0F7EE', borderColor: '#4CAF50' }} variant="outlined" />
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};
