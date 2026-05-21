import React, { useEffect, useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  CircularProgress,
  Chip,
  Stack,
  Card,
  CardContent,
} from '@mui/material';
import { useSightings } from '@sisio/shared';

export const MapPage: React.FC = () => {
  const { sightings, loading } = useSightings();
  const [selectedSighting, setSelectedSighting] = useState<any>(null);
  const mapRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Lazy load Leaflet to avoid SSR issues
    const loadMap = async () => {
      if (!mapRef.current || !window.L) {
        const L = await import('leaflet').then(m => m.default);
        const map = L.map(mapRef.current!).setView([4.5709, -74.2973], 5); // Colombia center

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19,
        }).addTo(map);

        sightings.forEach((sighting: any) => {
          if (sighting.location?.latitude && sighting.location?.longitude) {
            const color =
              sighting.bird?.ecosistema_riesgo === 'alto' ? '#ff6b6b' :
              sighting.bird?.ecosistema_riesgo === 'medio' ? '#ffa94d' :
              '#51cf66';

            L.circleMarker([sighting.location.latitude, sighting.location.longitude], {
              radius: 8,
              fillColor: color,
              color: '#333',
              weight: 1,
              opacity: 1,
              fillOpacity: 0.8,
            })
              .bindPopup(`<strong>${sighting.bird?.nombre_espanol}</strong><br>${sighting.location.lugar}`)
              .addTo(map)
              .on('click', () => setSelectedSighting(sighting));
          }
        });
      }
    };

    loadMap();
  }, [sightings]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
        🗺️ Mapa de Avistamientos
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 300px' }, gap: 2 }}>
        {loading ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Paper
              ref={mapRef}
              sx={{
                width: '100%',
                height: 500,
                borderRadius: 2,
                overflow: 'hidden',
                bgcolor: '#f0f0f0',
              }}
            >
              {!window.L && <Typography>Cargando mapa...</Typography>}
            </Paper>

            <Box>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                📍 Leyenda
              </Typography>
              <Stack spacing={1}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 16, height: 16, borderRadius: '50%', bgcolor: '#51cf66' }} />
                  <Typography variant="body2">Riesgo bajo</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 16, height: 16, borderRadius: '50%', bgcolor: '#ffa94d' }} />
                  <Typography variant="body2">Riesgo medio</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 16, height: 16, borderRadius: '50%', bgcolor: '#ff6b6b' }} />
                  <Typography variant="body2">Riesgo alto</Typography>
                </Box>
              </Stack>

              {selectedSighting && (
                <Card sx={{ mt: 3 }}>
                  <CardContent>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                      {selectedSighting.bird?.nombre_espanol}
                    </Typography>
                    <Typography variant="caption" sx={{ display: 'block', mb: 1, color: '#666' }}>
                      {selectedSighting.location?.lugar}
                    </Typography>
                    <Chip
                      label={`Confianza: ${Math.round((selectedSighting.confidence || 0) * 100)}%`}
                      size="small"
                      variant="outlined"
                    />
                  </CardContent>
                </Card>
              )}
            </Box>
          </>
        )}
      </Box>

      <Card sx={{ mt: 3, bgcolor: '#e3f2fd' }}>
        <CardContent>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
            📊 Estadísticas
          </Typography>
          <Typography variant="body2">
            Total de avistamientos: <strong>{sightings.length}</strong>
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};
