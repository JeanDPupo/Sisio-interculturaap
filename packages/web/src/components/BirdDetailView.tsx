import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Container, Typography, Button, Paper, LinearProgress,
  CircularProgress, Card, CardContent, Stack, Chip,
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

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'alto': return '#F44336';
      case 'medio': return '#FFC107';
      default: return '#4CAF50';
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 4, textAlign: 'center', mb: 3, borderRadius: 4, backdropFilter: 'blur(20px)', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
        <Typography variant="h2" sx={{ mb: 2, fontSize: { xs: '3rem', md: '4rem' } }}>🦅</Typography>
        <Typography variant="h4" sx={{ fontFamily: '"Playfair Display", serif', fontWeight: 700, color: '#F0F7EE', mb: 1 }}>
          {bird.nombre_espanol || bird.nombre_cientifico}
        </Typography>
        <Typography variant="body1" sx={{ fontStyle: 'italic', color: '#b0c4a0', mb: 2 }}>
          {bird.nombre_cientifico}
        </Typography>
        {bird.nombre_nativo && (
          <Typography variant="body2" sx={{ mb: 2, color: '#D4A017', fontFamily: '"Lora", serif' }}>
            {bird.nombre_nativo} <span style={{ color: '#b0c4a0', fontStyle: 'italic' }}>({bird.lengua})</span>
          </Typography>
        )}
        {showActions && confidence > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: '#b0c4a0' }}>Precisión</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <LinearProgress variant="determinate" value={confidence * 100}
                sx={{ flex: 1, height: 8, borderRadius: 4, background: 'rgba(255,255,255,0.1)', '& .MuiLinearProgress-bar': { background: 'linear-gradient(90deg, #D4A017, #4CAF50)' } }} />
              <Typography variant="body2" sx={{ color: '#D4A017', fontWeight: 600, minWidth: 45 }}>{Math.round(confidence * 100)}%</Typography>
            </Box>
          </Box>
        )}
      </Paper>

      <Paper sx={{ p: 3, mb: 3, borderRadius: 4, backdropFilter: 'blur(20px)', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, color: '#D4A017', fontFamily: '"Playfair Display", serif' }}>
          Visualizador 3D
        </Typography>
        <ARViewer bird={bird} />
      </Paper>

      <Stack spacing={2} sx={{ mb: 3 }}>
        {bird.significado_ancestral && (
          <Card sx={{ background: 'rgba(255,152,0,0.08)', borderLeft: '4px solid #FF9800', borderRadius: 4, backdropFilter: 'blur(10px)' }}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#FF9800' }}>Significado Ancestral</Typography>
              <Typography variant="body2" sx={{ color: '#E0E0E0', lineHeight: 1.7 }}>{bird.significado_ancestral}</Typography>
            </CardContent>
          </Card>
        )}
        {bird.rol_cosmovision && (
          <Card sx={{ background: 'rgba(76,175,80,0.08)', borderLeft: '4px solid #4CAF50', borderRadius: 4, backdropFilter: 'blur(10px)' }}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#4CAF50' }}>Rol en la Cosmovisión</Typography>
              <Typography variant="body2" sx={{ color: '#E0E0E0', lineHeight: 1.7 }}>{bird.rol_cosmovision}</Typography>
            </CardContent>
          </Card>
        )}
        {bird.historias_ancestrales?.length > 0 && (
          <Card sx={{ background: 'rgba(33,150,243,0.08)', borderLeft: '4px solid #2196F3', borderRadius: 4, backdropFilter: 'blur(10px)' }}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#64B5F6' }}>Historias</Typography>
              {bird.historias_ancestrales.map((historia, idx) => (
                <Typography key={idx} variant="body2" sx={{ mb: 1, color: '#E0E0E0', lineHeight: 1.7 }}>
                  • {typeof historia === 'string' ? historia : (historia as any).historia || JSON.stringify(historia)}
                </Typography>
              ))}
            </CardContent>
          </Card>
        )}
        {bird.comportamientos && (
          <Card sx={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 4 }}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#8BC34A' }}>Comportamiento</Typography>
              <Typography variant="body2" sx={{ color: '#E0E0E0', lineHeight: 1.7 }}>{bird.comportamientos}</Typography>
            </CardContent>
          </Card>
        )}
        {bird.habitat && (
          <Card sx={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 4 }}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#64B5F6' }}>Hábitat</Typography>
              <Typography variant="body2" sx={{ color: '#E0E0E0', lineHeight: 1.7 }}>{bird.habitat}</Typography>
            </CardContent>
          </Card>
        )}
        {bird.zona_geografica && (
          <Card sx={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 4 }}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#FF8F00' }}>Zona Geográfica</Typography>
              <Typography variant="body2" sx={{ color: '#E0E0E0', lineHeight: 1.7 }}>{bird.zona_geografica}</Typography>
            </CardContent>
          </Card>
        )}
        <Card sx={{ background: `${getRiskColor(bird.ecosistema_riesgo)}20`, border: `1px solid ${getRiskColor(bird.ecosistema_riesgo)}40`, borderRadius: 4 }}>
          <CardContent sx={{ textAlign: 'center' }}>
            <Chip label={`Riesgo ecosistema: ${bird.ecosistema_riesgo.toUpperCase()}`}
              sx={{ fontWeight: 600, color: getRiskColor(bird.ecosistema_riesgo), borderColor: getRiskColor(bird.ecosistema_riesgo) }} variant="outlined" />
          </CardContent>
        </Card>
      </Stack>

      {showActions && (
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" onClick={() => navigate(-1)}
            sx={{ borderColor: 'rgba(255,255,255,0.3)', color: '#b0c4a0', borderRadius: 20, py: 1.5, '&:hover': { borderColor: '#F0F7EE' } }} fullWidth>
            Volver
          </Button>
          <Button variant="contained" onClick={handleSaveSighting} disabled={saving}
            sx={{ borderRadius: 20, py: 1.5, background: 'linear-gradient(135deg, #2D5016, #D4A017)', '&:hover': { background: 'linear-gradient(135deg, #4A7C2F, #F5C842)' } }} fullWidth>
            {saving ? <CircularProgress size={24} /> : 'Guardar Avistamiento'}
          </Button>
        </Box>
      )}
    </Container>
  );
};
