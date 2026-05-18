import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  LinearProgress,
  CircularProgress,
  Card,
  CardContent,
  Stack,
  Chip,
} from '@mui/material';
import { useBirdStore, useAuth, useSightings } from '@sisio/shared';

export const BirdResultPage: React.FC = () => {
  const navigate = useNavigate();
  const { identificationResult } = useBirdStore();
  const { user } = useAuth();
  const { createSighting } = useSightings();
  const [saving, setSaving] = useState(false);

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

  const bird = identificationResult.bird;
  const confidence = identificationResult.confidence || 0;

  const handleSaveSighting = async () => {
    setSaving(true);
    try {
      await createSighting({
        bird_id: bird.id,
        user_id: user?.id,
        confidence: confidence,
        ecosystem_risk: bird.ecosistema_riesgo,
      });
      alert('Avistamiento guardado');
      navigate('/');
    } catch (error) {
      alert('Error al guardar avistamiento');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 4, textAlign: 'center', mb: 3 }}>
        <Typography variant="h2" sx={{ mb: 2 }}>
          🦅
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
          {bird.nombre_espanol || bird.nombre_cientifico}
        </Typography>
        <Typography variant="body1" sx={{ fontStyle: 'italic', color: '#666', mb: 2 }}>
          {bird.nombre_cientifico}
        </Typography>

        {bird.nombre_nativo && (
          <Typography variant="body2" sx={{ mb: 2 }}>
            Nombre nativo: <strong>{bird.nombre_nativo}</strong> ({bird.lengua})
          </Typography>
        )}

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            Confianza en la identificación
          </Typography>
          <LinearProgress
            variant="determinate"
            value={confidence * 100}
            sx={{ mb: 1, height: 8, borderRadius: 4 }}
          />
          <Typography variant="body2" color="primary" sx={{ fontWeight: 600 }}>
            {Math.round(confidence * 100)}%
          </Typography>
        </Box>
      </Paper>

      <Stack spacing={2} sx={{ mb: 3 }}>
        {bird.significado_ancestral && (
          <Card sx={{ bgcolor: '#fff3e0', borderLeft: '4px solid #ff9800' }}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                📖 Significado Ancestral
              </Typography>
              <Typography variant="body2">{bird.significado_ancestral}</Typography>
            </CardContent>
          </Card>
        )}

        {bird.rol_cosmovision && (
          <Card sx={{ bgcolor: '#e8f5e9', borderLeft: '4px solid #4CAF50' }}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                🌍 Rol en la Cosmovision
              </Typography>
              <Typography variant="body2">{bird.rol_cosmovision}</Typography>
            </CardContent>
          </Card>
        )}

        {bird.historias_ancestrales?.length > 0 && (
          <Card sx={{ bgcolor: '#e3f2fd', borderLeft: '4px solid #2196F3' }}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                📚 Historias
              </Typography>
              {bird.historias_ancestrales.map((historia, idx) => (
                <Typography key={idx} variant="body2" sx={{ mb: 1 }}>
                  • {historia}
                </Typography>
              ))}
            </CardContent>
          </Card>
        )}

        {bird.comportamientos && (
          <Card>
            <CardContent>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                🦅 Comportamiento
              </Typography>
              <Typography variant="body2">{bird.comportamientos}</Typography>
            </CardContent>
          </Card>
        )}

        {bird.habitat && (
          <Card>
            <CardContent>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                🌿 Hábitat
              </Typography>
              <Typography variant="body2">{bird.habitat}</Typography>
            </CardContent>
          </Card>
        )}

        <Card
          sx={{
            bgcolor:
              bird.ecosistema_riesgo === 'alto'
                ? '#ffcdd2'
                : bird.ecosistema_riesgo === 'medio'
                  ? '#ffe0b2'
                  : '#c8e6c9',
          }}
        >
          <CardContent sx={{ textAlign: 'center' }}>
            <Chip
              label={`Riesgo ecosistema: ${bird.ecosistema_riesgo.toUpperCase()}`}
              sx={{ fontWeight: 600 }}
            />
          </CardContent>
        </Card>
      </Stack>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          variant="outlined"
          onClick={() => navigate('/')}
          fullWidth
        >
          Descartar
        </Button>
        <Button
          variant="contained"
          onClick={handleSaveSighting}
          disabled={saving}
          fullWidth
        >
          {saving ? <CircularProgress size={24} /> : 'Guardar Avistamiento'}
        </Button>
      </Box>
    </Container>
  );
};
