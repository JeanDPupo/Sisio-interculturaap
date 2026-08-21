import React, { useEffect, useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Chip,
  Skeleton,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth, useSightings } from '@sisio/shared';

const COLORS = {
  verdeSelva: '#2D5016',
  verdeMusgo: '#4A7C2F',
  verdeHoja: '#8BC34A',
  azulNoche: '#1A3A4A',
  azulCielo: '#2E7D9A',
  azulClaro: '#64B5F6',
  oroIndigena: '#D4A017',
  ambarSolar: '#F5C842',
  naranjaAtardecer: '#FF8F00',
  negroSelva: '#0D1B0F',
  blancoNiebla: '#F0F7EE',
  riesgoBajo: '#4CAF50',
  riesgoMedio: '#FFC107',
  riesgoAlto: '#F44336',
};

const glassmorphism = {
  background: 'rgba(255, 255, 255, 0.7)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  borderRadius: '16px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
  overflow: 'hidden',
};

const getRiskColor = (risk?: string) => {
  switch (risk) {
    case 'alto':
      return { bg: COLORS.riesgoAlto + '20', color: COLORS.riesgoAlto, label: 'Alto' };
    case 'medio':
      return { bg: COLORS.riesgoMedio + '20', color: COLORS.riesgoMedio, label: 'Medio' };
    case 'bajo':
      return { bg: COLORS.riesgoBajo + '20', color: COLORS.riesgoBajo, label: 'Bajo' };
    default:
      return { bg: 'rgba(0,0,0,0.06)', color: 'text.secondary', label: 'N/A' };
  }
};

const getConfidenceColor = (confidence: number) => {
  if (confidence >= 80) return COLORS.verdeMusgo;
  if (confidence >= 50) return COLORS.ambarSolar;
  return COLORS.naranjaAtardecer;
};

const SkeletonCard: React.FC = () => (
  <Box sx={{ ...glassmorphism, p: 2.5 }}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
      <Skeleton variant="text" width="50%" height={28} />
      <Skeleton variant="rounded" width={60} height={24} />
    </Box>
    <Skeleton variant="text" width="30%" height={20} />
    <Box sx={{ display: 'flex', gap: 1, mt: 1.5 }}>
      <Skeleton variant="rounded" width={70} height={24} />
      <Skeleton variant="rounded" width={50} height={24} />
    </Box>
  </Box>
);

export const SightingsPage: React.FC = () => {
  const { user } = useAuth();
  const { sightings, loading, getSightings } = useSightings();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [skeletonLoading, setSkeletonLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      getSightings(user.id).finally(() => setSkeletonLoading(false));
    } else {
      setSkeletonLoading(false);
    }
  }, [user?.id, getSightings]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography
            variant="h5"
            sx={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 700,
              color: COLORS.negroSelva,
            }}
          >
            Mis Avistamientos
          </Typography>
          <Chip
            icon={<VisibilityIcon sx={{ fontSize: 16 }} />}
            label={`${sightings.length} total`}
            sx={{
              bgcolor: COLORS.verdeHoja + '20',
              color: COLORS.verdeSelva,
              fontWeight: 600,
              borderRadius: 2,
            }}
          />
        </Box>
      </motion.div>

      {loading || skeletonLoading ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          {[1, 2, 3, 4].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </Box>
      ) : sightings.length === 0 ? (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <Box
            sx={{
              ...glassmorphism,
              p: 6,
              textAlign: 'center',
            }}
          >
            <Box
              sx={{
                width: 200,
                height: 140,
                mx: 'auto',
                mb: 3,
                borderRadius: 3,
                overflow: 'hidden',
                background: `linear-gradient(135deg, ${COLORS.blancoNiebla}, ${COLORS.azulClaro}20)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img
                src="/assets/images/empty-states/no-sightings.jpg"
                alt="Sin avistamientos"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 600,
                color: COLORS.negroSelva,
                mb: 1,
              }}
            >
              Sin avistamientos aún
            </Typography>
            <Typography variant="body2" sx={{ color: COLORS.azulCielo, maxWidth: 320, mx: 'auto' }}>
              Captura fotos o audios de aves para crear tu primer avistamiento
            </Typography>
          </Box>
        </motion.div>
      ) : isMobile ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <AnimatePresence>
            {sightings.map((sighting, idx) => {
              const risk = getRiskColor(sighting.ecosystem_risk);
              const confidence = Math.round((sighting.confidence || 0) * 100);
              return (
                <motion.div
                  key={sighting.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Box
                    sx={{
                      ...glassmorphism,
                      p: 2.5,
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12)',
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 600,
                          color: COLORS.negroSelva,
                          lineHeight: 1.3,
                        }}
                      >
                        {sighting.bird?.nombre_espanol || sighting.bird?.nombre_cientifico || 'Ave desconocida'}
                      </Typography>
                      <Chip
                        label={risk.label}
                        size="small"
                        sx={{
                          bgcolor: risk.bg,
                          color: risk.color,
                          fontWeight: 600,
                          borderRadius: 1.5,
                          fontSize: '0.7rem',
                        }}
                      />
                    </Box>

                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1.5 }}>
                      {new Date(sighting.created_at).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                          bgcolor: getConfidenceColor(confidence) + '15',
                          px: 1,
                          py: 0.3,
                          borderRadius: 1.5,
                        }}
                      >
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            bgcolor: getConfidenceColor(confidence),
                          }}
                        />
                        <Typography
                          variant="caption"
                          sx={{ fontWeight: 600, color: COLORS.negroSelva }}
                        >
                          {confidence}%
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </Box>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ ...glassmorphism, overflow: 'hidden' }}>
            <Box
              component="table"
              sx={{
                width: '100%',
                borderCollapse: 'collapse',
              }}
            >
              <Box component="thead">
                <Box component="tr">
                  {['Ave', 'Fecha', 'Confianza', 'Riesgo'].map((header) => (
                    <Box
                      key={header}
                      component="th"
                      sx={{
                        px: 3,
                        py: 2,
                        textAlign: header === 'Confianza' ? 'right' : 'left',
                        fontWeight: 600,
                        color: COLORS.negroSelva,
                        borderBottom: `2px solid ${COLORS.oroIndigena}30`,
                        bgcolor: `${COLORS.oroIndigena}08`,
                        fontSize: '0.85rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                    >
                      {header}
                    </Box>
                  ))}
                </Box>
              </Box>
              <Box component="tbody">
                {sightings.map((sighting, idx) => {
                  const risk = getRiskColor(sighting.ecosystem_risk);
                  const confidence = Math.round((sighting.confidence || 0) * 100);
                  return (
                    <motion.tr
                      key={sighting.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.03 }}
                      style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}
                    >
                      <td
                        style={{
                          px: 12,
                          py: 12,
                          fontWeight: 500,
                          color: '#0D1B0F',
                        }}
                      >
                        {sighting.bird?.nombre_espanol || sighting.bird?.nombre_cientifico || 'Ave desconocida'}
                      </td>
                      <td style={{ px: 12, py: 12, color: '#666' }}>
                        {new Date(sighting.created_at).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                      <td style={{ px: 12, py: 12, textAlign: 'right' }}>
                        <Box
                          sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 0.5,
                            bgcolor: getConfidenceColor(confidence) + '15',
                            px: 1.2,
                            py: 0.3,
                            borderRadius: 1.5,
                          }}
                        >
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              bgcolor: getConfidenceColor(confidence),
                            }}
                          />
                          <Typography
                            variant="caption"
                            sx={{ fontWeight: 600, color: COLORS.negroSelva }}
                          >
                            {confidence}%
                          </Typography>
                        </Box>
                      </td>
                      <td style={{ px: 12, py: 12 }}>
                        <Box
                          sx={{
                            display: 'inline-block',
                            px: 1.2,
                            py: 0.3,
                            borderRadius: 1.5,
                            bgcolor: risk.bg,
                            color: risk.color,
                            fontWeight: 600,
                            fontSize: '0.75rem',
                          }}
                        >
                          {risk.label}
                        </Box>
                      </td>
                    </motion.tr>
                  );
                })}
              </Box>
            </Box>
          </Box>
        </motion.div>
      )}
    </Container>
  );
};
