import React, { useState } from 'react';
import {
  Container,
  Paper,
  Box,
  Typography,
  Avatar,
  TextField,
  Button,
  Grid,
  CircularProgress,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { useAuth, useSightings } from '@sisio/shared';

export const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { sightings } = useSightings();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
  });
  const [openAvatarDialog, setOpenAvatarDialog] = useState(false);

  if (!user) {
    return (
      <Container sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateProfile(formData);
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      bio: user?.bio || '',
    });
    setIsEditing(false);
  };

  const stats = {
    totalSightings: sightings.length,
    averageConfidence: sightings.length
      ? Math.round(
          (sightings.reduce((sum, s) => sum + (s.confidence || 0), 0) / sightings.length) * 100
        )
      : 0,
    highRiskBirds: sightings.filter((s) => s.ecosystem_risk === 'alto').length,
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
          Mi Perfil
        </Typography>

        {/* Profile Header */}
        <Paper sx={{ p: 3, textAlign: 'center', mb: 3 }}>
          <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
            <Avatar
              sx={{
                width: 120,
                height: 120,
                bgcolor: '#2196F3',
                fontSize: 48,
                cursor: 'pointer',
              }}
              onClick={() => setOpenAvatarDialog(true)}
            >
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </Avatar>
          </Box>

          {!isEditing ? (
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                {user?.name || 'Usuario'}
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                {user?.email}
              </Typography>
              {user?.bio && (
                <Typography variant="body2" sx={{ mb: 2, fontStyle: 'italic' }}>
                  {user.bio}
                </Typography>
              )}
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={() => setIsEditing(true)}
              >
                Editar Perfil
              </Button>
            </Box>
          ) : (
            <Box sx={{ textAlign: 'left' }}>
              <TextField
                fullWidth
                label="Nombre"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                margin="normal"
                disabled={isSaving}
              />
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                margin="normal"
                disabled={isSaving}
              />
              <TextField
                fullWidth
                label="Biografía"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                margin="normal"
                multiline
                rows={3}
                disabled={isSaving}
              />
              <Box sx={{ display: 'flex', gap: 1, mt: 2, justifyContent: 'center' }}>
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  Guardar
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<CancelIcon />}
                  onClick={handleCancel}
                  disabled={isSaving}
                >
                  Cancelar
                </Button>
              </Box>
            </Box>
          )}
        </Paper>

        {/* Statistics */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Estadísticas
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography color="textSecondary" gutterBottom>
                    Total Avistamientos
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#2196F3' }}>
                    {stats.totalSightings}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography color="textSecondary" gutterBottom>
                    Confianza Promedio
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#4CAF50' }}>
                    {stats.averageConfidence}%
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography color="textSecondary" gutterBottom>
                    Aves Críticas
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#f44336' }}>
                    {stats.highRiskBirds}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography color="textSecondary" gutterBottom>
                    Miembro Desde
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {user?.created_at
                      ? new Date(user.created_at).toLocaleDateString('es-ES')
                      : 'N/A'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* Account Info */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Información de Cuenta
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="textSecondary">
              ID: {user?.id}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="textSecondary">
              Rol: {user?.role?.toUpperCase() || 'USER'}
            </Typography>
          </Box>
        </Paper>
      </Box>

      {/* Avatar Dialog (placeholder) */}
      <Dialog open={openAvatarDialog} onClose={() => setOpenAvatarDialog(false)}>
        <DialogTitle>Cambiar Avatar</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="textSecondary">
            Funcionalidad de avatar próximamente
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAvatarDialog(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
