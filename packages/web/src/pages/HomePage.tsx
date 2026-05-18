import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Button, Paper, Grid } from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import MicIcon from '@mui/icons-material/Mic';
import MapIcon from '@mui/icons-material/Map';
import ListIcon from '@mui/icons-material/List';
import { useAuth, useOffline } from '@sisio/shared';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isGuest } = useAuth();
  const { isOnline } = useOffline();

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {!isOnline && (
        <Paper sx={{ p: 2, mb: 3, bgcolor: '#f44336', color: 'white' }}>
          <Typography>📴 Sin conexión - Tu contenido se guardará localmente</Typography>
        </Paper>
      )}

      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold' }}>
          ¡Hola {user?.name || 'Visitante'}! 👋
        </Typography>
        <Typography variant="body1" color="textSecondary">
          {isGuest
            ? 'Inicia sesión para guardar tus avistamientos'
            : 'Bienvenido de vuelta'}
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6}>
          <Paper
            sx={{
              p: 3,
              textAlign: 'center',
              cursor: 'pointer',
              '&:hover': { boxShadow: 4, transform: 'translateY(-4px)' },
              transition: 'all 0.3s',
            }}
            onClick={() => navigate('/photo-upload')}
          >
            <PhotoCameraIcon sx={{ fontSize: 48, color: '#2196F3', mb: 2 }} />
            <Typography variant="h6" sx={{ mb: 1 }}>
              Fotografía
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Identifica un ave con una foto
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Paper
            sx={{
              p: 3,
              textAlign: 'center',
              cursor: 'pointer',
              '&:hover': { boxShadow: 4, transform: 'translateY(-4px)' },
              transition: 'all 0.3s',
            }}
            onClick={() => navigate('/audio-upload')}
          >
            <MicIcon sx={{ fontSize: 48, color: '#2196F3', mb: 2 }} />
            <Typography variant="h6" sx={{ mb: 1 }}>
              Sonido
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Identifica por el canto del ave
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Paper
            sx={{
              p: 2,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              '&:hover': { bgcolor: '#f5f5f5' },
            }}
            onClick={() => navigate('/sightings')}
          >
            <ListIcon sx={{ color: '#2196F3' }} />
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                Mis Avistamientos
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Ver tus observaciones
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Paper
            sx={{
              p: 2,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              '&:hover': { bgcolor: '#f5f5f5' },
            }}
            onClick={() => navigate('/map')}
          >
            <MapIcon sx={{ color: '#2196F3' }} />
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                Mapa
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Ubicación de avistamientos
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Paper
        sx={{
          mt: 4,
          p: 3,
          bgcolor: '#fff3e0',
          borderLeft: '4px solid #ff9800',
        }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
          💡 Consejo
        </Typography>
        <Typography variant="body2" color="textSecondary">
          El conocimiento ancestral de las comunidades indígenas es prioritario. Aprende las
          historias y significados de cada ave en tu territorio.
        </Typography>
      </Paper>
    </Container>
  );
};
