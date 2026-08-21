import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  Avatar,
  TextField,
  Button,
  Grid,
  Stack,
  Divider,
  CircularProgress,
  IconButton,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import StarIcon from '@mui/icons-material/Star';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LockIcon from '@mui/icons-material/Lock';
import { useAuth, useSightings } from '@sisio/shared';

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
const riesgoAlto = '#F44336';

const glassmorphism = {
  background: 'rgba(13, 27, 15, 0.65)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 16,
  overflow: 'hidden',
};

interface SightingItem {
  id: string;
  bird?: {
    nombre_espanol?: string;
    ecosistema_riesgo?: 'bajo' | 'medio' | 'alto';
  };
  location?: {
    address?: string;
  };
  confidence?: number;
  timestamp?: string;
  created_at?: string;
  photo_url?: string;
}

const badges = [
  { key: 'novato', label: 'Novato', icon: '/assets/images/badges/badge-novato.svg', minSightings: 0 },
  { key: 'observador', label: 'Observador', icon: '/assets/images/badges/badge-observador.svg', minSightings: 5 },
  { key: 'sabio', label: 'Sabio', icon: '/assets/images/badges/badge-sabio.svg', minSightings: 15 },
  { key: 'guardian', label: 'Guardián', icon: '/assets/images/badges/badge-guardian.svg', minSightings: 30 },
];

const AnimatedCounter: React.FC<{ target: number; duration?: number }> = ({ target, duration = 1200 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (target === 0) { setCount(0); return; }
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);

  return <>{count}</>;
};

const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { sightings } = useSightings();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
  });

  const typedSightings = useMemo(() => (sightings || []) as unknown as SightingItem[], [sightings]);

  const stats = useMemo(() => {
    const total = typedSightings.length;
    const avgConfidence = total
      ? Math.round(
          (typedSightings.reduce((sum, s) => sum + (s.confidence || 0), 0) / total) * 100
        )
      : 0;
    const criticalBirds = typedSightings.filter(
      (s) => s.bird?.ecosistema_riesgo === 'alto'
    ).length;
    return { total, avgConfidence, criticalBirds };
  }, [typedSightings]);

  const earnedBadgeIndex = useMemo(() => {
    if (stats.total >= 30) return 3;
    if (stats.total >= 15) return 2;
    if (stats.total >= 5) return 1;
    return 0;
  }, [stats.total]);

  const recentSightings = useMemo(() => {
    return [...typedSightings]
      .sort((a, b) => {
        const da = new Date(a.timestamp || a.created_at || 0).getTime();
        const db = new Date(b.timestamp || b.created_at || 0).getTime();
        return db - da;
      })
      .slice(0, 5);
  }, [typedSightings]);

  const levelProgress = useMemo(() => {
    const thresholds = [0, 5, 15, 30];
    const current = stats.total;
    const nextThreshold = thresholds.find((t) => t > current) || 30;
    const prevThreshold = [...thresholds].reverse().find((t) => t <= current) || 0;
    const range = nextThreshold - prevThreshold;
    const progress = range > 0 ? ((current - prevThreshold) / range) * 100 : 100;
    return Math.min(progress, 100);
  }, [stats.total]);

  if (!user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress sx={{ color: verdeHoja }} />
      </Box>
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

  const ringGradient = `conic-gradient(${verdeHoja} ${levelProgress * 3.6}deg, rgba(255,255,255,0.1) ${levelProgress * 3.6}deg)`;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: negroSelva }}>
      <Box
        sx={{
          background: `linear-gradient(180deg, ${negroSelva} 0%, ${azulNoche} 60%, ${verdeSelva} 100%)`,
          pt: 4,
          pb: 8,
          px: { xs: 2, sm: 3 },
        }}
      >
        <Box sx={{ maxWidth: 900, mx: 'auto' }}>
          <Typography
            variant="h4"
            sx={{
              fontFamily: '"Playfair Display", serif',
              fontWeight: 700,
              color: blancoNiebla,
              mb: 4,
              textAlign: 'center',
              fontSize: { xs: '1.8rem', sm: '2.2rem' },
            }}
          >
            Mi Perfil
          </Typography>

          <Box sx={{ textAlign: 'center', mb: 5 }}>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              style={{ display: 'inline-block' }}
            >
              <Box
                sx={{
                  width: 140,
                  height: 140,
                  borderRadius: '50%',
                  background: ringGradient,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 2,
                  boxShadow: `0 0 30px ${verdeHoja}33`,
                }}
              >
                <Box
                  sx={{
                    width: 128,
                    height: 128,
                    borderRadius: '50%',
                    bgcolor: azulNoche,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: `3px solid ${negroSelva}`,
                  }}
                >
                  <Typography
                    variant="h2"
                    sx={{
                      fontFamily: '"Playfair Display", serif',
                      fontWeight: 700,
                      color: verdeHoja,
                      fontSize: 48,
                    }}
                  >
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                  </Typography>
                </Box>
              </Box>
            </motion.div>

            {!isEditing ? (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <Typography
                  variant="h5"
                  sx={{
                    fontFamily: '"Playfair Display", serif',
                    fontWeight: 700,
                    color: blancoNiebla,
                    mb: 0.5,
                  }}
                >
                  {user.name || 'Usuario'}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', mb: 1 }}>
                  {user.email}
                </Typography>
                {user.bio && (
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', fontStyle: 'italic', mb: 2 }}>
                    "{user.bio}"
                  </Typography>
                )}
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={() => setIsEditing(true)}
                  sx={{
                    mt: 1,
                    color: ambarSolar,
                    borderColor: `${ambarSolar}55`,
                    '&:hover': { borderColor: ambarSolar, background: `${ambarSolar}11` },
                  }}
                >
                  Editar Perfil
                </Button>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <Box
                  sx={{
                    ...glassmorphism,
                    p: 3,
                    maxWidth: 480,
                    mx: 'auto',
                    textAlign: 'left',
                  }}
                >
                  <TextField
                    fullWidth
                    label="Nombre"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    margin="normal"
                    size="small"
                    disabled={isSaving}
                    InputLabelProps={{ style: { color: 'rgba(255,255,255,0.5)' } }}
                    InputProps={{
                      style: { color: blancoNiebla },
                    }}
                    sx={{ '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'rgba(255,255,255,0.15)' } } }}
                  />
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    margin="normal"
                    size="small"
                    disabled={isSaving}
                    InputLabelProps={{ style: { color: 'rgba(255,255,255,0.5)' } }}
                    InputProps={{
                      style: { color: blancoNiebla },
                    }}
                    sx={{ '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'rgba(255,255,255,0.15)' } } }}
                  />
                  <TextField
                    fullWidth
                    label="Biografía"
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    margin="normal"
                    size="small"
                    multiline
                    rows={3}
                    disabled={isSaving}
                    InputLabelProps={{ style: { color: 'rgba(255,255,255,0.5)' } }}
                    InputProps={{
                      style: { color: blancoNiebla },
                    }}
                    sx={{ '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'rgba(255,255,255,0.15)' } } }}
                  />
                  <Stack direction="row" spacing={1} sx={{ mt: 2, justifyContent: 'center' }}>
                    <Button
                      variant="contained"
                      startIcon={<SaveIcon />}
                      onClick={handleSave}
                      disabled={isSaving}
                      sx={{
                        background: `linear-gradient(135deg, ${verdeSelva}, ${verdeMusgo})`,
                        '&:hover': { background: `linear-gradient(135deg, ${verdeMusgo}, ${verdeHoja})` },
                      }}
                    >
                      Guardar
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<CancelIcon />}
                      onClick={handleCancel}
                      disabled={isSaving}
                      sx={{ color: blancoNiebla, borderColor: 'rgba(255,255,255,0.2)' }}
                    >
                      Cancelar
                    </Button>
                  </Stack>
                </Box>
              </motion.div>
            )}
          </Box>

          <Grid container spacing={2} sx={{ mb: 5 }}>
            {[
              {
                icon: <VisibilityIcon sx={{ fontSize: 28, color: azulClaro }} />,
                label: 'Total Avistamientos',
                value: stats.total,
                isNumeric: true,
                color: azulClaro,
              },
              {
                icon: <StarIcon sx={{ fontSize: 28, color: verdeHoja }} />,
                label: 'Confianza Promedio',
                value: stats.avgConfidence,
                suffix: '%',
                isNumeric: true,
                color: verdeHoja,
              },
              {
                icon: <ErrorOutlineIcon sx={{ fontSize: 28, color: riesgoAlto }} />,
                label: 'Aves Críticas',
                value: stats.criticalBirds,
                isNumeric: true,
                color: riesgoAlto,
              },
              {
                icon: <CalendarTodayIcon sx={{ fontSize: 28, color: ambarSolar }} />,
                label: 'Miembro Desde',
                value: user.created_at
                  ? new Date(user.created_at).toLocaleDateString('es-ES', { month: 'short', year: 'numeric' })
                  : 'N/A',
                isNumeric: false,
                color: ambarSolar,
              },
            ].map((stat, i) => (
              <Grid item xs={6} sm={3} key={stat.label}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i }}
                >
                  <Box
                    sx={{
                      ...glassmorphism,
                      p: 2.5,
                      textAlign: 'center',
                      height: '100%',
                    }}
                  >
                    {stat.icon}
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 700,
                        color: stat.color,
                        mt: 1,
                        mb: 0.5,
                        fontFamily: '"Playfair Display", serif',
                      }}
                    >
                      {stat.isNumeric ? <AnimatedCounter target={stat.value as number} /> : stat.value}
                      {stat.suffix || ''}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.3, display: 'block' }}>
                      {stat.label}
                    </Typography>
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ mb: 5 }}>
            <Typography
              variant="h6"
              sx={{
                fontFamily: '"Playfair Display", serif',
                color: oroIndigena,
                mb: 2,
                fontWeight: 600,
              }}
            >
              Logros
            </Typography>
            <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', gap: 2 }}>
              {badges.map((badge, i) => {
                const earned = i <= earnedBadgeIndex;
                return (
                  <motion.div
                    key={badge.key}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 * i }}
                  >
                    <Box
                      sx={{
                        ...glassmorphism,
                        p: 2,
                        width: 100,
                        textAlign: 'center',
                        opacity: earned ? 1 : 0.4,
                        filter: earned ? 'none' : 'grayscale(100%)',
                        transition: 'all 0.3s',
                        position: 'relative',
                      }}
                    >
                      <Box
                        sx={{
                          width: 56,
                          height: 56,
                          borderRadius: '50%',
                          bgcolor: earned ? `${oroIndigena}22` : 'rgba(255,255,255,0.05)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mx: 'auto',
                          mb: 1,
                          border: `2px solid ${earned ? oroIndigena : 'rgba(255,255,255,0.1)'}`,
                        }}
                      >
                        <img
                          src={badge.icon}
                          alt={badge.label}
                          style={{
                            width: 28,
                            height: 28,
                            filter: earned ? 'none' : 'grayscale(100%) opacity(0.3)',
                          }}
                        />
                      </Box>
                      <Typography variant="caption" sx={{ color: earned ? blancoNiebla : 'rgba(255,255,255,0.3)', fontWeight: 600, display: 'block' }}>
                        {badge.label}
                      </Typography>
                      {!earned && (
                        <LockIcon
                          sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            fontSize: 14,
                            color: 'rgba(255,255,255,0.3)',
                          }}
                        />
                      )}
                    </Box>
                  </motion.div>
                );
              })}
            </Stack>
          </Box>

          {recentSightings.length > 0 && (
            <Box sx={{ mb: 5 }}>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: '"Playfair Display", serif',
                  color: azulClaro,
                  mb: 3,
                  fontWeight: 600,
                }}
              >
                Actividad Reciente
              </Typography>
              <Box sx={{ position: 'relative', pl: 3 }}>
                <Box
                  sx={{
                    position: 'absolute',
                    left: 7,
                    top: 0,
                    bottom: 0,
                    width: 2,
                    background: `linear-gradient(180deg, ${azulClaro}, ${verdeHoja}, transparent)`,
                  }}
                />
                <Stack spacing={3}>
                  {recentSightings.map((sighting, i) => {
                    const riskColor =
                      sighting.bird?.ecosistema_riesgo === 'alto'
                        ? riesgoAlto
                        : sighting.bird?.ecosistema_riesgo === 'medio'
                        ? ambarSolar
                        : verdeHoja;
                    const date = sighting.timestamp || sighting.created_at;
                    return (
                      <motion.div
                        key={sighting.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * i }}
                      >
                        <Box sx={{ position: 'relative' }}>
                          <Box
                            sx={{
                              position: 'absolute',
                              left: -25,
                              top: 6,
                              width: 12,
                              height: 12,
                              borderRadius: '50%',
                              bgcolor: riskColor,
                              border: `2px solid ${negroSelva}`,
                              boxShadow: `0 0 8px ${riskColor}66`,
                              zIndex: 1,
                            }}
                          />
                          <Box
                            sx={{
                              ...glassmorphism,
                              p: 2,
                            }}
                          >
                            <Stack direction="row" spacing={2} alignItems="center">
                              {sighting.photo_url && (
                                <Avatar
                                  src={sighting.photo_url}
                                  variant="rounded"
                                  sx={{ width: 48, height: 48, bgcolor: `${azulNoche}88` }}
                                />
                              )}
                              <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography variant="body2" sx={{ color: blancoNiebla, fontWeight: 600 }}>
                                  {sighting.bird?.nombre_espanol || 'Ave desconocida'}
                                </Typography>
                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>
                                  {sighting.location?.address || 'Sin ubicación'}
                                </Typography>
                              </Box>
                              {date && (
                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.35)', whiteSpace: 'nowrap' }}>
                                  {new Date(date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                                </Typography>
                              )}
                            </Stack>
                          </Box>
                        </Box>
                      </motion.div>
                    );
                  })}
                </Stack>
              </Box>
            </Box>
          )}

          <Box
            sx={{
              ...glassmorphism,
              p: 3.5,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontFamily: '"Playfair Display", serif',
                color: blancoNiebla,
                mb: 2,
                fontWeight: 600,
              }}
            >
              Información de Cuenta
            </Typography>
            <Divider sx={{ mb: 2, borderColor: 'rgba(255,255,255,0.08)' }} />
            <Stack spacing={1.5}>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>ID</Typography>
                <Typography variant="body2" sx={{ color: blancoNiebla, fontFamily: 'monospace', fontSize: '0.8rem' }}>
                  {user.id}
                </Typography>
              </Stack>
              <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)' }} />
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>Rol</Typography>
                <Typography variant="body2" sx={{ color: user.is_admin ? oroIndigena : verdeHoja, fontWeight: 600 }}>
                  {user.is_admin ? 'ADMINISTRADOR' : 'USUARIO'}
                </Typography>
              </Stack>
              <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)' }} />
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>Tipo</Typography>
                <Typography variant="body2" sx={{ color: blancoNiebla }}>
                  {user.is_guest ? 'Invitado' : 'Registrado'}
                </Typography>
              </Stack>
            </Stack>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export { ProfilePage };
