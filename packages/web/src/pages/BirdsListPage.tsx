import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  CardContent,
  CardActionArea,
  Box,
  TextField,
  InputAdornment,
  Chip,
  Skeleton,
  styled,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { motion, AnimatePresence } from 'framer-motion';
import { useBird, Bird } from '@sisio/shared';

const MotionDiv = motion.div;

const BIRD_PHOTOS: Record<string, string> = {
  'aguila': '/assets/images/birds/aguila-real.jpg',
  'colibr': '/assets/images/birds/colibri-garganta-roja.jpg',
  'flamenco': '/assets/images/birds/flamenco-andino.jpg',
  'loro': '/assets/images/birds/loro-verde.jpg',
  'tucan': '/assets/images/birds/tucan-toco.jpg',
  'turpial': '/assets/images/birds/turpial.jpg',
};

const AR_PHOTOS: Record<string, string> = {
  'turpial': '/assets/images/birds/turpial-ar.jpg',
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

const glassmorphismStyle = {
  backdropFilter: 'blur(20px)',
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: '20px',
};

const shimmerKeyframes = `
@keyframes shimmerGold {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
@keyframes pulse {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.7; }
}
`;

const skeletonPulse = {
  animation: 'pulse 1.5s ease-in-out infinite',
  background: 'rgba(255,255,255,0.05)',
  borderRadius: '16px',
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

export const BirdsListPage: React.FC = () => {
  const navigate = useNavigate();
  const { birds, loading, getBirds, searchBirds } = useBird();
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState<string | null>(null);
  const [habitatFilter, setHabitatFilter] = useState<string | null>(null);
  const [migratoryFilter, setMigratoryFilter] = useState<boolean | null>(null);

  useEffect(() => {
    getBirds(100, 0);
  }, [getBirds]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setSearchQuery(q);
    if (q.trim()) {
      searchBirds(q.trim());
    } else {
      getBirds(100, 0);
    }
  };

  const filteredBirds = useMemo(() => {
    return birds.filter((bird: Bird) => {
      if (riskFilter && bird.ecosistema_riesgo !== riskFilter) return false;
      if (habitatFilter && bird.habitat !== habitatFilter) return false;
      if (migratoryFilter !== null && bird.es_migratoria !== migratoryFilter) return false;
      return true;
    });
  }, [birds, riskFilter, habitatFilter, migratoryFilter]);

  const habitats = useMemo(() => {
    const set = new Set<string>();
    birds.forEach((b: Bird) => {
      if (b.habitat) set.add(b.habitat);
    });
    return Array.from(set).slice(0, 5);
  }, [birds]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.95,
      transition: { duration: 0.25 },
    },
  };

  const getRiskIcon = (risk: string) => {
    const src = RISK_ICONS[risk] || RISK_ICONS.bajo;
    return <img src={src} alt={risk} style={{ width: 16, height: 16, verticalAlign: 'middle' }} />;
  };

  return (
    <>
      <style>{shimmerKeyframes}</style>
      <Container maxWidth="lg" sx={{ py: 4, pb: '120px' }}>
        <Typography
          variant="h4"
          sx={{
            mb: 1,
            fontWeight: 'bold',
            fontFamily: '"Playfair Display", serif',
            color: '#F0F7EE',
          }}
        >
          Aves de la Sierra Nevada
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, color: '#b0c4a0' }}>
          Catálogo de aves registradas con su conocimiento ancestral
        </Typography>

        <TextField
          fullWidth
          variant="outlined"
          placeholder="Buscar ave por nombre científico, español o nativo..."
          value={searchQuery}
          onChange={handleSearch}
          sx={{
            mb: 3,
            ...glassmorphismStyle,
            '& .MuiOutlinedInput-root': {
              borderRadius: '16px',
              color: '#F0F7EE',
              '& fieldset': { border: '1px solid rgba(255,255,255,0.15)' },
              '&:hover fieldset': { border: '1px solid rgba(212,160,23,0.4)' },
              '&.Mui-focused fieldset': { border: '1px solid #D4A017' },
            },
            '& input::placeholder': { color: 'rgba(255,255,255,0.4)' },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#D4A017' }} />
              </InputAdornment>
            ),
          }}
        />

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
          {(['bajo', 'medio', 'alto'] as const).map((risk) => (
            <MotionDiv
              key={risk}
              onClick={() => setRiskFilter(riskFilter === risk ? null : risk)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Box
                sx={{
                  borderRadius: '12px',
                  fontWeight: 600,
                  color: riskFilter === risk ? '#0D1B0F' : riskColorMap[risk],
                  background: riskFilter === risk ? riskColorMap[risk] : riskBgMap[risk],
                  border: `1px solid ${riskColorMap[risk]}40`,
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  px: 1.5,
                  py: 0.5,
                }}
              >
                <img src={RISK_ICONS[risk]} alt={risk} style={{ width: 16, height: 16 }} />
                {risk.charAt(0).toUpperCase() + risk.slice(1)}
              </Box>
            </MotionDiv>
          ))}

          <Box sx={{ width: 1, height: 0 }} />

          {habitats.map((habitat) => (
            <MotionDiv
              key={habitat}
              onClick={() => setHabitatFilter(habitatFilter === habitat ? null : habitat)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Box
                sx={{
                  borderRadius: '12px',
                  fontWeight: 500,
                  color: habitatFilter === habitat ? '#0D1B0F' : '#64B5F6',
                  background: habitatFilter === habitat ? '#64B5F6' : 'rgba(100,181,246,0.12)',
                  border: '1px solid rgba(100,181,246,0.3)',
                  transition: 'all 0.3s ease',
                  px: 1.5,
                  py: 0.5,
                }}
              >
                {habitat}
              </Box>
            </MotionDiv>
          ))}

            <MotionDiv
              onClick={() => setMigratoryFilter(migratoryFilter === true ? null : true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Box
                sx={{
                  borderRadius: '12px',
                  fontWeight: 500,
                  color: migratoryFilter === true ? '#0D1B0F' : '#8BC34A',
                  background: migratoryFilter === true ? '#8BC34A' : 'rgba(139,195,74,0.12)',
                  border: '1px solid rgba(139,195,74,0.3)',
                  transition: 'all 0.3s ease',
                  px: 1.5,
                  py: 0.5,
                }}
              >
                {migratoryFilter === true ? 'Migratoria' : 'No migratoria'}
              </Box>
            </MotionDiv>
        </Box>

        {loading ? (
          <Grid container spacing={3}>
            {Array.from({ length: 8 }).map((_, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <Box sx={skeletonPulse}>
                  <Skeleton
                    variant="rectangular"
                    height={160}
                    sx={{ borderRadius: '20px 20px 0 0', bgcolor: 'rgba(255,255,255,0.04)' }}
                  />
                  <Box sx={{ p: 2 }}>
                    <Skeleton variant="text" width="70%" sx={{ bgcolor: 'rgba(255,255,255,0.06)' }} />
                    <Skeleton variant="text" width="50%" sx={{ bgcolor: 'rgba(255,255,255,0.04)' }} />
                    <Skeleton variant="text" width="40%" sx={{ bgcolor: 'rgba(255,255,255,0.03)' }} />
                    <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                      <Skeleton variant="rectangular" width={60} height={24} sx={{ borderRadius: 8, bgcolor: 'rgba(255,255,255,0.04)' }} />
                      <Skeleton variant="rectangular" width={80} height={24} sx={{ borderRadius: 8, bgcolor: 'rgba(255,255,255,0.03)' }} />
                    </Box>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        ) : filteredBirds.length === 0 ? (
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Box
              sx={{
                textAlign: 'center',
                py: 10,
                ...glassmorphismStyle,
                mx: 'auto',
                maxWidth: 400,
              }}
            >
            <img
              src="/assets/images/empty-states/no-results.jpg"
              alt="No results"
              style={{ maxWidth: 200, margin: '0 auto', display: 'block', borderRadius: 12 }}
            />
            <Typography variant="h6" sx={{ color: '#b0c4a0', mb: 1, mt: 2 }}>
              No se encontraron aves
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)' }}>
              Intenta con otros filtros o términos de búsqueda
            </Typography>
            </Box>
          </MotionDiv>
        ) : (
          <AnimatePresence mode="wait">
            <MotionDiv
              key={`${riskFilter}-${habitatFilter}-${migratoryFilter}`}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <Grid container spacing={3}>
                {filteredBirds.map((bird: Bird) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={bird.id}>
                    <MotionDiv
                      variants={cardVariants}
                      whileHover={{
                        scale: 1.02,
                        borderColor: 'rgba(212,160,23,0.5)',
                        boxShadow: '0 0 20px rgba(212,160,23,0.2), 0 8px 32px rgba(0,0,0,0.3)',
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <Box
                        sx={{
                          ...glassmorphismStyle,
                          cursor: 'pointer',
                          overflow: 'hidden',
                          position: 'relative',
                          '&::after': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'linear-gradient(90deg, transparent, rgba(212,160,23,0.08), transparent)',
                            backgroundSize: '200% 100%',
                            opacity: 0,
                            transition: 'opacity 0.3s ease',
                            pointerEvents: 'none',
                          },
                          '&:hover::after': {
                            opacity: 1,
                            animation: 'shimmerGold 1.5s ease-in-out infinite',
                          },
                        }}
                      >
                      <CardActionArea onClick={() => navigate(`/bird/${bird.id}`)}>
                        <Box
                          sx={{
                            height: 160,
                            background: 'linear-gradient(135deg, rgba(45,80,22,0.3), rgba(26,58,74,0.3))',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 64,
                            overflow: 'hidden',
                            position: 'relative',
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
                                transition: 'transform 0.5s ease',
                                '&:hover': { transform: 'scale(1.1)' },
                              }}
                            />
                          ) : (
                            (() => {
                              const photoSrc = getBirdPhoto(bird.nombre_espanol || '') || getBirdPhoto(bird.nombre_cientifico || '');
                              if (photoSrc) {
                                return (
                                  <img
                                    src={photoSrc}
                                    alt={bird.nombre_espanol || bird.nombre_cientifico}
                                    style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 12 }}
                                  />
                                );
                              }
                              return <Typography sx={{ fontSize: '4rem' }}>🦅</Typography>;
                            })()
                          )}
                        </Box>
                        <CardContent sx={{ p: 2.5 }}>
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 600,
                              mb: 0.5,
                              color: '#F0F7EE',
                              fontSize: { xs: '1rem', md: '1.1rem' },
                              lineHeight: 1.3,
                            }}
                          >
                            {bird.nombre_espanol || bird.nombre_cientifico}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              fontStyle: 'italic',
                              color: '#b0c4a0',
                              mb: 0.5,
                              fontSize: '0.85rem',
                            }}
                          >
                            {bird.nombre_cientifico}
                          </Typography>
                          {bird.nombre_nativo && (
                            <Typography
                              variant="caption"
                              display="block"
                              sx={{
                                mb: 1,
                                color: '#D4A017',
                                fontFamily: '"Lora", serif',
                                fontSize: '0.8rem',
                              }}
                            >
                              {bird.nombre_nativo}
                              {bird.lengua && (
                                <span style={{ color: '#b0c4a0', fontStyle: 'italic' }}>
                                  {' '}({bird.lengua})
                                </span>
                              )}
                            </Typography>
                          )}
                          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            <Chip
                              size="small"
                              icon={<img src={RISK_ICONS[bird.ecosistema_riesgo] || RISK_ICONS.bajo} alt={bird.ecosistema_riesgo} style={{ width: 14, height: 14 }} />}
                              label={bird.ecosistema_riesgo}
                              sx={{
                                fontWeight: 600,
                                borderRadius: '8px',
                                color: riskColorMap[bird.ecosistema_riesgo],
                                background: riskBgMap[bird.ecosistema_riesgo],
                                border: `1px solid ${riskColorMap[bird.ecosistema_riesgo]}30`,
                                fontSize: '0.75rem',
                              }}
                            />
                            {bird.zona_geografica && (
                              <Chip
                                size="small"
                                label={`📍 ${bird.zona_geografica}`}
                                sx={{
                                  borderRadius: '8px',
                                  color: '#64B5F6',
                                  background: 'rgba(100,181,246,0.12)',
                                  border: '1px solid rgba(100,181,246,0.3)',
                                  fontSize: '0.75rem',
                                }}
                              />
                            )}
                          </Box>
                        </CardContent>
                      </CardActionArea>
                      </Box>
                    </MotionDiv>
                  </Grid>
                ))}
              </Grid>
            </MotionDiv>
          </AnimatePresence>
        )}
      </Container>
    </>
  );
};
