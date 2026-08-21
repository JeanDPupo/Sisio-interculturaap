import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import {
  Box,
  Typography,
  Chip,
  Stack,
  IconButton,
  Avatar,
  Divider,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import CloseIcon from '@mui/icons-material/Close';
import FilterListIcon from '@mui/icons-material/FilterList';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import VisibilityIcon from '@mui/icons-material/Visibility';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useSightings } from '@sisio/shared';

const verdeSelva = '#2D5016';
const verdeMusgo = '#4A7C2F';
const verdeHoja = '#8BC34A';
const azulNoche = '#1A3A4A';
const azulCielo = '#2E7D9A';
const azulClaro = '#64B5F6';
const oroIndigena = '#D4A017';
const ambarSolar = '#F5C842';
const naranjaAtardecer = '#FF8F00';
const negroSelva = '#0D1B0F';
const blancoNiebla = '#F0F7EE';
const riesgoBajo = '#4CAF50';
const riesgoMedio = '#FFC107';
const riesgoAlto = '#F44336';

const glassmorphism = {
  background: 'rgba(13, 27, 15, 0.65)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 16,
  overflow: 'hidden',
};

const pulseKeyframes = `
@keyframes pulse-ring {
  0% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.6); opacity: 0; }
  100% { transform: scale(1); opacity: 0; }
}
@keyframes pulse-dot {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}
.leaflet-popup-content-wrapper {
  background: rgba(13, 27, 15, 0.85) !important;
  backdrop-filter: blur(12px) !important;
  -webkit-backdrop-filter: blur(12px) !important;
  border: 1px solid rgba(255,255,255,0.1) !important;
  border-radius: 12px !important;
  color: ${blancoNiebla} !important;
}
.leaflet-popup-tip {
  background: rgba(13, 27, 15, 0.85) !important;
}
.leaflet-popup-content {
  margin: 12px 16px !important;
  font-family: 'Inter', sans-serif !important;
}
.leaflet-popup-close-button {
  color: ${blancoNiebla} !important;
}
`;

interface MapSighting {
  id: string;
  bird?: {
    nombre_espanol?: string;
    ecosistema_riesgo?: 'bajo' | 'medio' | 'alto';
  };
  location: {
    latitude: number;
    longitude: number;
    address?: string;
    community?: string;
  };
  confidence?: number;
  timestamp?: string;
  created_at?: string;
  photo_url?: string;
}

const getRiskColor = (risk?: string) => {
  switch (risk) {
    case 'alto': return riesgoAlto;
    case 'medio': return riesgoMedio;
    default: return riesgoBajo;
  }
};

const createMarkerIcon = (color: string) => {
  return L.divIcon({
    className: '',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -20],
    html: `
      <div style="position:relative;width:32px;height:32px;display:flex;align-items:center;justify-content:center;">
        <div style="
          position:absolute;width:32px;height:32px;border-radius:50%;
          background:${color};opacity:0.25;
          animation:pulse-ring 2s ease-out infinite;
        "></div>
        <div style="
          position:absolute;width:16px;height:16px;border-radius:50%;
          background:${color};border:2px solid rgba(255,255,255,0.9);
          box-shadow:0 0 8px ${color};
          animation:pulse-dot 2s ease-in-out infinite;
        "></div>
      </div>
    `,
  });
};

const StatBar: React.FC<{ count: number }> = ({ count }) => (
  <Box
    sx={{
      position: 'fixed',
      bottom: { xs: 56, md: 0 },
      left: 0,
      right: 0,
      height: 56,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(13, 27, 15, 0.85)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderTop: '1px solid rgba(255,255,255,0.08)',
      zIndex: 1000,
    }}
  >
    <Stack direction="row" spacing={2} alignItems="center">
      <LocationOnIcon sx={{ color: verdeHoja, fontSize: 20 }} />
      <Typography variant="body2" sx={{ color: blancoNiebla, fontWeight: 600 }}>
        {count} avistamiento{count !== 1 ? 's' : ''} registrado{count !== 1 ? 's' : ''}
      </Typography>
    </Stack>
  </Box>
);

const LegendPanel: React.FC = () => (
  <Box
    sx={{
      ...glassmorphism,
      position: 'absolute',
      bottom: 76,
      left: 12,
      zIndex: 999,
      p: 1.5,
      minWidth: 150,
    }}
  >
    <Typography variant="caption" sx={{ color: ambarSolar, fontWeight: 700, mb: 1, display: 'block', letterSpacing: 1 }}>
      LEYENDA
    </Typography>
    <Stack spacing={1}>
      <Stack direction="row" spacing={1} alignItems="center">
        <img src="/assets/icons/risk/risk-low.svg" alt="low" style={{ width: 14, height: 14 }} />
        <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: riesgoBajo, boxShadow: `0 0 6px ${riesgoBajo}` }} />
        <Typography variant="caption" sx={{ color: blancoNiebla }}>Riesgo Bajo</Typography>
      </Stack>
      <Stack direction="row" spacing={1} alignItems="center">
        <img src="/assets/icons/risk/risk-medium.svg" alt="medium" style={{ width: 14, height: 14 }} />
        <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: riesgoMedio, boxShadow: `0 0 6px ${riesgoMedio}` }} />
        <Typography variant="caption" sx={{ color: blancoNiebla }}>Riesgo Medio</Typography>
      </Stack>
      <Stack direction="row" spacing={1} alignItems="center">
        <img src="/assets/icons/risk/risk-high.svg" alt="high" style={{ width: 14, height: 14 }} />
        <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: riesgoAlto, boxShadow: `0 0 6px ${riesgoAlto}` }} />
        <Typography variant="caption" sx={{ color: blancoNiebla }}>Riesgo Alto</Typography>
      </Stack>
    </Stack>
  </Box>
);

const FilterChips: React.FC<{
  species: string[];
  selectedSpecies: string[];
  onToggleSpecies: (s: string) => void;
  selectedRisk: string[];
  onToggleRisk: (r: string) => void;
}> = ({ species, selectedSpecies, onToggleSpecies, selectedRisk, onToggleRisk }) => (
  <Box
    sx={{
      position: 'absolute',
      top: 12,
      left: 0,
      right: 0,
      zIndex: 999,
      display: 'flex',
      justifyContent: 'center',
      px: 1,
    }}
  >
    <Box
      sx={{
        ...glassmorphism,
        p: 1,
        display: 'flex',
        gap: 0.5,
        flexWrap: 'wrap',
        justifyContent: 'center',
        maxWidth: '90vw',
      }}
    >
      <FilterListIcon sx={{ color: ambarSolar, fontSize: 18, alignSelf: 'center', mr: 0.5 }} />
      {['bajo', 'medio', 'alto'].map((risk) => (
        <Chip
          key={risk}
          label={risk.charAt(0).toUpperCase() + risk.slice(1)}
          size="small"
          onClick={() => onToggleRisk(risk)}
          sx={{
            height: 28,
            fontSize: '0.7rem',
            bgcolor: selectedRisk.includes(risk) ? getRiskColor(risk) : 'transparent',
            color: selectedRisk.includes(risk) ? '#fff' : blancoNiebla,
            border: `1px solid ${selectedRisk.includes(risk) ? getRiskColor(risk) : 'rgba(255,255,255,0.2)'}`,
            '&:hover': { bgcolor: selectedRisk.includes(risk) ? getRiskColor(risk) : 'rgba(255,255,255,0.1)' },
          }}
        />
      ))}
      <Divider orientation="vertical" flexItem sx={{ mx: 0.5, borderColor: 'rgba(255,255,255,0.15)' }} />
      {species.slice(0, 4).map((s) => (
        <Chip
          key={s}
          label={s}
          size="small"
          onClick={() => onToggleSpecies(s)}
          sx={{
            height: 28,
            fontSize: '0.7rem',
            bgcolor: selectedSpecies.includes(s) ? verdeMusgo : 'transparent',
            color: selectedSpecies.includes(s) ? '#fff' : blancoNiebla,
            border: `1px solid ${selectedSpecies.includes(s) ? verdeMusgo : 'rgba(255,255,255,0.2)'}`,
            '&:hover': { bgcolor: selectedSpecies.includes(s) ? verdeMusgo : 'rgba(255,255,255,0.1)' },
          }}
        />
      ))}
    </Box>
  </Box>
);

const DetailPanel: React.FC<{
  sighting: MapSighting | null;
  onClose: () => void;
  isMobile: boolean;
}> = ({ sighting, onClose, isMobile }) => {
  if (!sighting) return null;
  const riskColor = getRiskColor(sighting.bird?.ecosistema_riesgo);
  const birdName = sighting.bird?.nombre_espanol || 'Ave desconocida';
  const confidence = sighting.confidence ? Math.round(sighting.confidence * 100) : null;
  const date = sighting.timestamp || sighting.created_at;

  if (isMobile) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          style={{
            position: 'fixed',
            bottom: 56,
            left: 0,
            right: 0,
            zIndex: 1100,
          }}
        >
          <Box
            sx={{
              ...glassmorphism,
              borderRadius: '20px 20px 0 0',
              p: 3,
              maxHeight: '40vh',
              overflow: 'auto',
            }}
          >
            <Box sx={{ width: 40, height: 4, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.3)', mx: 'auto', mb: 2 }} />
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: riskColor, width: 48, height: 48 }}>
                  <VisibilityIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ color: blancoNiebla, fontWeight: 700, fontFamily: '"Playfair Display", serif' }}>
                    {birdName}
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: riskColor }} />
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                      {sighting.bird?.ecosistema_riesgo === 'alto' ? 'En riesgo' : sighting.bird?.ecosistema_riesgo === 'medio' ? 'Precaución' : 'Estable'}
                    </Typography>
                  </Stack>
                </Box>
              </Stack>
              <IconButton onClick={onClose} sx={{ color: blancoNiebla }}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Stack>
            <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.1)' }} />
            <Stack spacing={1.5}>
              {confidence !== null && (
                <Stack direction="row" spacing={1} alignItems="center">
                  <VisibilityIcon sx={{ color: azulClaro, fontSize: 18 }} />
                  <Typography variant="body2" sx={{ color: blancoNiebla }}>
                    Confianza: <strong>{confidence}%</strong>
                  </Typography>
                </Stack>
              )}
              {date && (
                <Stack direction="row" spacing={1} alignItems="center">
                  <CalendarTodayIcon sx={{ color: ambarSolar, fontSize: 18 }} />
                  <Typography variant="body2" sx={{ color: blancoNiebla }}>
                    {new Date(date).toLocaleDateString('es-CO', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </Typography>
                </Stack>
              )}
              {sighting.location && (
                <Stack direction="row" spacing={1} alignItems="center">
                  <LocationOnIcon sx={{ color: verdeHoja, fontSize: 18 }} />
                  <Typography variant="body2" sx={{ color: blancoNiebla }}>
                    {sighting.location.address || `${sighting.location.latitude.toFixed(4)}, ${sighting.location.longitude.toFixed(4)}`}
                  </Typography>
                </Stack>
              )}
            </Stack>
          </Box>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 56,
          width: 360,
          zIndex: 1001,
        }}
      >
        <Box
          sx={{
            height: '100%',
            ...glassmorphism,
            borderRadius: '16px 0 0 16px',
            p: 3,
            overflow: 'auto',
          }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
            <Typography
              variant="h5"
              sx={{
                color: blancoNiebla,
                fontWeight: 700,
                fontFamily: '"Playfair Display", serif',
              }}
            >
              Detalle del Avistamiento
            </Typography>
            <IconButton onClick={onClose} sx={{ color: blancoNiebla }}>
              <CloseIcon />
            </IconButton>
          </Stack>
          <Divider sx={{ mb: 3, borderColor: 'rgba(255,255,255,0.1)' }} />
          <Stack spacing={2.5}>
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                background: `linear-gradient(135deg, ${riskColor}22, ${riskColor}08)`,
                border: `1px solid ${riskColor}33`,
              }}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: riskColor, width: 56, height: 56 }}>
                  <VisibilityIcon sx={{ fontSize: 28 }} />
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ color: blancoNiebla, fontWeight: 700 }}>
                    {birdName}
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: riskColor, boxShadow: `0 0 8px ${riskColor}` }} />
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      Riesgo {sighting.bird?.ecosistema_riesgo || 'bajo'}
                    </Typography>
                  </Stack>
                </Box>
              </Stack>
            </Box>
            {confidence !== null && (
              <Box>
                <Typography variant="caption" sx={{ color: azulClaro, fontWeight: 600, letterSpacing: 1 }}>
                  CONFIANZA
                </Typography>
                <Box sx={{ mt: 1, mb: 0.5 }}>
                  <Box
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      bgcolor: 'rgba(255,255,255,0.1)',
                      overflow: 'hidden',
                    }}
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${confidence}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      style={{
                        height: '100%',
                        borderRadius: 3,
                        background: `linear-gradient(90deg, ${azulCielo}, ${azulClaro})`,
                      }}
                    />
                  </Box>
                </Box>
                <Typography variant="body2" sx={{ color: blancoNiebla, fontWeight: 600 }}>
                  {confidence}%
                </Typography>
              </Box>
            )}
            {date && (
              <Box>
                <Typography variant="caption" sx={{ color: ambarSolar, fontWeight: 600, letterSpacing: 1 }}>
                  FECHA
                </Typography>
                <Typography variant="body2" sx={{ color: blancoNiebla, mt: 0.5 }}>
                  {new Date(date).toLocaleDateString('es-CO', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </Typography>
              </Box>
            )}
            {sighting.location && (
              <Box>
                <Typography variant="caption" sx={{ color: verdeHoja, fontWeight: 600, letterSpacing: 1 }}>
                  UBICACIÓN
                </Typography>
                <Typography variant="body2" sx={{ color: blancoNiebla, mt: 0.5 }}>
                  {sighting.location.address || 'Sin dirección registrada'}
                </Typography>
                {sighting.location.community && (
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', display: 'block', mt: 0.5 }}>
                    Comunidad: {sighting.location.community}
                  </Typography>
                )}
              </Box>
            )}
          </Stack>
        </Box>
      </motion.div>
    </AnimatePresence>
  );
};

export const MapPage: React.FC = () => {
  const { sightings, loading } = useSightings();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const [selectedSighting, setSelectedSighting] = useState<MapSighting | null>(null);
  const [selectedSpecies, setSelectedSpecies] = useState<string[]>([]);
  const [selectedRisk, setSelectedRisk] = useState<string[]>([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const typedSightings = useMemo(() => (sightings || []) as unknown as MapSighting[], [sightings]);

  const filteredSightings = useMemo(() => {
    return typedSightings.filter((s) => {
      if (!s.location?.latitude || !s.location?.longitude) return false;
      if (selectedSpecies.length > 0) {
        const birdName = s.bird?.nombre_espanol || '';
        if (!selectedSpecies.includes(birdName)) return false;
      }
      if (selectedRisk.length > 0) {
        const risk = s.bird?.ecosistema_riesgo || 'bajo';
        if (!selectedRisk.includes(risk)) return false;
      }
      return true;
    });
  }, [typedSightings, selectedSpecies, selectedRisk]);

  const uniqueSpecies = useMemo(() => {
    const names = new Set<string>();
    typedSightings.forEach((s) => {
      if (s.bird?.nombre_espanol) names.add(s.bird.nombre_espanol);
    });
    return Array.from(names);
  }, [typedSightings]);

  const toggleSpecies = useCallback((species: string) => {
    setSelectedSpecies((prev) =>
      prev.includes(species) ? prev.filter((s) => s !== species) : [...prev, species]
    );
  }, []);

  const toggleRisk = useCallback((risk: string) => {
    setSelectedRisk((prev) =>
      prev.includes(risk) ? prev.filter((r) => r !== risk) : [...prev, risk]
    );
  }, []);

  useEffect(() => {
    if (mapInstanceRef.current) return;
    if (!mapRef.current) return;

    const map = L.map(mapRef.current, {
      zoomControl: false,
      attributionControl: true,
    }).setView([10.8, -73.5], 10);

    L.control.zoom({ position: 'topright' }).addTo(map);

    L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
      attribution:
        '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 20,
    }).addTo(map);

    const markersLayer = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;
    markersLayerRef.current = markersLayer;

    setTimeout(() => map.invalidateSize(), 100);
  }, []);

  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer) return;

    markersLayer.clearLayers();

    filteredSightings.forEach((sighting) => {
      const color = getRiskColor(sighting.bird?.ecosistema_riesgo);
      const icon = createMarkerIcon(color);

      const marker = L.marker([sighting.location.latitude, sighting.location.longitude], { icon })
        .addTo(markersLayer);

      const birdName = sighting.bird?.nombre_espanol || 'Ave desconocida';
      const confidence = sighting.confidence ? Math.round(sighting.confidence * 100) : null;
      const date = sighting.timestamp || sighting.created_at;
      const dateStr = date ? new Date(date).toLocaleDateString('es-CO') : '';

      const popupContent = `
        <div style="min-width:140px;">
          <div style="font-weight:700;font-size:14px;margin-bottom:4px;">${birdName}</div>
          ${confidence !== null ? `<div style="font-size:12px;color:rgba(255,255,255,0.7);margin-bottom:2px;">Confianza: ${confidence}%</div>` : ''}
          ${dateStr ? `<div style="font-size:11px;color:rgba(255,255,255,0.5);">${dateStr}</div>` : ''}
        </div>
      `;

      marker.bindPopup(popupContent, {
        closeButton: false,
        className: 'dark-popup',
      });

      marker.on('click', () => setSelectedSighting(sighting));
    });
  }, [filteredSightings]);

  return (
    <Box sx={{ position: 'relative', width: '100%', height: { xs: 'calc(100vh - 56px - 56px)', md: '100vh' }, overflow: 'hidden' }}>
      <style>{pulseKeyframes}</style>
      <Box
        ref={mapRef}
        sx={{
          width: '100%',
          height: '100%',
          bgcolor: negroSelva,
        }}
      />
      {loading && (
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1200,
            ...glassmorphism,
            p: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <CircularProgress size={24} sx={{ color: verdeHoja }} />
          <Typography variant="body2" sx={{ color: blancoNiebla }}>
            Cargando avistamientos...
          </Typography>
        </Box>
      )}
      <FilterChips
        species={uniqueSpecies}
        selectedSpecies={selectedSpecies}
        onToggleSpecies={toggleSpecies}
        selectedRisk={selectedRisk}
        onToggleRisk={toggleRisk}
      />
      <LegendPanel />
      <DetailPanel
        sighting={selectedSighting}
        onClose={() => setSelectedSighting(null)}
        isMobile={isMobile}
      />
      <StatBar count={filteredSightings.length} />
    </Box>
  );
};
