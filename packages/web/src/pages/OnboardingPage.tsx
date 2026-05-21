import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  CircularProgress,
  Alert,
  Grid,
} from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import MicIcon from '@mui/icons-material/Mic';
import MapIcon from '@mui/icons-material/Map';
import GroupIcon from '@mui/icons-material/Group';
import { useAuth } from '@sisio/shared';

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { createGuestUser, loading, error } = useAuth();
  const [step, setStep] = useState(0);
  const [guestName, setGuestName] = useState('');
  const [localError, setLocalError] = useState('');

  const features = [
    {
      icon: <PhotoCameraIcon sx={{ fontSize: 48, color: '#2196F3' }} />,
      title: 'Fotografía',
      description: 'Identifica aves con fotos usando IA',
    },
    {
      icon: <MicIcon sx={{ fontSize: 48, color: '#4CAF50' }} />,
      title: 'Audio',
      description: 'Reconoce aves por su canto',
    },
    {
      icon: <MapIcon sx={{ fontSize: 48, color: '#FF9800' }} />,
      title: 'Mapa Interactivo',
      description: 'Visualiza avistamientos en tu territorio',
    },
    {
      icon: <GroupIcon sx={{ fontSize: 48, color: '#E91E63' }} />,
      title: 'Comunidad',
      description: 'Conecta con conservacionistas locales',
    },
  ];

  const handleGuestContinue = async () => {
    if (!guestName.trim()) {
      setLocalError('Por favor ingresa un nombre');
      return;
    }

    try {
      setLocalError('');
      await createGuestUser(guestName);
      navigate('/');
    } catch (err) {
      setLocalError(error || 'Error iniciando sesión como invitado');
    }
  };

  if (step === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        {/* Welcome Banner */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
            🦅 Bienvenido a Sisio
          </Typography>
          <Typography variant="h6" color="textSecondary" sx={{ mb: 4 }}>
            Documentar y proteger la biodiversidad local con el saber ancestral de comunidades
            indígenas
          </Typography>
        </Box>

        {/* Features Grid */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ textAlign: 'center', h: '100%' }}>
                <CardContent>
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* CTA Buttons */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/login')}
            sx={{ px: 4 }}
          >
            Tengo una Cuenta
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => setStep(1)}
            sx={{ px: 4 }}
          >
            Registrarse
          </Button>
          <Button
            variant="text"
            size="large"
            onClick={() => setStep(2)}
            sx={{ px: 4 }}
          >
            Continuar como Invitado
          </Button>
        </Box>

        {/* Benefits Section */}
        <Paper sx={{ mt: 6, p: 4, bgcolor: '#f0f7ff', borderLeft: '4px solid #2196F3' }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                ¿Por qué registrarse?
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                ✓ Guarda todos tus avistamientos
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                ✓ Crea perfil personal y estadísticas
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                ✓ Interactúa con la comunidad
              </Typography>
              <Typography variant="body2" color="textSecondary">
                ✓ Contribuye a la conservación
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Modo Invitado
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                • Identifica aves sin registro
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                • Acceso a mapa y comunidad
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                • Datos guardados localmente
              </Typography>
              <Typography variant="body2" color="textSecondary">
                • Actualiza a cuenta registrada en cualquier momento
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    );
  }

  if (step === 1) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
            Crear Cuenta
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Únete a la comunidad Sisio
          </Typography>
        </Box>

        <Paper sx={{ p: 4 }}>
          <Typography variant="body2" sx={{ mb: 3, textAlign: 'center', color: '#666' }}>
            La funcionalidad de registro está disponible al iniciar sesión en la aplicación móvil
            o visitando nuestro sitio web completo.
          </Typography>

          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={() => navigate('/login')}
            sx={{ mb: 2 }}
          >
            Ir a Inicio de Sesión
          </Button>

          <Button
            fullWidth
            variant="outlined"
            onClick={() => setStep(0)}
          >
            Volver Atrás
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
          Continuar como Invitado
        </Typography>
        <Typography variant="body1" color="textSecondary">
          ¿Cuál es tu nombre?
        </Typography>
      </Box>

      <Paper sx={{ p: 4 }}>
        {localError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {localError}
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TextField
          fullWidth
          label="Tu Nombre"
          value={guestName}
          onChange={(e) => setGuestName(e.target.value)}
          margin="normal"
          disabled={loading}
          placeholder="Ej: Juan"
          autoFocus
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleGuestContinue();
            }
          }}
        />

        <Button
          fullWidth
          variant="contained"
          size="large"
          onClick={handleGuestContinue}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : undefined}
          sx={{ mt: 3, mb: 2 }}
        >
          {loading ? 'Iniciando...' : 'Continuar'}
        </Button>

        <Button
          fullWidth
          variant="outlined"
          onClick={() => setStep(0)}
          disabled={loading}
        >
          Volver Atrás
        </Button>

        <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 3, textAlign: 'center' }}>
          Tus datos se guardarán localmente y podrás actualizar a una cuenta registrada en
          cualquier momento.
        </Typography>
      </Paper>
    </Container>
  );
};
