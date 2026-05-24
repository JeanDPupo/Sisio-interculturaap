import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Box,
  CircularProgress,
  TextField,
  InputAdornment,
  Chip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useBird, Bird } from '@sisio/shared';

export const BirdsListPage: React.FC = () => {
  const navigate = useNavigate();
  const { birds, loading, getBirds, searchBirds } = useBird();
  const [searchQuery, setSearchQuery] = useState('');

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

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'alto': return 'error';
      case 'medio': return 'warning';
      default: return 'success';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold' }}>
        Aves de la Sierra Nevada
      </Typography>
      <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
        Catálogo de aves registradas con su conocimiento ancestral
      </Typography>

      <TextField
        fullWidth
        variant="outlined"
        placeholder="Buscar ave por nombre científico, español o nativo..."
        value={searchQuery}
        onChange={handleSearch}
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      {loading ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <CircularProgress />
          <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
            Cargando aves...
          </Typography>
        </Box>
      ) : birds.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="textSecondary">
            No se encontraron aves
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {birds.map((bird: Bird) => (
            <Grid item xs={12} sm={6} md={4} key={bird.id}>
              <Card
                sx={{
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 },
                }}
              >
                <CardActionArea onClick={() => navigate(`/bird/${bird.id}`)}>
                  <Box
                    sx={{
                      height: 160,
                      bgcolor: '#e3f2fd',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 64,
                    }}
                  >
                    🦅
                  </Box>
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                      {bird.nombre_espanol || bird.nombre_cientifico}
                    </Typography>
                    <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#666', mb: 1 }}>
                      {bird.nombre_cientifico}
                    </Typography>
                    {bird.nombre_nativo && (
                      <Typography variant="caption" display="block" sx={{ mb: 1, color: '#888' }}>
                        {bird.nombre_nativo} ({bird.lengua})
                      </Typography>
                    )}
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Chip
                        size="small"
                        label={bird.ecosistema_riesgo}
                        color={getRiskColor(bird.ecosistema_riesgo)}
                      />
                      {bird.zona_geografica && (
                        <Chip size="small" variant="outlined" label={bird.zona_geografica} />
                      )}
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};
