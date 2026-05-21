import React, { useEffect, useState } from 'react';
import {
  Container,
  Paper,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
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
} from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAuth, useAdmin } from '@sisio/shared';

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
}

export const AdminPage: React.FC = () => {
  const { user } = useAuth();
  const { stats: adminStats, getStats, getModerationQueue, moderateSighting } = useAdmin();
  const [stats, setStats] = useState<GlobalStats>({
    totalUsers: 0,
    totalSightings: 0,
    totalComments: 0,
    pendingModeration: 0,
    highRiskBirds: 0,
  });
  const [loading, setLoading] = useState(true);
  const [moderationItems, setModerationItems] = useState<ModerationItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<ModerationItem | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    if (user?.role !== 'admin') {
      return;
    }

    const loadAdminData = async () => {
      try {
        setLoading(true);
        const [statsData, modData] = await Promise.all([
          getStats(),
          getModerationQueue(),
        ]);

        if (statsData) {
          setStats({
            totalUsers: statsData.total_users,
            totalSightings: statsData.total_sightings,
            totalComments: 0,
            pendingModeration: statsData.sightings_this_week,
            highRiskBirds: Object.entries(statsData.ecosystem_risk_distribution || {}).reduce(
              (sum, [risk, count]) => (risk === 'alto' ? sum + (count as number) : sum),
              0
            ),
          });
        }

        if (modData) {
          const items: ModerationItem[] = [];
          (modData.flagged_sightings || []).forEach((s: any) => {
            items.push({
              id: `sighting_${s.id}`,
              type: 'sighting',
              content: `Avistamiento pendiente de aprobación`,
              author: s.user_id || 'Unknown',
              status: 'pending',
              createdAt: new Date(s.created_at),
            });
          });
          (modData.flagged_comments || []).forEach((c: any) => {
            items.push({
              id: `comment_${c.id}`,
              type: 'comment',
              content: c.text?.substring(0, 100) || '',
              author: c.user_id || 'Unknown',
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

  const handleDelete = (item: ModerationItem) => {
    setModerationItems((prev) => prev.filter((i) => i.id !== item.id));
  };

  if (user?.role !== 'admin') {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">
          No tienes permisos para acceder a esta página. Solo administradores pueden ver el panel
          de control.
        </Alert>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  const pendingCount = moderationItems.filter((i) => i.status === 'pending').length;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
          Panel Administrativo
        </Typography>

        {pendingCount > 0 && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            ⚠️ Hay {pendingCount} elemento(s) pendiente(s) de moderación
          </Alert>
        )}

        {/* Global Statistics */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography color="textSecondary" gutterBottom>
                  Total de Usuarios
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2196F3' }}>
                  {stats.totalUsers}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography color="textSecondary" gutterBottom>
                  Total Avistamientos
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#4CAF50' }}>
                  {stats.totalSightings}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography color="textSecondary" gutterBottom>
                  Total Comentarios
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#FF9800' }}>
                  {stats.totalComments}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography color="textSecondary" gutterBottom>
                  Pendiente de Moderación
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#F44336' }}>
                  {stats.pendingModeration}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography color="textSecondary" gutterBottom>
                  Aves de Alto Riesgo
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#E91E63' }}>
                  {stats.highRiskBirds}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography color="textSecondary" gutterBottom>
                  Tasa de Aprobación
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#9C27B0' }}>
                  95%
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Moderation Queue */}
        <Paper sx={{ p: 3 }}>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Cola de Moderación
            </Typography>
            <Chip
              label={`${pendingCount} pendientes`}
              color={pendingCount > 0 ? 'error' : 'success'}
              variant="outlined"
            />
          </Box>

          {moderationItems.length === 0 ? (
            <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', py: 3 }}>
              No hay elementos para moderar
            </Typography>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                    <TableCell sx={{ fontWeight: 600 }}>Tipo</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Contenido</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Autor</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Fecha</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Estado</TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="right">
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
                          variant="outlined"
                          color={item.type === 'comment' ? 'default' : 'primary'}
                        />
                      </TableCell>
                      <TableCell sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
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
                          color={
                            item.status === 'pending'
                              ? 'warning'
                              : item.status === 'approved'
                                ? 'success'
                                : 'error'
                          }
                          variant={item.status === 'pending' ? 'filled' : 'outlined'}
                        />
                      </TableCell>
                      <TableCell align="right">
                        {item.status === 'pending' && (
                          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                            <Button
                              size="small"
                              startIcon={<ThumbUpIcon />}
                              onClick={() => handleApprove(item)}
                              color="success"
                            >
                              Aprobar
                            </Button>
                            <Button
                              size="small"
                              startIcon={<ThumbDownIcon />}
                              onClick={() => handleReject(item)}
                              color="error"
                            >
                              Rechazar
                            </Button>
                          </Box>
                        )}
                        {item.status !== 'pending' && (
                          <Button
                            size="small"
                            startIcon={<DeleteIcon />}
                            onClick={() => handleDelete(item)}
                            color="error"
                          >
                            Eliminar
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Box>

      {/* Rejection Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>Rechazar Elemento</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            ¿Por qué deseas rechazar este elemento?
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="Razón del rechazo..."
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button onClick={handleConfirmReject} color="error" variant="contained">
            Rechazar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
