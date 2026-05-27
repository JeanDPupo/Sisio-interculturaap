import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Button, TextField, CircularProgress, Alert,
  IconButton, InputAdornment, MobileStepper,
} from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import MicIcon from '@mui/icons-material/Mic';
import MapIcon from '@mui/icons-material/Map';
import GroupIcon from '@mui/icons-material/Group';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import { useAuth, VALIDATION } from '@sisio/shared';

const slides = [
  {
    title: 'Sisio',
    subtitle: 'Conecta con la sabiduría ancestral\nde las aves de la Sierra Nevada',
    gradient: 'linear-gradient(135deg, #0D1B0F 0%, #1A3A4A 50%, #2D5016 100%)',
  },
  {
    title: 'Identifica y Aprende',
    subtitle: 'Toma una foto o graba su canto.\nDéjale a la IA identificar el ave\ny descubre su significado ancestral.',
    gradient: 'linear-gradient(135deg, #1A3A4A 0%, #2D5016 50%, #4A7C2F 100%)',
  },
  {
    title: 'Preserva la Cultura',
    subtitle: 'Cada ave guarda historias de los pueblos\nArhuaco, Kogui, Wiwa y Kankuamo.\nAyúdanos a preservar este conocimiento.',
    gradient: 'linear-gradient(135deg, #2D5016 0%, #5D4037 50%, #D4A017 100%)',
  },
];

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { createGuestUser, register, loading, error } = useAuth();
  const [slide, setSlide] = useState(0);
  const [mode, setMode] = useState<'onboarding' | 'register' | 'guest'>('onboarding');
  const [guestName, setGuestName] = useState('');
  const [localError, setLocalError] = useState('');
  const [registerData, setRegisterData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);

  const handleNext = () => setSlide((s) => Math.min(s + 1, 2));
  const handleBack = () => setSlide((s) => Math.max(s - 1, 0));

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
    } catch {}
  };

  const handleGuestContinue = async () => {
    if (!guestName.trim()) {
      setLocalError('Por favor ingresa un nombre');
      return;
    }
    try {
      setLocalError('');
      await createGuestUser(guestName);
      navigate('/');
    } catch {
      setLocalError(error || 'Error iniciando sesión como invitado');
    }
  };

  if (mode === 'register') {
    return (
      <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0D1B0F 0%, #1A3A4A 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
        <Box sx={{ width: '100%', maxWidth: 440 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h4" sx={{ fontFamily: '"Playfair Display", serif', color: '#F0F7EE', fontWeight: 700, mb: 1 }}>
              Crear Cuenta
            </Typography>
            <Typography variant="body2" sx={{ color: '#b0c4a0' }}>
              Únete a la comunidad Sisio
            </Typography>
          </Box>

          <Box sx={{ p: 3, borderRadius: 4, backdropFilter: 'blur(20px)', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
            {(error || localError) && <Alert severity="error" sx={{ mb: 2 }}>{error || localError}</Alert>}

            <TextField fullWidth label="Nombre" value={registerData.name} onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
              margin="normal" disabled={loading} autoFocus
              sx={{ input: { color: '#F0F7EE' }, label: { color: '#b0c4a0' } }} />
            <TextField fullWidth label="Email" type="email" value={registerData.email}
              onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })} margin="normal" disabled={loading}
              sx={{ input: { color: '#F0F7EE' }, label: { color: '#b0c4a0' } }} />
            <TextField fullWidth label="Contraseña" type={showPassword ? 'text' : 'password'}
              value={registerData.password} onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
              margin="normal" disabled={loading}
              InputProps={{ endAdornment: <InputAdornment position="end"><IconButton onClick={() => setShowPassword(!showPassword)} edge="end" sx={{ color: '#b0c4a0' }}>{showPassword ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment> }}
              sx={{ input: { color: '#F0F7EE' }, label: { color: '#b0c4a0' } }} />
            <TextField fullWidth label="Confirmar Contraseña" type="password"
              value={registerData.confirmPassword} onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
              margin="normal" disabled={loading}
              sx={{ input: { color: '#F0F7EE' }, label: { color: '#b0c4a0' } }} />

            <Button fullWidth variant="contained" size="large" onClick={handleRegister} disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : undefined}
              sx={{ mt: 3, mb: 2, py: 1.5, background: 'linear-gradient(135deg, #2D5016, #D4A017)', borderRadius: 20 }}>
              {loading ? 'Registrando...' : 'Crear Cuenta'}
            </Button>
            <Button fullWidth variant="text" onClick={() => setMode('onboarding')} disabled={loading} sx={{ color: '#b0c4a0' }}>
              Volver Atrás
            </Button>
          </Box>
        </Box>
      </Box>
    );
  }

  if (mode === 'guest') {
    return (
      <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0D1B0F 0%, #1A3A4A 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
        <Box sx={{ width: '100%', maxWidth: 440 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h4" sx={{ fontFamily: '"Playfair Display", serif', color: '#F0F7EE', fontWeight: 700, mb: 1 }}>
              Modo Invitado
            </Typography>
            <Typography variant="body2" sx={{ color: '#b0c4a0' }}>
              ¿Cuál es tu nombre, explorador?
            </Typography>
          </Box>

          <Box sx={{ p: 3, borderRadius: 4, backdropFilter: 'blur(20px)', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
            {localError && <Alert severity="error" sx={{ mb: 2 }}>{localError}</Alert>}
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <TextField fullWidth label="Tu Nombre" value={guestName}
              onChange={(e) => setGuestName(e.target.value)} margin="normal" disabled={loading}
              placeholder="Ej: Juan" autoFocus
              onKeyDown={(e) => { if (e.key === 'Enter') handleGuestContinue(); }}
              sx={{ input: { color: '#F0F7EE' }, label: { color: '#b0c4a0' } }} />

            <Button fullWidth variant="contained" size="large" onClick={handleGuestContinue} disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : undefined}
              sx={{ mt: 3, mb: 2, py: 1.5, background: 'linear-gradient(135deg, #D4A017, #FF8F00)', borderRadius: 20 }}>
              {loading ? 'Iniciando...' : 'Comenzar Aventura'}
            </Button>
            <Button fullWidth variant="text" onClick={() => setMode('onboarding')} disabled={loading} sx={{ color: '#b0c4a0' }}>
              Volver Atrás
            </Button>

            <Typography variant="caption" sx={{ display: 'block', mt: 2, textAlign: 'center', color: '#b0c4a0' }}>
              Tus datos se guardarán localmente. Puedes crear una cuenta después.
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  }

  const currentSlide = slides[slide];
  return (
    <Box sx={{ minHeight: '100vh', background: currentSlide.gradient, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 4, textAlign: 'center' }}>
        <Typography variant="h2" sx={{ fontFamily: '"Playfair Display", serif', color: '#F0F7EE', fontWeight: 700, mb: 3, fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' }, textShadow: '0 2px 20px rgba(0,0,0,0.3)' }}>
          {currentSlide.title}
        </Typography>
        <Typography variant="h6" sx={{ color: '#b0c4a0', maxWidth: 500, lineHeight: 1.8, whiteSpace: 'pre-line', mb: 4, fontSize: { xs: '1rem', sm: '1.1rem' } }}>
          {currentSlide.subtitle}
        </Typography>

        {slide === 2 && (
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center', mb: 4 }}>
            <Button variant="contained" size="large" onClick={() => setMode('register')}
              sx={{ py: 1.5, px: 4, background: 'linear-gradient(135deg, #2D5016, #D4A017)', borderRadius: 20 }}>
              Entrar como Usuario
            </Button>
            <Button variant="outlined" size="large" onClick={() => setMode('guest')}
              sx={{ py: 1.5, px: 4, borderColor: '#D4A017', color: '#D4A017', borderRadius: 20, '&:hover': { borderColor: '#F5C842', background: 'rgba(212,160,23,0.1)' } }}>
              Explorar como Invitado
            </Button>
          </Box>
        )}

        {slide < 2 && (
          <Button variant="outlined" size="large" onClick={handleNext}
            sx={{ borderColor: '#F0F7EE', color: '#F0F7EE', borderRadius: 20, px: 4, '&:hover': { borderColor: '#D4A017', background: 'rgba(212,160,23,0.15)' } }}>
            Continuar
          </Button>
        )}
      </Box>

      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', pb: 4 }}>
        {[0, 1, 2].map((i) => (
          <Box key={i} onClick={() => setSlide(i)} sx={{
            width: i === slide ? 32 : 8, height: 8, borderRadius: 4,
            background: i === slide ? '#D4A017' : 'rgba(255,255,255,0.3)',
            cursor: 'pointer', transition: 'all 0.3s',
          }} />
        ))}
      </Box>
    </Box>
  );
};
