import React, { useEffect, useState } from 'react';
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  CircularProgress,
  Chip,
} from '@mui/material';
import { useAuth, useSightings } from '@sisio/shared';

export const SightingsPage: React.FC = () => {
  const { user } = useAuth();
  const { sightings, loading, getSightings } = useSightings();

  useEffect(() => {
    if (user?.id) {
      getSightings(user.id);
    }
  }, [user?.id]);

  if (loading) {
    return (
      <Container sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (sightings.length === 0) {
    return (
      <Container sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h6">Sin avistamientos aún</Typography>
        <Typography variant="body2" color="textSecondary">
          Captura fotos o audios de aves para crear tu primer avistamiento
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Mis Avistamientos
        </Typography>
        <Chip label={`${sightings.length} total`} color="primary" variant="outlined" />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#f5f5f5' }}>
              <TableCell sx={{ fontWeight: 600 }}>Ave</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Fecha</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="right">
                Confianza
              </TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Riesgo</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sightings.map((sighting) => (
              <TableRow key={sighting.id} hover>
                <TableCell>{sighting.bird_name || 'Ave desconocida'}</TableCell>
                <TableCell>
                  {new Date(sighting.created_at).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </TableCell>
                <TableCell align="right">
                  <Chip
                    label={`${Math.round((sighting.confidence || 0) * 100)}%`}
                    size="small"
                    color="success"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={sighting.ecosystem_risk?.toUpperCase() || 'N/A'}
                    size="small"
                    variant={
                      sighting.ecosystem_risk === 'alto'
                        ? 'filled'
                        : 'outlined'
                    }
                    color={
                      sighting.ecosystem_risk === 'alto'
                        ? 'error'
                        : 'default'
                    }
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};
