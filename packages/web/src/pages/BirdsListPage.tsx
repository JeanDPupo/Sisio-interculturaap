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
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { motion, AnimatePresence } from 'framer-motion';
import { useBird, Bird } from '@sisio/shared';

const MotionDiv = motion.div;

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
    switch (risk) {
      case 'alto': return '🛡️';
      case 'medio': return '⚠️';
      default: return '🍃';
    }
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
              label={`${getRiskIcon(risk)} ${risk.charAt(0).toUpperCase() + risk.slice(1)}`}
              onClick={() => setRiskFilter(riskFilter === risk ? null : risk)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              sx={{
                borderRadius: '12px',
                fontWeight: 600,
                color: riskFilter === risk ? '#0D1B0F' : riskColorMap[risk],
                background: riskFilter === risk ? riskColorMap[risk] : riskBgMap[risk],
                border: `1px solid ${riskColorMap[risk]}40`,
                transition: 'all 0.3s ease',
              }}
            />
          ))}

          <Box sx={{ width: 1, height: 0 }} />

          {habitats.map((habitat) => (
            <MotionDiv
              key={habitat}
              label={habitat}
              onClick={() => setHabitatFilter(habitatFilter === habitat ? null : habitat)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              sx={{
                borderRadius: '12px',
                fontWeight: 500,
                color: habitatFilter === habitat ? '#0D1B0F' : '#64B5F6',
                background: habitatFilter === habitat ? '#64B5F6' : 'rgba(100,181,246,0.12)',
                border: '1px solid rgba(100,181,246,0.3)',
                transition: 'all 0.3s ease',
              }}
            />
          ))}

          <MotionDiv
            label={migratoryFilter === true ? '🐦 Migratoria' : '🐦 No migratoria'}
            onClick={() => setMigratoryFilter(migratoryFilter === true ? null : true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            sx={{
              borderRadius: '12px',
              fontWeight: 500,
              color: migratoryFilter === true ? '#0D1B0F' : '#8BC34A',
              background: migratoryFilter === true ? '#8BC34A' : 'rgba(139,195,74,0.12)',
              border: '1px solid rgba(139,195,74,0.3)',
              transition: 'all 0.3s ease',
            }}
          />
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
            sx={{
              textAlign: 'center',
              py: 10,
              ...glassmorphismStyle,
              mx: 'auto',
              maxWidth: 400,
            }}
          >
            <Typography variant="h1" sx={{ fontSize: '5rem', mb: 2 }}>
              🦅
            </Typography>
            <Typography variant="h6" sx={{ color: '#b0c4a0', mb: 1 }}>
              No se encontraron aves
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)' }}>
              Intenta con otros filtros o términos de búsqueda
            </Typography>
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
                            <Typography sx={{ fontSize: '4rem' }}>🦅</Typography>
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
                              label={`${getRiskIcon(bird.ecosistema_riesgo)} ${bird.ecosistema_riesgo}`}
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
