import React, { useEffect, useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import PeopleIcon from '@mui/icons-material/People';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CommentIcon from '@mui/icons-material/Comment';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth, useAdmin } from '@sisio/shared';

const COLORS = {
  verdeSelva: '#2D5016',
  verdeMusgo: '#4A7C2F',
  verdeHoja: '#8BC34A',
  azulNoche: '#1A3A4A',
  azulCielo: '#2E7D9A',
  azulClaro: '#64B5F6',
  oroIndigena: '#D4A017',
  ambarSolar: '#F5C842',
  naranjaAtardecer: '#FF8F00',
  negroSelva: '#0D1B0F',
  blancoNiebla: '#F0F7EE',
  riesgoBajo: '#4CAF50',
  riesgoMedio: '#FFC107',
  riesgoAlto: '#F44336',
};

const glassmorphism = {
  background: 'rgba(255, 255, 255, 0.7)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  borderRadius: '16px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
};

const AnimatedCounter: React.FC<{ target: number; duration?: number }> = ({
  target,
  duration = 1500,
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
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

  return <>{count.toLocaleString('es-ES')}</>;
};

interface StatCardProps {
  title: string;
  value: number;
  color: string;
  icon: React.ReactNode;
  delay: number;
  suffix?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, color, icon, delay, suffix }) => (
  <Grid item xs={12} sm={6} md={4}>
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Box
        sx={{
          ...glassmorphism,
          p: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12)',
          },
        }}
      >
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: '14px',
            background: `linear-gradient(135deg, ${color}22, ${color}44)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color,
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>
        <Box>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
            {title}
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 700, color: COLORS.negroSelva, lineHeight: 1.2 }}>
            <AnimatedCounter target={value} />
            {suffix || ''}
          </Typography>
        </Box>
      </Box>
    </motion.div>
  </Grid>
);

interface ModerationItem {
  id: string;
  type: 'comment' | 'sighting' | 'report';
  content: string;
  author: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
}

interface GlobalStats {
  totalUsers: number;
  totalSightings: number;
  totalComments: number;
  pendingModeration: number;
  highRiskBirds: number;
  approvalRate: number;
}

const PIE_RISK_COLORS = [COLORS.riesgoBajo, COLORS.riesgoMedio, COLORS.riesgoAlto];

export const AdminPage: React.FC = () => {
  const { user } = useAuth();
  const { getStats, getModerationQueue, moderateSighting } = useAdmin();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [stats, setStats] = useState<GlobalStats>({
    totalUsers: 0,
    totalSightings: 0,
    totalComments: 0,
    pendingModeration: 0,
    highRiskBirds: 0,
    approvalRate: 0,
  });
  const [loading, setLoading] = useState(true);
  const [moderationItems, setModerationItems] = useState<ModerationItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<ModerationItem | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [speciesData, setSpeciesData] = useState<{ name: string; count: number }[]>([]);
  const [riskData, setRiskData] = useState<{ name: string; value: number }[]>([]);

  useEffect(() => {
    if (!user?.is_admin) return;

    const loadAdminData = async () => {
      try {
        setLoading(true);
        const [statsData, modData] = await Promise.all([getStats(), getModerationQueue()]);

        if (statsData) {
          const approved = statsData.total_sightings - statsData.sightings_this_week;
          setStats({
            totalUsers: statsData.total_users,
            totalSightings: statsData.total_sightings,
            totalComments: 0,
            pendingModeration: statsData.sightings_this_week,
            highRiskBirds: Object.entries(statsData.ecosystem_risk_distribution || {}).reduce(
              (sum, [risk, count]) => (risk === 'alto' ? sum + (count as number) : sum),
              0
            ),
            approvalRate:
              statsData.total_sightings > 0
                ? Math.round((approved / statsData.total_sightings) * 100)
                : 0,
          });

          if (statsData.species_distribution) {
            setSpeciesData(
              Object.entries(statsData.species_distribution).map(([name, count]) => ({
                name,
                count: count as number,
              }))
            );
          }

          if (statsData.ecosystem_risk_distribution) {
            setRiskData(
              Object.entries(statsData.ecosystem_risk_distribution).map(([name, value]) => ({
                name: name.charAt(0).toUpperCase() + name.slice(1),
                value: value as number,
              }))
            );
          }
        }

        if (modData) {
          const items: ModerationItem[] = [];
          (modData.flagged_sightings || []).forEach((s: any) => {
            items.push({
              id: `sighting_${s.id}`,
              type: 'sighting',
              content: 'Avistamiento pendiente de aprobación',
              author: s.user_id || 'Desconocido',
              status: 'pending',
              createdAt: new Date(s.created_at),
            });
          });
          (modData.flagged_comments || []).forEach((c: any) => {
            items.push({
              id: `comment_${c.id}`,
              type: 'comment',
              content: c.text?.substring(0, 100) || '',
              author: c.user_id || 'Desconocido',
              status: 'pending',
              createdAt: new Date(c.created_at),
            });
          });
          setModerationItems(items);
        }
      } catch (error) {
        console.error('Error loading admin data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAdminData();
  }, [user, getStats, getModerationQueue]);

  const handleApprove = async (item: ModerationItem) => {
    const realId = item.id.replace(/^(sighting|comment)_/, '');
    try {
      if (item.type === 'sighting') {
        await moderateSighting(realId, 'approve');
      }
      setModerationItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, status: 'approved' } : i))
      );
    } catch (err) {
      console.error('Error approving:', err);
    }
  };

  const handleReject = (item: ModerationItem) => {
    setSelectedItem(item);
    setOpenDialog(true);
  };

  const handleConfirmReject = async () => {
    if (selectedItem) {
      const realId = selectedItem.id.replace(/^(sighting|comment)_/, '');
      try {
        if (selectedItem.type === 'sighting') {
          await moderateSighting(realId, 'reject');
        }
        setModerationItems((prev) =>
          prev.map((i) => (i.id === selectedItem.id ? { ...i, status: 'rejected' } : i))
        );
      } catch (err) {
        console.error('Error rejecting:', err);
      }
    }
    setOpenDialog(false);
    setRejectionReason('');
    setSelectedItem(null);
  };

  if (!user?.is_admin) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <Alert
            severity="error"
            variant="filled"
            sx={{
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(244, 67, 54, 0.3)',
            }}
          >
            No tienes permisos para acceder a esta página. Solo administradores pueden ver el panel
            de control.
          </Alert>
        </motion.div>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress sx={{ color: COLORS.verdeMusgo }} />
      </Container>
    );
  }

  const pendingCount = moderationItems.filter((i) => i.status === 'pending').length;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography
            variant="h4"
            sx={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 700,
              color: COLORS.negroSelva,
              mb: 1,
            }}
          >
            Panel Administrativo
          </Typography>
          <Typography variant="body1" sx={{ color: COLORS.azulCielo }}>
            Gestiona y supervisa la actividad de la plataforma
          </Typography>
        </Box>
      </motion.div>

      {pendingCount > 0 && (
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <Alert
            severity="warning"
            sx={{
              mb: 3,
              borderRadius: 2,
              background: `linear-gradient(135deg, ${COLORS.ambarSolar}15, ${COLORS.naranjaAtardecer}15)`,
              border: `1px solid ${COLORS.ambarSolar}40`,
            }}
          >
            Hay {pendingCount} elemento(s) pendiente(s) de moderación
          </Alert>
        </motion.div>
      )}

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <StatCard
          title="Total Usuarios"
          value={stats.totalUsers}
          color={COLORS.azulCielo}
          icon={<PeopleIcon />}
          delay={0}
        />
        <StatCard
          title="Total Avistamientos"
          value={stats.totalSightings}
          color={COLORS.verdeMusgo}
          icon={<VisibilityIcon />}
          delay={0.1}
        />
        <StatCard
          title="Comentarios"
          value={stats.totalComments}
          color={COLORS.naranjaAtardecer}
          icon={<CommentIcon />}
          delay={0.2}
        />
        <StatCard
          title="Pendientes Moderación"
          value={stats.pendingModeration}
          color={COLORS.riesgoAlto}
          icon={<PendingActionsIcon />}
          delay={0.3}
        />
        <StatCard
          title="Aves Alto Riesgo"
          value={stats.highRiskBirds}
          color="#E91E63"
          icon={<WarningIcon />}
          delay={0.4}
        />
        <StatCard
          title="Tasa Aprobación"
          value={stats.approvalRate}
          color="#9C27B0"
          icon={<CheckCircleIcon />}
          delay={0.5}
          suffix="%"
        />
      </Grid>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={7}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Box sx={{ ...glassmorphism, p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: COLORS.negroSelva }}>
                Distribución de Especies
              </Typography>
              {speciesData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={speciesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.08)" />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 12, fill: COLORS.azulNoche }}
                      angle={-30}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis tick={{ fontSize: 12, fill: COLORS.azulNoche }} />
                    <Tooltip
                      contentStyle={{
                        background: 'rgba(255,255,255,0.95)',
                        border: 'none',
                        borderRadius: 8,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      }}
                    />
                    <Bar dataKey="count" fill={COLORS.verdeMusgo} radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Sin datos de especies disponibles
                  </Typography>
                </Box>
              )}
            </Box>
          </motion.div>
        </Grid>

        <Grid item xs={12} md={5}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Box sx={{ ...glassmorphism, p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: COLORS.negroSelva }}>
                Distribución de Riesgo
              </Typography>
              {riskData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={riskData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={4}
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {riskData.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={PIE_RISK_COLORS[index % PIE_RISK_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Sin datos de riesgo disponibles
                  </Typography>
                </Box>
              )}
            </Box>
          </motion.div>
        </Grid>
      </Grid>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Box sx={{ ...glassmorphism, p: 3, mb: 4 }}>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: COLORS.negroSelva }}>
              Cola de Moderación
            </Typography>
            <Chip
              label={`${pendingCount} pendientes`}
              sx={{
                bgcolor: pendingCount > 0 ? COLORS.ambarSolar + '30' : COLORS.riesgoBajo + '30',
                color: pendingCount > 0 ? COLORS.naranjaAtardecer : COLORS.verdeMusgo,
                fontWeight: 600,
                borderRadius: 2,
              }}
            />
          </Box>

          {moderationItems.length === 0 ? (
            <Typography
              variant="body2"
              sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}
            >
              No hay elementos para moderar
            </Typography>
          ) : isMobile ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {moderationItems.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      border: `1px solid rgba(0,0,0,0.08)`,
                      background: 'rgba(255,255,255,0.5)',
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Chip
                        label={item.type}
                        size="small"
                        sx={{
                          bgcolor: item.type === 'comment' ? COLORS.azulClaro + '30' : COLORS.verdeHoja + '30',
                          color: item.type === 'comment' ? COLORS.azulNoche : COLORS.verdeSelva,
                          fontWeight: 500,
                        }}
                      />
                      <Chip
                        label={item.status}
                        size="small"
                        sx={{
                          bgcolor:
                            item.status === 'pending'
                              ? COLORS.ambarSolar + '30'
                              : item.status === 'approved'
                              ? COLORS.riesgoBajo + '30'
                              : COLORS.riesgoAlto + '30',
                          color:
                            item.status === 'pending'
                              ? COLORS.naranjaAtardecer
                              : item.status === 'approved'
                              ? COLORS.riesgoBajo
                              : COLORS.riesgoAlto,
                          fontWeight: 500,
                        }}
                      />
                    </Box>
                    <Typography variant="body2" sx={{ mb: 0.5, color: COLORS.negroSelva }}>
                      {item.content.substring(0, 60)}
                      {item.content.length > 60 ? '...' : ''}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>
                      {item.author} &middot;{' '}
                      {item.createdAt.toLocaleDateString('es-ES', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Typography>
                    {item.status === 'pending' && (
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          size="small"
                          startIcon={<ThumbUpIcon />}
                          onClick={() => handleApprove(item)}
                          sx={{
                            color: COLORS.verdeMusgo,
                            textTransform: 'none',
                            fontWeight: 600,
                          }}
                        >
                          Aprobar
                        </Button>
                        <Button
                          size="small"
                          startIcon={<ThumbDownIcon />}
                          onClick={() => handleReject(item)}
                          sx={{
                            color: COLORS.riesgoAlto,
                            textTransform: 'none',
                            fontWeight: 600,
                          }}
                        >
                          Rechazar
                        </Button>
                      </Box>
                    )}
                  </Box>
                </motion.div>
              ))}
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, color: COLORS.negroSelva }}>Tipo</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: COLORS.negroSelva }}>Contenido</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: COLORS.negroSelva }}>Autor</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: COLORS.negroSelva }}>Fecha</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: COLORS.negroSelva }}>Estado</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: COLORS.negroSelva }} align="right">
                      Acciones
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {moderationItems.map((item) => (
                    <TableRow key={item.id} hover>
                      <TableCell>
                        <Chip
                          label={item.type}
                          size="small"
                          sx={{
                            bgcolor: item.type === 'comment' ? COLORS.azulClaro + '30' : COLORS.verdeHoja + '30',
                            color: item.type === 'comment' ? COLORS.azulNoche : COLORS.verdeSelva,
                            fontWeight: 500,
                          }}
                        />
                      </TableCell>
                      <TableCell
                        sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                      >
                        {item.content.substring(0, 50)}...
                      </TableCell>
                      <TableCell>{item.author}</TableCell>
                      <TableCell>
                        {item.createdAt.toLocaleDateString('es-ES', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={item.status}
                          size="small"
                          sx={{
                            bgcolor:
                              item.status === 'pending'
                                ? COLORS.ambarSolar + '30'
                                : item.status === 'approved'
                                ? COLORS.riesgoBajo + '30'
                                : COLORS.riesgoAlto + '30',
                            color:
                              item.status === 'pending'
                                ? COLORS.naranjaAtardecer
                                : item.status === 'approved'
                                ? COLORS.riesgoBajo
                                : COLORS.riesgoAlto,
                            fontWeight: 500,
                          }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        {item.status === 'pending' && (
                          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                            <Button
                              size="small"
                              startIcon={<ThumbUpIcon />}
                              onClick={() => handleApprove(item)}
                              sx={{ color: COLORS.verdeMusgo, textTransform: 'none', fontWeight: 600 }}
                            >
                              Aprobar
                            </Button>
                            <Button
                              size="small"
                              startIcon={<ThumbDownIcon />}
                              onClick={() => handleReject(item)}
                              sx={{ color: COLORS.riesgoAlto, textTransform: 'none', fontWeight: 600 }}
                            >
                              Rechazar
                            </Button>
                          </Box>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </motion.div>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: { borderRadius: 3 },
        }}
      >
        <DialogTitle sx={{ fontWeight: 600, color: COLORS.negroSelva }}>
          Rechazar Elemento
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
            ¿Por qué deseas rechazar este elemento?
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="Escribe la razón del rechazo..."
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={() => setOpenDialog(false)}
            sx={{ textTransform: 'none', color: 'text.secondary' }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmReject}
            variant="contained"
            sx={{
              bgcolor: COLORS.riesgoAlto,
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              '&:hover': { bgcolor: '#D32F2F' },
            }}
          >
            Rechazar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
