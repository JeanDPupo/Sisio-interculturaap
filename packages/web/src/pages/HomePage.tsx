import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Button, Grid, Paper } from '@mui/material';
import { motion, useInView, useScroll, useTransform, animate } from 'framer-motion';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import MicIcon from '@mui/icons-material/Mic';
import PetsIcon from '@mui/icons-material/Pets';
import MapIcon from '@mui/icons-material/Map';
import ListIcon from '@mui/icons-material/List';
import PersonIcon from '@mui/icons-material/Person';
import { useAuth, useOffline } from '@sisio/shared';

const MotionDiv = motion.div;

const ScrollReveal: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <MotionDiv
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </MotionDiv>
  );
};

const AnimatedCounter: React.FC<{ target: number; suffix?: string }> = ({ target, suffix = '' }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (isInView) {
      const controls = animate(0, target, {
        duration: 2,
        ease: 'easeOut',
        onUpdate: (v) => setValue(Math.round(v)),
      });
      return () => controls.stop();
    }
  }, [isInView, target]);

  return (
    <span ref={ref} style={{ fontVariantNumeric: 'tabular-nums' }}>
      {value.toLocaleString('es-CO')}{suffix}
    </span>
  );
};

const glassStyle = {
  backdropFilter: 'blur(20px)',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 20,
};

const navCards = [
  { label: 'Aves', icon: <PetsIcon sx={{ fontSize: 32 }} />, path: '/birds', color: '#8BC34A' },
  { label: 'Avistamientos', icon: <ListIcon sx={{ fontSize: 32 }} />, path: '/sightings', color: '#64B5F6' },
  { label: 'Mapa', icon: <MapIcon sx={{ fontSize: 32 }} />, path: '/map', color: '#4A7C2F' },
  { label: 'Perfil', icon: <PersonIcon sx={{ fontSize: 32 }} />, path: '/profile', color: '#D4A017' },
];

const communities = [
  { label: 'Arhuaco', color: '#8BC34A' },
  { label: 'Kogui', color: '#D4A017' },
  { label: 'Wiwa', color: '#64B5F6' },
  { label: 'Kankuamo', color: '#4A7C2F' },
];

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isGuest } = useAuth();
  const { isOnline } = useOffline();

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const titleScale = useTransform(scrollYProgress, [0, 0.4], [1, 0.92]);

  return (
    <Box sx={{ pb: '80px' }}>
      {/* HERO SECTION */}
      <Box
        ref={heroRef}
        sx={{
          minHeight: '100vh',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <MotionDiv
          style={{ y: bgY }}
          sx={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, #0D1B0F 0%, #1A3A4A 40%, #2D5016 100%)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse at 50% 20%, rgba(212,160,23,0.08) 0%, transparent 60%)',
          }}
        />

        {!isOnline && (
          <Paper
            sx={{
              position: 'absolute',
              top: 72,
              left: 0,
              right: 0,
              zIndex: 10,
              p: 1.5,
              bgcolor: 'rgba(244,67,54,0.9)',
              color: 'white',
              borderRadius: 0,
              textAlign: 'center',
            }}
          >
            <Typography variant="body2">
              📴 Sin conexión — Tus identificaciones se guardarán y procesarán después
            </Typography>
          </Paper>
        )}

        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <MotionDiv
            style={{ opacity: titleOpacity, scale: titleScale }}
            sx={{ textAlign: 'center', mb: 5, mt: 4 }}
          >
            <MotionDiv
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              variant="h2"
              sx={{
                fontFamily: '"Playfair Display", serif',
                fontWeight: 700,
                color: '#F0F7EE',
                mb: 1,
                fontSize: { xs: '3rem', sm: '4rem', md: '5.5rem' },
                letterSpacing: '-0.02em',
                textShadow: '0 4px 40px rgba(0,0,0,0.3)',
              }}
            >
              Sisio
            </MotionDiv>

            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              variant="h6"
              sx={{
                color: '#b0c4a0',
                mb: 1,
                fontSize: { xs: '0.95rem', sm: '1.1rem' },
                lineHeight: 1.6,
              }}
            >
              {isGuest
                ? 'Explora la sabiduría ancestral de la Sierra Nevada'
                : `Bienvenido de vuelta, ${user?.name || 'explorador'}`}
            </MotionDiv>

            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.45 }}
              variant="body2"
              sx={{
                color: 'rgba(255,255,255,0.45)',
                mb: 5,
                fontSize: { xs: '0.8rem', sm: '0.85rem' },
                letterSpacing: '0.04em',
              }}
            >
              Comunidades Arhuaco · Kogui · Wiwa · Kankuamo
            </MotionDiv>

            {/* CTA BUTTONS */}
            <MotionDiv
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.55 }}
              sx={{
                display: 'flex',
                gap: 2,
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
            >
              <MotionDiv
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
              >
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<PhotoCameraIcon />}
                  onClick={() => navigate('/photo-upload')}
                  sx={{
                    py: 2.2,
                    px: { xs: 3, sm: 4.5 },
                    background: 'linear-gradient(135deg, #2D5016 0%, #D4A017 100%)',
                    borderRadius: 50,
                    fontSize: { xs: '0.95rem', sm: '1.05rem' },
                    fontWeight: 700,
                    minWidth: { xs: '100%', sm: 220 },
                    boxShadow: '0 8px 32px rgba(45,80,22,0.4)',
                    textTransform: 'none',
                    color: '#F0F7EE',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #4A7C2F 0%, #F5C842 100%)',
                      boxShadow: '0 12px 40px rgba(45,80,22,0.5)',
                    },
                  }}
                >
                  Identificar por Foto
                </Button>
              </MotionDiv>

              <MotionDiv
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
              >
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<MicIcon />}
                  onClick={() => navigate('/audio-upload')}
                  sx={{
                    py: 2.2,
                    px: { xs: 3, sm: 4.5 },
                    background: 'linear-gradient(135deg, #D4A017 0%, #FF8F00 100%)',
                    borderRadius: 50,
                    fontSize: { xs: '0.95rem', sm: '1.05rem' },
                    fontWeight: 700,
                    minWidth: { xs: '100%', sm: 220 },
                    boxShadow: '0 8px 32px rgba(212,160,23,0.35)',
                    textTransform: 'none',
                    color: '#0D1B0F',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #F5C842 0%, #FF8F00 100%)',
                      boxShadow: '0 12px 40px rgba(212,160,23,0.45)',
                    },
                  }}
                >
                  Identificar por Canto
                </Button>
              </MotionDiv>
            </MotionDiv>
          </MotionDiv>
        </Container>

        {/* Bottom fade */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 120,
            background: 'linear-gradient(to top, #0D1B0F, transparent)',
            zIndex: 1,
          }}
        />
      </Box>

      {/* NAVIGATION CARDS */}
      <Box sx={{ background: '#0D1B0F', pt: 2, pb: 4 }}>
        <Container maxWidth="md">
          <ScrollReveal>
            <Grid container spacing={2}>
              {navCards.map((card, index) => (
                <Grid item xs={6} sm={3} key={card.path}>
                  <MotionDiv
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <MotionDiv
                      whileHover={{
                        y: -6,
                        boxShadow: '0 12px 40px rgba(0,0,0,0.4)',
                        borderColor: 'rgba(212,160,23,0.4)',
                      }}
                      transition={{ duration: 0.3 }}
                      onClick={() => navigate(card.path)}
                      sx={{
                        ...glassStyle,
                        p: { xs: 2.5, sm: 3 },
                        textAlign: 'center',
                        cursor: 'pointer',
                        overflow: 'hidden',
                        position: 'relative',
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: '-100%',
                          width: '200%',
                          height: '100%',
                          background:
                            'linear-gradient(90deg, transparent, rgba(212,160,23,0.06), transparent)',
                          transition: 'left 0.6s ease',
                          pointerEvents: 'none',
                        },
                        '&:hover::after': {
                          left: '100%',
                        },
                      }}
                    >
                      <Box sx={{ color: card.color, mb: 1 }}>{card.icon}</Box>
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#F0F7EE',
                          fontWeight: 600,
                          fontSize: { xs: '0.85rem', sm: '0.9rem' },
                        }}
                      >
                        {card.label}
                      </Typography>
                    </MotionDiv>
                  </MotionDiv>
                </Grid>
              ))}
            </Grid>
          </ScrollReveal>
        </Container>
      </Box>

      {/* CONOCIMIENTO ANCESTRAL */}
      <Box sx={{ background: '#0D1B0F', py: 6 }}>
        <Container maxWidth="md">
          <ScrollReveal delay={0.1}>
            <Paper
              sx={{
                ...glassStyle,
                p: { xs: 3, sm: 4 },
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: 4,
                  height: '100%',
                  background: 'linear-gradient(180deg, #D4A017, #8BC34A)',
                  borderRadius: 2,
                },
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontFamily: '"Playfair Display", serif',
                  color: '#D4A017',
                  mb: 2,
                  fontWeight: 700,
                  pl: 1,
                }}
              >
                Conocimiento Ancestral
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: '#b0c4a0',
                  lineHeight: 1.8,
                  pl: 1,
                  mb: 3,
                }}
              >
                Cada ave en la Sierra Nevada de Santa Marta guarda historias y significados
                transmitidos por generaciones por los pueblos Arhuaco, Kogui, Wiwa y Kankuamo.
                Identifica, aprende y preserva esta sabiduría que conecta el mundo natural con
                el espiritual.
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', pl: 1 }}>
                {communities.map((c, i) => (
                  <MotionDiv
                    key={c.label}
                    label={c.label}
                    size="medium"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
                    sx={{
                      color: '#F0F7EE',
                      borderColor: c.color,
                      fontWeight: 600,
                      fontSize: '0.85rem',
                    }}
                    variant="outlined"
                  />
                ))}
              </Box>
            </Paper>
          </ScrollReveal>
        </Container>
      </Box>

      {/* STATS COUNTER */}
      <Box sx={{ background: '#0D1B0F', py: 5 }}>
        <Container maxWidth="md">
          <ScrollReveal delay={0.15}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: { xs: 2, sm: 4 },
                py: 3,
                px: 3,
                borderRadius: 20,
                background: 'rgba(212,160,23,0.04)',
                border: '1px solid rgba(212,160,23,0.12)',
                textAlign: 'center',
              }}
            >
              <Box>
                <Typography
                  variant="h4"
                  sx={{
                    fontFamily: '"Playfair Display", serif',
                    color: '#D4A017',
                    fontWeight: 700,
                    fontSize: { xs: '1.8rem', sm: '2.5rem' },
                  }}
                >
                  <AnimatedCounter target={1284} />
                </Typography>
                <Typography variant="body2" sx={{ color: '#b0c4a0', mt: 0.5 }}>
                  aves identificadas hoy
                </Typography>
              </Box>

              <Box
                sx={{
                  width: 1,
                  height: 40,
                  background: 'rgba(255,255,255,0.1)',
                  display: { xs: 'none', sm: 'block' },
                }}
              />

              <Box
                sx={{
                  width: { xs: '100%', sm: 'auto' },
                  height: { xs: 1, sm: 40 },
                  background: 'rgba(255,255,255,0.1)',
                }}
              />

              <Box>
                <Typography
                  variant="h4"
                  sx={{
                    fontFamily: '"Playfair Display", serif',
                    color: '#64B5F6',
                    fontWeight: 700,
                    fontSize: { xs: '1.8rem', sm: '2.5rem' },
                  }}
                >
                  <AnimatedCounter target={347} />
                </Typography>
                <Typography variant="body2" sx={{ color: '#b0c4a0', mt: 0.5 }}>
                  avistamientos esta semana
                </Typography>
              </Box>
            </Box>
          </ScrollReveal>
        </Container>
      </Box>

      {/* FOOTER */}
      <Box sx={{ background: '#0D1B0F', pt: 6, pb: 2 }}>
        {/* Geometric indigenous pattern */}
        <Box sx={{ width: '100%', mb: 4, overflow: 'hidden' }}>
          <svg
            viewBox="0 0 1200 60"
            preserveAspectRatio="none"
            style={{ width: '100%', height: 40, display: 'block' }}
          >
            <path
              d="M0,30 L30,10 L60,30 L90,10 L120,30 L150,10 L180,30 L210,10 L240,30 L270,10 L300,30 L330,10 L360,30 L390,10 L420,30 L450,10 L480,30 L510,10 L540,30 L570,10 L600,30 L630,10 L660,30 L690,10 L720,30 L750,10 L780,30 L810,10 L840,30 L870,10 L900,30 L930,10 L960,30 L990,10 L1020,30 L1050,10 L1080,30 L1110,10 L1140,30 L1170,10 L1200,30"
              fill="none"
              stroke="rgba(212,160,23,0.25)"
              strokeWidth="1.5"
            />
            <path
              d="M0,45 L30,25 L60,45 L90,25 L120,45 L150,25 L180,45 L210,25 L240,45 L270,25 L300,45 L330,25 L360,45 L390,25 L420,45 L450,25 L480,45 L510,25 L540,45 L570,25 L600,45 L630,25 L660,45 L690,25 L720,45 L750,25 L780,45 L810,25 L840,45 L870,25 L900,45 L930,25 L960,45 L990,25 L1020,45 L1050,25 L1080,45 L1110,25 L1140,45 L1170,25 L1200,45"
              fill="none"
              stroke="rgba(139,195,74,0.18)"
              strokeWidth="1"
            />
          </svg>
        </Box>

        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="h6"
              sx={{
                fontFamily: '"Playfair Display", serif',
                color: '#D4A017',
                fontWeight: 700,
                mb: 1,
              }}
            >
              Sisio
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(176,196,160,0.6)', mb: 2 }}>
              Preservando la sabiduría ancestral de la Sierra Nevada de Santa Marta
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(176,196,160,0.35)' }}>
              © 2026 Sisio · Hecho con respeto por los pueblos indígenas de la Sierra Nevada
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};
