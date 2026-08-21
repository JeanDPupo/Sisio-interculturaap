import React, { useState, useRef, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  LinearProgress,
  CircularProgress,
  CardContent,
  CardActions,
  Collapse,
  Chip,
  IconButton,
  Stack,
  styled,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import ShareIcon from '@mui/icons-material/Share';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import { Bird, useAuth, useSightings } from '@sisio/shared';
const ARViewer = React.lazy(() => import('./ARViewer').then(m => ({ default: m.ARViewer })));

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

const BIRD_PHOTOS: Record<string, string> = {
  'aguila': '/assets/images/birds/aguila-real.jpg',
  'colibr': '/assets/images/birds/colibri-garganta-roja.jpg',
  'flamenco': '/assets/images/birds/flamenco-andino.jpg',
  'loro': '/assets/images/birds/loro-verde.jpg',
  'tucan': '/assets/images/birds/tucan-toco.jpg',
  'turpial': '/assets/images/birds/turpial.jpg',
};

function normalize(str: string): string {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

function getBirdPhoto(name: string): string | null {
  const lower = normalize(name);
  for (const [key, photo] of Object.entries(BIRD_PHOTOS)) {
    if (lower.includes(key)) return photo;
  }
  return null;
}

const RISK_ICONS: Record<string, string> = {
  bajo: '/assets/icons/risk/risk-low.svg',
  medio: '/assets/icons/risk/risk-medium.svg',
  alto: '/assets/icons/risk/risk-high.svg',
};

const FICHA_ICONS = {
  feather: '/assets/icons/ficha/feather.svg',
  cosmovision: '/assets/icons/ficha/cosmovision.svg',
  habitat: '/assets/icons/ficha/habitat.svg',
  migration: '/assets/icons/ficha/migration.svg',
  audioCanto: '/assets/icons/ficha/audio-canto.svg',
};

interface Props {
  bird: Bird;
  confidence?: number;
  showActions?: boolean;
}

const glassmorphismStyle = {
  backdropFilter: 'blur(20px)',
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: '20px',
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

const FeatherIcon = () => (
  <img src={FICHA_ICONS.feather} alt="Feather" style={{ width: 24, height: 24 }} />
);

const CosmovisionIcon = () => (
  <img src={FICHA_ICONS.cosmovision} alt="Cosmovisión" style={{ width: 24, height: 24 }} />
);

const HabitatIcon = () => (
  <img src={FICHA_ICONS.habitat} alt="Hábitat" style={{ width: 24, height: 24 }} />
);

const MigrationIcon = () => (
  <img src={FICHA_ICONS.migration} alt="Migración" style={{ width: 24, height: 24 }} />
);

const AudioCantoIcon = () => (
  <img src={FICHA_ICONS.audioCanto} alt="Audio/Canto" style={{ width: 24, height: 24 }} />
);

const BookIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="#64B5F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke="#64B5F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const BirdIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 7h.01M3.4 18H12a8 8 0 0 0 8-8V7a4 4 0 0 0-7.28-2.3L2 20" stroke="#8BC34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="m7.5 14.5 4 4" stroke="#8BC34A" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const MountainIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="m8 3 4 8 5-5 2 15H2L8 3z" stroke="#64B5F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const MapIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" stroke="#FF8F00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="8" y1="2" x2="8" y2="18" stroke="#FF8F00" strokeWidth="2"/>
    <line x1="16" y1="6" x2="16" y2="22" stroke="#FF8F00" strokeWidth="2"/>
  </svg>
);

export const BirdDetailView: React.FC<Props> = ({ bird, confidence = 0, showActions = true }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createSighting } = useSightings();
  const [saving, setSaving] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    significado: false,
    cosmovision: false,
    historias: false,
    comportamiento: false,
    habitat: false,
    zona: false,
  });
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handlePlayPause = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(bird.audio_url);
      audioRef.current.addEventListener('timeupdate', () => {
        if (audioRef.current) {
          setAudioProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
        }
      });
      audioRef.current.addEventListener('ended', () => {
        setIsPlaying(false);
        setAudioProgress(0);
      });
    }

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSaveSighting = async () => {
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
    if (navigator.share) {
      await navigator.share({
        title: bird.nombre_espanol || bird.nombre_cientifico,
        text: `Mira esta ave: ${bird.nombre_espanol} (${bird.nombre_cientifico})`,
        url: window.location.href,
      });
    }
  };

  const getRiskIcon = (risk: string) => {
    const src = RISK_ICONS[risk] || RISK_ICONS.bajo;
    return <img src={src} alt={risk} style={{ width: 20, height: 20 }} />;
  };

  const expandAnimation = {
    open: { height: 'auto', opacity: 1, transition: { duration: 0.3 } },
    closed: { height: 0, opacity: 0, transition: { duration: 0.2 } },
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4, pb: '120px' }}>
      <MotionDiv
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            mb: 4,
            borderRadius: '24px',
            overflow: 'hidden',
            maxHeight: 400,
          }}
        >
        {bird.imagen_url ? (
          <Box
            component="img"
            src={bird.imagen_url}
            alt={bird.nombre_espanol || bird.nombre_cientifico}
            sx={{
              width: '100%',
              height: 400,
              objectFit: 'cover',
              display: 'block',
            }}
          />
        ) : (
          <Box
            sx={{
              width: '100%',
              height: 400,
              background: 'linear-gradient(135deg, #2D5016, #1A3A4A)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            {(() => {
              const photoSrc = getBirdPhoto(bird.nombre_espanol || '') || getBirdPhoto(bird.nombre_cientifico || '');
              if (photoSrc) {
                return (
                  <img
                    src={photoSrc}
                    alt={bird.nombre_espanol || bird.nombre_cientifico}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                );
              }
              return <Typography sx={{ fontSize: '8rem' }}>🦅</Typography>;
            })()}
          </Box>
        )}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '60%',
            background: 'linear-gradient(transparent, rgba(13,27,15,0.95))',
          }}
        />
        </Box>
      </MotionDiv>

      <MotionDiv
        initial={{ filter: 'blur(20px)', opacity: 0 }}
        animate={{ filter: 'blur(0px)', opacity: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
      >
        <Box sx={{ mb: 4 }}>
        <Typography
          variant="h3"
          sx={{
            fontFamily: '"Playfair Display", serif',
            fontWeight: 700,
            color: '#F0F7EE',
            mb: 1,
            fontSize: { xs: '2rem', md: '2.5rem' },
          }}
        >
          {bird.nombre_espanol || bird.nombre_cientifico}
        </Typography>
        <Typography
          variant="h5"
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
              mb: 1,
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

      {showActions && confidence > 0 && (
        <MotionDiv
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
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
                    transition={{ duration: 1.5, ease: 'easeOut', delay: 0.8 }}
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

      <Stack spacing={2} sx={{ mb: 4 }}>
        {bird.significado_ancestral && (
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
          >
            <Box
              sx={{
                ...glassmorphismStyle,
                borderLeft: '4px solid #D4A017',
              }}
            >
            <CardActions
              onClick={() => toggleSection('significado')}
              sx={{ cursor: 'pointer', justifyContent: 'space-between' }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <FeatherIcon />
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#D4A017' }}>
                  Significado Ancestral
                </Typography>
              </Box>
              <IconButton size="small" sx={{ color: '#D4A017' }}>
                <ExpandMoreIcon
                  sx={{
                    transform: expandedSections.significado ? 'rotate(180deg)' : 'rotate(0)',
                    transition: 'transform 0.3s ease',
                  }}
                />
              </IconButton>
            </CardActions>
            <Collapse in={expandedSections.significado}>
              <CardContent sx={{ pt: 0 }}>
                <Typography variant="body2" sx={{ color: '#E0E0E0', lineHeight: 1.8 }}>
                  {bird.significado_ancestral}
                </Typography>
              </CardContent>
            </Collapse>
            </Box>
          </MotionDiv>
        )}

        {bird.rol_cosmovision && (
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.7 }}
          >
            <Box
              sx={{
                ...glassmorphismStyle,
                borderLeft: '4px solid #4CAF50',
              }}
            >
            <CardActions
              onClick={() => toggleSection('cosmovision')}
              sx={{ cursor: 'pointer', justifyContent: 'space-between' }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <CosmovisionIcon />
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#4CAF50' }}>
                  Rol en la Cosmovisión
                </Typography>
              </Box>
              <IconButton size="small" sx={{ color: '#4CAF50' }}>
                <ExpandMoreIcon
                  sx={{
                    transform: expandedSections.cosmovision ? 'rotate(180deg)' : 'rotate(0)',
                    transition: 'transform 0.3s ease',
                  }}
                />
              </IconButton>
            </CardActions>
            <Collapse in={expandedSections.cosmovision}>
              <CardContent sx={{ pt: 0 }}>
                <Typography variant="body2" sx={{ color: '#E0E0E0', lineHeight: 1.8 }}>
                  {bird.rol_cosmovision}
                </Typography>
              </CardContent>
            </Collapse>
            </Box>
          </MotionDiv>
        )}

        {bird.historias_ancestrales?.length > 0 && (
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.8 }}
          >
            <Box
              sx={{
                ...glassmorphismStyle,
                borderLeft: '4px solid #64B5F6',
              }}
            >
            <CardActions
              onClick={() => toggleSection('historias')}
              sx={{ cursor: 'pointer', justifyContent: 'space-between' }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <BookIcon />
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#64B5F6' }}>
                  Historias
                </Typography>
              </Box>
              <IconButton size="small" sx={{ color: '#64B5F6' }}>
                <ExpandMoreIcon
                  sx={{
                    transform: expandedSections.historias ? 'rotate(180deg)' : 'rotate(0)',
                    transition: 'transform 0.3s ease',
                  }}
                />
              </IconButton>
            </CardActions>
            <Collapse in={expandedSections.historias}>
              <CardContent sx={{ pt: 0 }}>
                {bird.historias_ancestrales.map((historia, idx) => (
                  <Typography key={idx} variant="body2" sx={{ mb: 1.5, color: '#E0E0E0', lineHeight: 1.8 }}>
                    • {typeof historia === 'string' ? historia : (historia as any).historia || JSON.stringify(historia)}
                  </Typography>
                ))}
              </CardContent>
            </Collapse>
            </Box>
          </MotionDiv>
        )}

        {bird.comportamientos && (
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.9 }}
          >
            <Box
              sx={{
                ...glassmorphismStyle,
                borderLeft: '4px solid #8BC34A',
              }}
            >
            <CardActions
              onClick={() => toggleSection('comportamiento')}
              sx={{ cursor: 'pointer', justifyContent: 'space-between' }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <BirdIcon />
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#8BC34A' }}>
                  Comportamiento
                </Typography>
              </Box>
              <IconButton size="small" sx={{ color: '#8BC34A' }}>
                <ExpandMoreIcon
                  sx={{
                    transform: expandedSections.comportamiento ? 'rotate(180deg)' : 'rotate(0)',
                    transition: 'transform 0.3s ease',
                  }}
                />
              </IconButton>
            </CardActions>
            <Collapse in={expandedSections.comportamiento}>
              <CardContent sx={{ pt: 0 }}>
                <Typography variant="body2" sx={{ color: '#E0E0E0', lineHeight: 1.8 }}>
                  {bird.comportamientos}
                </Typography>
              </CardContent>
            </Collapse>
            </Box>
          </MotionDiv>
        )}

        {bird.habitat && (
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 1.0 }}
          >
            <Box
              sx={{
                ...glassmorphismStyle,
                borderLeft: '4px solid #64B5F6',
              }}
            >
            <CardActions
              onClick={() => toggleSection('habitat')}
              sx={{ cursor: 'pointer', justifyContent: 'space-between' }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <HabitatIcon />
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#64B5F6' }}>
                  Hábitat
                </Typography>
              </Box>
              <IconButton size="small" sx={{ color: '#64B5F6' }}>
                <ExpandMoreIcon
                  sx={{
                    transform: expandedSections.habitat ? 'rotate(180deg)' : 'rotate(0)',
                    transition: 'transform 0.3s ease',
                  }}
                />
              </IconButton>
            </CardActions>
            <Collapse in={expandedSections.habitat}>
              <CardContent sx={{ pt: 0 }}>
                <Typography variant="body2" sx={{ color: '#E0E0E0', lineHeight: 1.8 }}>
                  {bird.habitat}
                </Typography>
              </CardContent>
            </Collapse>
            </Box>
          </MotionDiv>
        )}

        {bird.zona_geografica && (
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 1.1 }}
          >
            <Box
              sx={{
                ...glassmorphismStyle,
                borderLeft: '4px solid #FF8F00',
              }}
            >
            <CardActions
              onClick={() => toggleSection('zona')}
              sx={{ cursor: 'pointer', justifyContent: 'space-between' }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <MapIcon />
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#FF8F00' }}>
                  Zona Geográfica
                </Typography>
              </Box>
              <IconButton size="small" sx={{ color: '#FF8F00' }}>
                <ExpandMoreIcon
                  sx={{
                    transform: expandedSections.zona ? 'rotate(180deg)' : 'rotate(0)',
                    transition: 'transform 0.3s ease',
                  }}
                />
              </IconButton>
            </CardActions>
            <Collapse in={expandedSections.zona}>
              <CardContent sx={{ pt: 0 }}>
                <Typography variant="body2" sx={{ color: '#E0E0E0', lineHeight: 1.8 }}>
                  {bird.zona_geografica}
                </Typography>
              </CardContent>
            </Collapse>
            </Box>
          </MotionDiv>
        )}

        <MotionDiv
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 1.2 }}
        >
          <Box
            sx={{
              p: 3,
              borderRadius: '16px',
              background: riskBgMap[bird.ecosistema_riesgo],
              border: `1px solid ${riskColorMap[bird.ecosistema_riesgo]}40`,
              textAlign: 'center',
            }}
          >
          <Chip
            icon={getRiskIcon(bird.ecosistema_riesgo)}
            label={`Riesgo ecosistema: ${bird.ecosistema_riesgo.toUpperCase()}`}
            sx={{
              fontWeight: 600,
              color: riskColorMap[bird.ecosistema_riesgo],
              background: 'transparent',
              fontSize: '0.95rem',
              '& .MuiChip-icon': { color: riskColorMap[bird.ecosistema_riesgo] },
            }}
          />
          </Box>
        </MotionDiv>
      </Stack>

      {bird.audio_url && (
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 1.3 }}
        >
          <Box sx={{ mb: 4 }}>
          <Paper sx={{ p: 3, ...glassmorphismStyle }}>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, color: '#D4A017', display: 'flex', alignItems: 'center', gap: 1 }}>
              <img src={FICHA_ICONS.audioCanto} alt="Audio" style={{ width: 24, height: 24 }} />
              Audio del canto
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton
                onClick={handlePlayPause}
                sx={{
                  background: 'linear-gradient(135deg, #D4A017, #F5C842)',
                  color: '#0D1B0F',
                  '&:hover': { background: 'linear-gradient(135deg, #F5C842, #D4A017)' },
                }}
              >
                {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
              </IconButton>
              <Box sx={{ flex: 1 }}>
                <Box
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    background: 'rgba(255,255,255,0.1)',
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    sx={{
                      height: '100%',
                      width: `${audioProgress}%`,
                      borderRadius: 3,
                      background: 'linear-gradient(90deg, #D4A017, #F5C842)',
                      transition: 'width 0.1s linear',
                    }}
                  />
                </Box>
              </Box>
            </Box>
          </Paper>
          </Box>
        </MotionDiv>
      )}

      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 1.4 }}
      >
        <Box sx={{ mb: 4 }}>
          <Paper sx={{ p: 3, ...glassmorphismStyle }}>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, color: '#D4A017', fontFamily: '"Playfair Display", serif' }}>
              Visualizador 3D
            </Typography>
            <Suspense fallback={<Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress size={30} sx={{ color: '#D4A017' }} /></Box>}>
              <ARViewer bird={bird} />
            </Suspense>
          </Paper>
        </Box>
      </MotionDiv>

      {showActions && (
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
              startIcon={saving ? <CircularProgress size={20} /> : <SaveAltIcon />}
              sx={{
                flex: 1,
                py: 1.5,
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #2D5016, #D4A017)',
                fontWeight: 600,
                fontSize: '1rem',
                '&:hover': {
                  background: 'linear-gradient(135deg, #4A7C2F, #F5C842)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 20px rgba(212,160,23,0.3)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Guardar Avistamiento
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
      )}
    </Container>
  );
};
