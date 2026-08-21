import React, { useState } from 'react';
import { Container, Typography, Button, Box, Paper, Chip, styled } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import ShareIcon from '@mui/icons-material/Share';
import HomeIcon from '@mui/icons-material/Home';
import { useBirdStore, useSightings, useAuth } from '@sisio/shared';
import { BirdDetailView } from '../components/BirdDetailView';

const MotionDiv = motion.div;

const AnimatedProgressBar = styled(motion.div)({
  height: '100%',
  borderRadius: 6,
  background: 'linear-gradient(90deg, #F44336, #FFC107, #4CAF50)',
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    right: 0,
    top: '50%',
    transform: 'translateY(-50%)',
    width: 8,
    height: 20,
    borderRadius: '4px',
    background: '#D4A017',
    boxShadow: '0 0 12px rgba(212,160,23,0.8)',
  },
});

const GlowBg = styled(motion.div)({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 300,
  height: 300,
  borderRadius: '50%',
  background: 'radial-gradient(circle, rgba(212,160,23,0.3), transparent 70%)',
  filter: 'blur(40px)',
  pointerEvents: 'none',
});

const glassmorphismStyle = {
  backdropFilter: 'blur(20px)',
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: '20px',
};

const BIRD_PHOTOS: Record<string, string> = {
  'aguila real': '/assets/images/birds/aguila-real.jpg',
  'colibrí de garganta roja': '/assets/images/birds/colibri-garganta-roja.jpg',
  'flamenco andino': '/assets/images/birds/flamenco-andino.jpg',
  'loro verde': '/assets/images/birds/loro-verde.jpg',
  'tucán toco': '/assets/images/birds/tucan-toco.jpg',
};

const riskColorMap: Record<string, string> = {
  bajo: '#4CAF50',
  medio: '#FFC107',
  alto: '#F44336',
};

const riskBgMap: Record<string, string> = {
  bajo: 'rgba(76,175,80,0.15)',
  medio: 'rgba(255,193,7,0.15)',
  alto: 'rgba(244,67,54,0.15)',
};

export const BirdResultPage: React.FC = () => {
  const navigate = useNavigate();
  const { identificationResult } = useBirdStore();
  const { createSighting } = useSightings();
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [showSharePreview, setShowSharePreview] = useState(false);

  const bird = identificationResult?.bird;
  const confidence = identificationResult?.confidence || 0;

  const handleSaveSighting = async () => {
    if (!bird) return;
    setSaving(true);
    try {
      await createSighting({
        bird_id: bird.id,
        user_id: user?.id,
        confidence,
        ecosystem_risk: bird.ecosistema_riesgo,
      });
      navigate('/');
    } catch {
      // Error handling
    } finally {
      setSaving(false);
    }
  };

  const handleShare = async () => {
    if (!bird) return;
    if (navigator.share) {
      await navigator.share({
        title: bird.nombre_espanol || bird.nombre_cientifico,
        text: `Identifiqué esta ave: ${bird.nombre_espanol} (${bird.nombre_cientifico}) con ${Math.round(confidence * 100)}% de precisión`,
        url: window.location.href,
      });
    } else {
      setShowSharePreview(true);
      setTimeout(() => setShowSharePreview(false), 3000);
    }
  };

  if (!bird) {
    return (
      <Container maxWidth="md" sx={{ py: 8, pb: '120px' }}>
        <MotionDiv
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Box
            sx={{
              textAlign: 'center',
              ...glassmorphismStyle,
              p: 6,
            }}
          >
          <Box
            sx={{
              width: 200,
              height: 200,
              mx: 'auto',
              mb: 4,
              borderRadius: '50%',
              overflow: 'hidden',
              background: 'linear-gradient(135deg, rgba(45,80,22,0.3), rgba(26,58,74,0.3))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Box
              component="img"
              src="/assets/images/empty-states/no-results.jpg"
              alt="Sin resultados"
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: 0.7,
              }}
              onError={(e: any) => {
                e.target.style.display = 'none';
              }}
            />
            <Typography
              sx={{
                position: 'absolute',
                fontSize: '5rem',
              }}
            >
              🔍
            </Typography>
          </Box>
          <Typography
            variant="h5"
            sx={{
              fontFamily: '"Playfair Display", serif',
              fontWeight: 600,
              color: '#F0F7EE',
              mb: 2,
            }}
          >
            No hay resultado de identificación
          </Typography>
          <Typography variant="body1" sx={{ color: '#b0c4a0', mb: 4 }}>
            Intenta tomar otra foto o grabar otro canto para identificar una ave
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/')}
            startIcon={<HomeIcon />}
            sx={{
              borderRadius: '16px',
              py: 1.5,
              px: 4,
              background: 'linear-gradient(135deg, #2D5016, #D4A017)',
              fontWeight: 600,
              '&:hover': {
                background: 'linear-gradient(135deg, #4A7C2F, #F5C842)',
                transform: 'translateY(-2px)',
              },
            }}
          >
            Volver al inicio
          </Button>
          </Box>
        </MotionDiv>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4, pb: '120px' }}>
      <AnimatePresence>
        <MotionDiv
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <Box sx={{ position: 'relative', mb: 4 }}>
          <GlowBg
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.3 }}
          />

          <MotionDiv
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Box
              sx={{
                position: 'relative',
                width: 180,
                height: 180,
                mx: 'auto',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '4px solid rgba(212,160,23,0.4)',
                boxShadow: '0 0 40px rgba(212,160,23,0.3)',
              }}
            >
            {bird.imagen_url ? (
              <Box
                component="img"
                src={bird.imagen_url}
                alt={bird.nombre_espanol || bird.nombre_cientifico}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            ) : (
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(135deg, #2D5016, #1A3A4A)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                }}
              >
                {(() => {
                  const birdName = (bird.nombre_espanol || '').toLowerCase();
                  const photoSrc = BIRD_PHOTOS[birdName];
                  if (photoSrc) {
                    return (
                      <img
                        src={photoSrc}
                        alt={bird.nombre_espanol || bird.nombre_cientifico}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    );
                  }
                  return <Typography sx={{ fontSize: '5rem' }}>🦅</Typography>;
                })()}
              </Box>
            )}
            </Box>
          </MotionDiv>
          </Box>
        </MotionDiv>

        <MotionDiv
          initial={{ filter: 'blur(20px)', opacity: 0 }}
          animate={{ filter: 'blur(0px)', opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontFamily: '"Playfair Display", serif',
              fontWeight: 700,
              color: '#F0F7EE',
              mb: 1,
            }}
          >
            {bird.nombre_espanol || bird.nombre_cientifico}
          </Typography>
          <Typography
            variant="h6"
            sx={{
              fontStyle: 'italic',
              color: '#b0c4a0',
              fontFamily: '"Playfair Display", serif',
              mb: 1,
            }}
          >
            {bird.nombre_cientifico}
          </Typography>
          {bird.nombre_nativo && (
            <Typography
              variant="body1"
              sx={{
                color: '#D4A017',
                fontFamily: '"Lora", serif',
              }}
            >
              {bird.nombre_nativo}
              {bird.lengua && (
                <span style={{ color: '#b0c4a0', fontStyle: 'italic', marginLeft: 8 }}>
                  ({bird.lengua})
                </span>
              )}
            </Typography>
          )}
          </Box>
        </MotionDiv>

        {confidence > 0 && (
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <Box sx={{ mb: 4 }}>
            <Paper sx={{ p: 3, ...glassmorphismStyle }}>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: '#b0c4a0' }}>
                Señal del bosque - Precisión de identificación
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ flex: 1, position: 'relative' }}>
                  <Box
                    sx={{
                      height: 12,
                      borderRadius: 6,
                      background: 'rgba(255,255,255,0.1)',
                      overflow: 'hidden',
                      position: 'relative',
                    }}
                  >
                    <AnimatedProgressBar
                      initial={{ width: 0 }}
                      animate={{ width: `${confidence * 100}%` }}
                      transition={{ duration: 1.5, ease: 'easeOut', delay: 1 }}
                    />
                  </Box>
                </Box>
                <Typography
                  variant="h6"
                  sx={{
                    color: '#D4A017',
                    fontWeight: 700,
                    minWidth: 50,
                    textAlign: 'right',
                  }}
                >
                  {Math.round(confidence * 100)}%
                </Typography>
              </Box>
            </Paper>
            </Box>
          </MotionDiv>
        )}

        <MotionDiv
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <Box sx={{ mb: 4 }}>
          <Box sx={{
            p: 2,
            borderRadius: '12px',
            background: riskBgMap[bird.ecosistema_riesgo],
            border: `1px solid ${riskColorMap[bird.ecosistema_riesgo]}40`,
            textAlign: 'center',
            mb: 3,
          }}>
            <Chip
              label={`Riesgo ecosistema: ${bird.ecosistema_riesgo.toUpperCase()}`}
              sx={{
                fontWeight: 600,
                color: riskColorMap[bird.ecosistema_riesgo],
                background: 'transparent',
                fontSize: '0.9rem',
              }}
            />
          </Box>

          <BirdDetailView bird={bird} confidence={confidence} />
          </Box>
        </MotionDiv>

        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 1.5 }}
        >
          <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
            <Button
              variant="contained"
              onClick={handleSaveSighting}
              disabled={saving}
              startIcon={<SaveAltIcon />}
              sx={{
                flex: 1,
                py: 1.5,
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #2D5016, #D4A017)',
                fontWeight: 600,
                fontSize: '1rem',
                position: 'relative',
                overflow: 'hidden',
                '&::after': saving
                  ? {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: '-100%',
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                      animation: 'shimmer 1.5s infinite',
                    }
                  : {},
                '@keyframes shimmer': {
                  '0%': { left: '-100%' },
                  '100%': { left: '100%' },
                },
                '&:hover': {
                  background: 'linear-gradient(135deg, #4A7C2F, #F5C842)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 20px rgba(212,160,23,0.3)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              {saving ? 'Guardando...' : 'Guardar Avistamiento'}
            </Button>
            <Button
              variant="outlined"
              onClick={handleShare}
              startIcon={<ShareIcon />}
              sx={{
                flex: 1,
                py: 1.5,
                borderRadius: '16px',
                borderColor: 'rgba(212,160,23,0.4)',
                color: '#D4A017',
                fontWeight: 600,
                fontSize: '1rem',
                '&:hover': {
                  borderColor: '#D4A017',
                  background: 'rgba(212,160,23,0.1)',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Compartir
            </Button>
          </Box>
        </MotionDiv>

        <AnimatePresence>
          {showSharePreview && (
            <MotionDiv
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <Box
                sx={{
                  mt: 3,
                  p: 3,
                  ...glassmorphismStyle,
                }}
              >
              <Typography variant="body2" sx={{ color: '#b0c4a0', textAlign: 'center' }}>
                Enlace copiado al portapapeles
              </Typography>
              </Box>
            </MotionDiv>
          )}
        </AnimatePresence>
      </AnimatePresence>
    </Container>
  );
};
