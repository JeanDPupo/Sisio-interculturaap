import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  Link,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import { useAuth } from '@sisio/shared';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [localError, setLocalError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setLocalError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setLocalError('Por favor completa todos los campos');
      return;
    }

    try {
      await login({
        email: formData.email,
        password: formData.password,
      });
      navigate('/');
    } catch (err) {
      setLocalError(error || 'Error en el login');
    }
  };

  const handleGuestLogin = async () => {
    try {
      navigate('/');
    } catch (err) {
      setLocalError('Error iniciando sesión como invitado');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2 }}>
          🦅 Sisio
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Documentar y proteger la biodiversidad local
        </Typography>
      </Box>

      <Paper sx={{ p: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
            Iniciar Sesión
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Accede a tu cuenta Sisio
          </Typography>
        </Box>

        {(error || localError) && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error || localError}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            margin="normal"
            disabled={loading}
            required
          />

          <TextField
            fullWidth
            label="Contraseña"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            margin="normal"
            disabled={loading}
            required
          />

          <Button
            fullWidth
            type="submit"
            variant="contained"
            size="large"
            startIcon={loading ? <CircularProgress size={20} /> : <LoginIcon />}
            disabled={loading}
            sx={{ mt: 3, mb: 2 }}
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </Button>
        </form>

        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Typography variant="body2" color="textSecondary">
            ¿No tienes cuenta?{' '}
            <Link
              onClick={() => navigate('/onboarding')}
              sx={{ cursor: 'pointer', fontWeight: 600 }}
            >
              Regístrate aquí
            </Link>
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Button
          fullWidth
          variant="outlined"
          onClick={handleGuestLogin}
          disabled={loading}
          sx={{ mt: 2 }}
        >
          Continuar como Invitado
        </Button>

        <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 2, textAlign: 'center' }}>
          Al continuar, aceptas nuestros{' '}
          <Link sx={{ cursor: 'pointer' }}>Términos de Servicio</Link> y{' '}
          <Link sx={{ cursor: 'pointer' }}>Política de Privacidad</Link>
        </Typography>
      </Paper>

      <Paper sx={{ mt: 4, p: 3, bgcolor: '#f0f7ff', borderLeft: '4px solid #2196F3' }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
          💡 Consejo
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Crea una cuenta para guardar tus avistamientos y contribuir a la comunidad de
          conservación de aves en tu territorio.
        </Typography>
      </Paper>
    </Container>
  );
};
