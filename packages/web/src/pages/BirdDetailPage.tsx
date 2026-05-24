import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, CircularProgress, Box, Button } from '@mui/material';
import { useBird } from '@sisio/shared';
import { BirdDetailView } from '../components/BirdDetailView';

export const BirdDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentBird, loading, error, getBirdById } = useBird();

  useEffect(() => {
    if (id) {
      getBirdById(id);
    }
  }, [id, getBirdById]);

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
          Cargando información del ave...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
        <Button variant="contained" onClick={() => navigate('/birds')} sx={{ mt: 2 }}>
          Volver al catálogo
        </Button>
      </Container>
    );
  }

  if (!currentBird) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="error">
          Ave no encontrada
        </Typography>
        <Button variant="contained" onClick={() => navigate('/birds')} sx={{ mt: 2 }}>
          Volver al catálogo
        </Button>
      </Container>
    );
  }

  return <BirdDetailView bird={currentBird} showActions={false} />;
};
