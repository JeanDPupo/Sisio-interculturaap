import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  TextField,
  CircularProgress,
  Alert,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import MicIcon from '@mui/icons-material/Mic';
import MapIcon from '@mui/icons-material/Map';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import { useAuth, VALIDATION } from '@sisio/shared';

const MotionDiv = motion.div;

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 600 : -600,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 600 : -600,
    opacity: 0,
  }),
};

const featureIcons = [
  {
    icon: <PhotoCameraIcon sx={{ fontSize: 48 }} />,
    label: 'Foto',
    desc: 'Toma una foto del ave',
    color: '#8BC34A',
  },
  {
    icon: <MicIcon sx={{ fontSize: 48 }} />,
    label: 'Canto',
    desc: 'Graba su canto melodioso',
    color: '#D4A017',
  },
  {
    icon: <MapIcon sx={{ fontSize: 48 }} />,
    label: 'Mapa',
    desc: 'Ubica avistamientos cercanos',
    color: '#64B5F6',
  },
];

const glassStyle = {
  backdropFilter: 'blur(20px)',
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 20,
};

const onboardingGradients = [
  'linear-gradient(180deg, #0D1B0F 0%, #1A3A4A 50%, #2D5016 100%)',
  'linear-gradient(180deg, #1A3A4A 0%, #2D5016 50%, #4A7C2F 100%)',
  'linear-gradient(180deg, #2D5016 0%, #1A3A4A 50%, #0D1B0F 100%)',
];

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { createGuestUser, register, loading, error } = useAuth();

  const [slide, setSlide] = useState(0);
  const [direction, setDirection] = useState(1);
  const [mode, setMode] = useState<'onboarding' | 'register' | 'guest'>('onboarding');
  const [guestName, setGuestName] = useState('');
  const [localError, setLocalError] = useState('');
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleNext = () => {
    if (slide < 2) {
      setDirection(1);
      setSlide((s) => s + 1);
    }
  };

  const handleBack = () => {
    if (slide > 0) {
      setDirection(-1);
      setSlide((s) => s - 1);
    }
  };

  const handleDotClick = (index: number) => {
    setDirection(index > slide ? 1 : -1);
    setSlide(index);
  };

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
      setLocalError(
        'La contraseña debe tener al menos ' + VALIDATION.PASSWORD_MIN_LENGTH + ' caracteres'
      );
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
    } catch {
      // error handled by useAuth
    }
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

  // REGISTER MODE
  if (mode === 'register') {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: onboardingGradients[0],
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 440 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography
              variant="h4"
              sx={{
                fontFamily: '"Playfair Display", serif',
                color: '#F0F7EE',
                fontWeight: 700,
                mb: 1,
              }}
            >
              Crear Cuenta
            </Typography>
            <Typography variant="body2" sx={{ color: '#b0c4a0' }}>
              Únete a la comunidad Sisio
            </Typography>
          </Box>

          <Box sx={{ ...glassStyle, p: { xs: 3, sm: 4 } }}>
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
              sx={{
                input: { color: '#F0F7EE' },
                label: { color: '#b0c4a0' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.15)' },
                  '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.25)' },
                  '&.Mui-focused fieldset': { borderColor: '#D4A017' },
                },
              }}
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={registerData.email}
              onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
              margin="normal"
              disabled={loading}
              sx={{
                input: { color: '#F0F7EE' },
                label: { color: '#b0c4a0' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.15)' },
                  '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.25)' },
                  '&.Mui-focused fieldset': { borderColor: '#D4A017' },
                },
              }}
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
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{ color: '#b0c4a0' }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                input: { color: '#F0F7EE' },
                label: { color: '#b0c4a0' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.15)' },
                  '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.25)' },
                  '&.Mui-focused fieldset': { borderColor: '#D4A017' },
                },
              }}
            />
            <TextField
              fullWidth
              label="Confirmar Contraseña"
              type="password"
              value={registerData.confirmPassword}
              onChange={(e) =>
                setRegisterData({ ...registerData, confirmPassword: e.target.value })
              }
              margin="normal"
              disabled={loading}
              sx={{
                input: { color: '#F0F7EE' },
                label: { color: '#b0c4a0' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.15)' },
                  '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.25)' },
                  '&.Mui-focused fieldset': { borderColor: '#D4A017' },
                },
              }}
            />

            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleRegister}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : undefined}
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
                background: 'linear-gradient(135deg, #2D5016, #D4A017)',
                borderRadius: 20,
                fontWeight: 700,
                fontSize: '1rem',
                textTransform: 'none',
                color: '#F0F7EE',
                '&:hover': {
                  background: 'linear-gradient(135deg, #4A7C2F, #F5C842)',
                },
              }}
            >
              {loading ? 'Registrando...' : 'Crear Cuenta'}
            </Button>
            <Button
              fullWidth
              variant="text"
              onClick={() => setMode('onboarding')}
              disabled={loading}
              sx={{ color: '#b0c4a0', textTransform: 'none' }}
            >
              Volver Atrás
            </Button>
          </Box>
        </Box>
      </Box>
    );
  }

  // GUEST MODE
  if (mode === 'guest') {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: onboardingGradients[0],
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 440 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography
              variant="h4"
              sx={{
                fontFamily: '"Playfair Display", serif',
                color: '#F0F7EE',
                fontWeight: 700,
                mb: 1,
              }}
            >
              Modo Invitado
            </Typography>
            <Typography variant="body2" sx={{ color: '#b0c4a0' }}>
              ¿Cuál es tu nombre, explorador?
            </Typography>
          </Box>

          <Box sx={{ ...glassStyle, p: { xs: 3, sm: 4 } }}>
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
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleGuestContinue();
              }}
              sx={{
                input: { color: '#F0F7EE' },
                label: { color: '#b0c4a0' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.15)' },
                  '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.25)' },
                  '&.Mui-focused fieldset': { borderColor: '#D4A017' },
                },
              }}
            />

            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleGuestContinue}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : undefined}
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
                background: 'linear-gradient(135deg, #D4A017, #FF8F00)',
                borderRadius: 20,
                fontWeight: 700,
                fontSize: '1rem',
                textTransform: 'none',
                color: '#0D1B0F',
                '&:hover': {
                  background: 'linear-gradient(135deg, #F5C842, #FF8F00)',
                },
              }}
            >
              {loading ? 'Iniciando...' : 'Comenzar Aventura'}
            </Button>
            <Button
              fullWidth
              variant="text"
              onClick={() => setMode('onboarding')}
              disabled={loading}
              sx={{ color: '#b0c4a0', textTransform: 'none' }}
            >
              Volver Atrás
            </Button>

            <Typography
              variant="caption"
              sx={{
                display: 'block',
                mt: 2,
                textAlign: 'center',
                color: 'rgba(176,196,160,0.6)',
              }}
            >
              Tus datos se guardarán localmente. Puedes crear una cuenta después.
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  }

  // ONBOARDING SLIDES MODE
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: onboardingGradients[slide],
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        transition: 'background 0.6s ease',
      }}
    >
      {/* Slide 1: Hero */}
      {slide === 0 && (
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'url(/assets/images/onboarding/hero-sierra-nevada.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.25,
          }}
        />
      )}

      {/* Slide 2: ilustracion */}
      {slide === 1 && (
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'url(/assets/images/onboarding/ilustracion-arhuaco.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.15,
          }}
        />
      )}

      {/* Overlay gradient */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(180deg, ${onboardingGradients[slide].includes('#0D1B0F') ? 'rgba(13,27,15,0.6)' : 'rgba(26,58,74,0.6)'} 0%, rgba(13,27,15,0.85) 100%)`,
          pointerEvents: 'none',
        }}
      />

      {/* Main content area */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1 }}>
        <AnimatePresence mode="wait" custom={direction}>
          <MotionDiv
            key={slide}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', stiffness: 280, damping: 28, mass: 0.8 }}
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              p: { xs: 3, sm: 4 },
              textAlign: 'center',
            }}
          >
            {/* SLIDE 0: Hero */}
            {slide === 0 && (
              <Box>
                <MotionDiv
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Typography
                    variant="h1"
                    sx={{
                      fontFamily: '"Playfair Display", serif',
                      color: '#F0F7EE',
                      fontWeight: 700,
                      mb: 2,
                      fontSize: { xs: '3.5rem', sm: '5rem', md: '6.5rem' },
                      textShadow: '0 4px 40px rgba(0,0,0,0.4)',
                      letterSpacing: '-0.03em',
                    }}
                  >
                    Sisio
                  </Typography>
                </MotionDiv>

                <MotionDiv
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      color: '#F0F7EE',
                      maxWidth: 500,
                      mx: 'auto',
                      lineHeight: 1.8,
                      mb: 1,
                      fontSize: { xs: '1rem', sm: '1.15rem' },
                    }}
                  >
                    Conecta con la sabiduría ancestral de las aves de la Sierra Nevada
                  </Typography>
                </MotionDiv>

                <MotionDiv
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'rgba(255,255,255,0.4)',
                      mt: 1,
                      fontStyle: 'italic',
                      fontSize: { xs: '0.8rem', sm: '0.85rem' },
                    }}
                  >
                    Mùsi · Seuzinka · Siamun Kògya
                  </Typography>
                </MotionDiv>
              </Box>
            )}

            {/* SLIDE 1: Features */}
            {slide === 1 && (
              <Box>
                <MotionDiv
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  sx={{ mb: 5 }}
                >
                  <Typography
                    variant="h4"
                    sx={{
                      fontFamily: '"Playfair Display", serif',
                      color: '#F0F7EE',
                      fontWeight: 700,
                      mb: 1,
                      fontSize: { xs: '1.8rem', sm: '2.5rem' },
                    }}
                  >
                    Identifica y Aprende
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#b0c4a0', maxWidth: 450, mx: 'auto' }}>
                    Herramientas poderosas para conectar con la naturaleza
                  </Typography>
                </MotionDiv>

                <Box
                  sx={{
                    display: 'flex',
                    gap: { xs: 2, sm: 3 },
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                  }}
                >
                  {featureIcons.map((feature, i) => (
                    <MotionDiv
                      key={feature.label}
                      initial={{ opacity: 0, y: 40, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{
                        duration: 0.5,
                        delay: 0.2 + i * 0.15,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      sx={{
                        ...glassStyle,
                        p: { xs: 2.5, sm: 3 },
                        width: { xs: '100%', sm: 160 },
                        textAlign: 'center',
                      }}
                    >
                      <Box sx={{ color: feature.color, mb: 1.5 }}>{feature.icon}</Box>
                      <Typography
                        variant="subtitle1"
                        sx={{ color: '#F0F7EE', fontWeight: 700, mb: 0.5 }}
                      >
                        {feature.label}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#b0c4a0', fontSize: '0.8rem' }}>
                        {feature.desc}
                      </Typography>
                    </MotionDiv>
                  ))}
                </Box>
              </Box>
            )}

            {/* SLIDE 2: CTA */}
            {slide === 2 && (
              <Box>
                <MotionDiv
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  sx={{ mb: 5 }}
                >
                  <Typography
                    variant="h4"
                    sx={{
                      fontFamily: '"Playfair Display", serif',
                      color: '#F0F7EE',
                      fontWeight: 700,
                      mb: 2,
                      fontSize: { xs: '1.8rem', sm: '2.5rem' },
                    }}
                  >
                    Preserva la Cultura
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: '#b0c4a0',
                      maxWidth: 500,
                      mx: 'auto',
                      lineHeight: 1.7,
                      mb: 1,
                    }}
                  >
                    Cada ave guarda historias de los pueblos Arhuaco, Kogui, Wiwa y Kankuamo.
                    Ayúdanos a preservar este conocimiento.
                  </Typography>
                </MotionDiv>

                <MotionDiv
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  sx={{
                    display: 'flex',
                    gap: 2,
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                  }}
                >
                  <MotionDiv whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={() => setMode('register')}
                      sx={{
                        py: 1.8,
                        px: { xs: 3, sm: 5 },
                        background: 'linear-gradient(135deg, #2D5016, #D4A017)',
                        borderRadius: 20,
                        fontWeight: 700,
                        fontSize: '1rem',
                        textTransform: 'none',
                        color: '#F0F7EE',
                        boxShadow: '0 8px 32px rgba(45,80,22,0.4)',
                        minWidth: { xs: '100%', sm: 220 },
                        '&:hover': {
                          background: 'linear-gradient(135deg, #4A7C2F, #F5C842)',
                        },
                      }}
                    >
                      Entrar como Usuario
                    </Button>
                  </MotionDiv>

                  <MotionDiv whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={() => setMode('guest')}
                      sx={{
                        py: 1.8,
                        px: { xs: 3, sm: 5 },
                        borderColor: '#D4A017',
                        color: '#D4A017',
                        borderRadius: 20,
                        fontWeight: 700,
                        fontSize: '1rem',
                        textTransform: 'none',
                        minWidth: { xs: '100%', sm: 220 },
                        '&:hover': {
                          borderColor: '#F5C842',
                          background: 'rgba(212,160,23,0.1)',
                        },
                      }}
                    >
                      Explorar como Invitado
                    </Button>
                  </MotionDiv>
                </MotionDiv>
              </Box>
            )}
          </MotionDiv>
        </AnimatePresence>

        {/* Navigation arrows */}
        {slide > 0 && (
          <Box
            sx={{
              position: 'absolute',
              left: { xs: 8, sm: 20 },
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 2,
            }}
          >
            <MotionDiv
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <IconButton
                onClick={handleBack}
                sx={{
                  color: '#F0F7EE',
                  background: 'rgba(255,255,255,0.08)',
                  '&:hover': { background: 'rgba(255,255,255,0.15)' },
                }}
              >
                <KeyboardArrowLeft sx={{ fontSize: 32 }} />
              </IconButton>
            </MotionDiv>
          </Box>
        )}

        {slide < 2 && (
          <Box
            sx={{
              position: 'absolute',
              right: { xs: 8, sm: 20 },
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 2,
            }}
          >
            <MotionDiv
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <IconButton
                onClick={handleNext}
                sx={{
                  color: '#F0F7EE',
                  background: 'rgba(255,255,255,0.08)',
                  '&:hover': { background: 'rgba(255,255,255,0.15)' },
                }}
              >
                <KeyboardArrowRight sx={{ fontSize: 32 }} />
              </IconButton>
            </MotionDiv>
          </Box>
        )}

        {/* Bottom dots indicator */}
        <Box
          sx={{
            display: 'flex',
            gap: 1,
            justifyContent: 'center',
            pb: { xs: 4, sm: 5 },
            pt: 2,
          }}
        >
          {[0, 1, 2].map((i) => (
            <MotionDiv
              key={i}
              onClick={() => handleDotClick(i)}
              whileHover={{ scale: 1.3 }}
              whileTap={{ scale: 0.9 }}
              animate={{
                width: i === slide ? 40 : 10,
                background: i === slide ? '#D4A017' : 'rgba(255,255,255,0.25)',
              }}
              transition={{ duration: 0.3 }}
              sx={{
                height: 10,
                borderRadius: 5,
                cursor: 'pointer',
              }}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};
