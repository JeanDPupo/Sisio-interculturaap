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
  IconButton,
  InputAdornment,
} from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import MicIcon from '@mui/icons-material/Mic';
import MapIcon from '@mui/icons-material/Map';
import GroupIcon from '@mui/icons-material/Group';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useAuth, VALIDATION } from '@sisio/shared';

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { createGuestUser, register, loading, error } = useAuth();
  const [step, setStep] = useState(0);
  const [guestName, setGuestName] = useState('');
  const [localError, setLocalError] = useState('');
  const [registerData, setRegisterData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);

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

  const handleRegister = async () => {
    if (!registerData.name.trim() || !registerData.email.trim() || !registerData.password.trim()) {
      setLocalError('Por favor completa todos los campos');
      return;
    }
    if (registerData.password !== registerData.confirmPassword) {
      setLocalError('Las contraseñas no coinciden');
      return;
    }
    if (registerData.password.length < VALIDATION.PASSWORD_MIN_LENGTH) {
      setLocalError('La contraseña debe tener al menos ' + VALIDATION.PASSWORD_MIN_LENGTH + ' caracteres');
      return;
    }
    try {
      setLocalError('');
      await register({
        name: registerData.name.trim(),
        email: registerData.email.trim(),
        password: registerData.password,
      });
      navigate('/');
    } catch (err) {
      // error is set by useAuth hook
    }
  };

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
          {(error || localError) && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error || localError}
            </Alert>
          )}

          <TextField
            fullWidth
            label="Nombre"
            value={registerData.name}
            onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
            margin="normal"
            disabled={loading}
            autoFocus
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={registerData.email}
            onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
            margin="normal"
            disabled={loading}
          />
          <TextField
            fullWidth
            label="Contraseña"
            type={showPassword ? 'text' : 'password'}
            value={registerData.password}
            onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
            margin="normal"
            disabled={loading}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            label="Confirmar Contraseña"
            type="password"
            value={registerData.confirmPassword}
            onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
            margin="normal"
            disabled={loading}
          />

          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={handleRegister}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : undefined}
            sx={{ mt: 3, mb: 2 }}
          >
            {loading ? 'Registrando...' : 'Crear Cuenta'}
          </Button>

          <Button
            fullWidth
            variant="outlined"
            onClick={() => setStep(0)}
            disabled={loading}
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
