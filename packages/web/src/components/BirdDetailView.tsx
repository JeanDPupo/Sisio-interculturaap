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
import { Bird, useAuth, useSightings } from '@sisio/shared';
import { ARViewer } from './ARViewer';

interface Props {
  bird: Bird;
  confidence?: number;
  showActions?: boolean;
}

export const BirdDetailView: React.FC<Props> = ({ bird, confidence = 0, showActions = true }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createSighting } = useSightings();
  const [saving, setSaving] = useState(false);

  const handleSaveSighting = async () => {
    setSaving(true);
    try {
      await createSighting({
        bird_id: bird.id,
        user_id: user?.id,
        confidence,
        ecosystem_risk: bird.ecosistema_riesgo,
      });
      alert('Avistamiento guardado');
      navigate('/');
    } catch {
      alert('Error al guardar avistamiento');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 4, textAlign: 'center', mb: 3 }}>
        <Typography variant="h2" sx={{ mb: 2 }}>🦅</Typography>
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

        {showActions && confidence > 0 && (
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
        )}
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
          🎯 Visualizador 3D Interactivo
        </Typography>
        <ARViewer bird={bird} />
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
                  • {typeof historia === 'string' ? historia : historia.historia || JSON.stringify(historia)}
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
              color={bird.ecosistema_riesgo === 'alto' ? 'error' : bird.ecosistema_riesgo === 'medio' ? 'warning' : 'success'}
              sx={{ fontWeight: 600 }}
            />
          </CardContent>
        </Card>
      </Stack>

      {showActions && (
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={() => navigate(-1)}
            fullWidth
          >
            Volver
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
      )}
    </Container>
  );
};
