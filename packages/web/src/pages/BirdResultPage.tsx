import React from 'react';
import { Container, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useBirdStore } from '@sisio/shared';
import { BirdDetailView } from '../components/BirdDetailView';

export const BirdResultPage: React.FC = () => {
  const navigate = useNavigate();
  const { identificationResult } = useBirdStore();

  if (!identificationResult?.bird) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="error">
          No hay resultado de identificación
        </Typography>
        <Button variant="contained" onClick={() => navigate('/')} sx={{ mt: 2 }}>
          Volver al inicio
        </Button>
      </Container>
    );
  }

  return (
    <BirdDetailView
      bird={identificationResult.bird}
      confidence={identificationResult.confidence || 0}
    />
  );
};
