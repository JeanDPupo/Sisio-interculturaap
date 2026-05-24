import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  CircularProgress,
  Alert,
  IconButton,
  Stack,
} from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import FlipCameraIosIcon from '@mui/icons-material/FlipCameraIos';
import { useBird, useOffline } from '@sisio/shared';

export const PhotoUploadPage: React.FC = () => {
  const navigate = useNavigate();
  const { identifyFromPhoto, loading, error } = useBird();
  const { isOnline, addPhotoToQueue } = useOffline();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [cameraActive, setCameraActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [capturedBlob, setCapturedBlob] = useState<Blob | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [queued, setQueued] = useState(false);

  const startCamera = useCallback(async () => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode, width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      streamRef.current = stream;
      setCameraActive(true);
    } catch (err) {
      alert('No se pudo acceder a la cámara. Verifica los permisos.');
    }
  }, [facingMode]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  }, []);

  const capturePhoto = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0);
    canvas.toBlob((blob) => {
      if (blob) {
        setCapturedBlob(blob);
        setPreview(URL.createObjectURL(blob));
      }
    }, 'image/jpeg', 0.85);
    stopCamera();
  }, [stopCamera]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCapturedBlob(file);
      setPreview(URL.createObjectURL(file));
    }
  }, []);

  const handleIdentify = async () => {
    if (!capturedBlob) {
      alert('Primero toma o selecciona una foto');
      return;
    }

    if (!isOnline) {
      const reader = new FileReader();
      reader.onloadend = () => {
        addPhotoToQueue(reader.result as string);
        setQueued(true);
      };
      reader.readAsDataURL(capturedBlob);
      return;
    }

    const file = new File([capturedBlob], 'photo.jpg', { type: capturedBlob.type });
    try {
      await identifyFromPhoto(file);
      navigate('/bird-result');
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const toggleCamera = () => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
    if (cameraActive) {
      stopCamera();
      setTimeout(() => startCamera(), 300);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
        Identificar Ave por Fotografía
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {queued && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Foto guardada en cola offline. Se procesará cuando haya conexión.
        </Alert>
      )}

      {preview ? (
        <Box>
          <Paper sx={{ mb: 2, overflow: 'hidden' }}>
            <img
              src={preview}
              alt="Preview"
              style={{ width: '100%', maxHeight: 400, objectFit: 'cover' }}
            />
          </Paper>
          <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
            <Button
              variant="outlined"
              onClick={() => {
                setPreview(null);
                setCapturedBlob(null);
                setQueued(false);
              }}
              fullWidth
            >
              Nueva Foto
            </Button>
            <Button
              variant="contained"
              onClick={handleIdentify}
              disabled={loading}
              fullWidth
            >
              {loading ? <CircularProgress size={24} /> : isOnline ? 'Identificar Ave' : 'Guardar para después'}
            </Button>
          </Stack>
        </Box>
      ) : cameraActive ? (
        <Box>
          <Paper sx={{ mb: 2, overflow: 'hidden', position: 'relative' }}>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              style={{ width: '100%', maxHeight: 400, objectFit: 'cover' }}
            />
          </Paper>
          <Stack direction="row" spacing={2}>
            <Button variant="contained" onClick={capturePhoto} startIcon={<CameraAltIcon />} fullWidth>
              Tomar Foto
            </Button>
            <IconButton onClick={toggleCamera} color="primary">
              <FlipCameraIosIcon />
            </IconButton>
            <Button variant="outlined" onClick={stopCamera} fullWidth>
              Cancelar
            </Button>
          </Stack>
        </Box>
      ) : (
        <Paper
          sx={{
            p: 4,
            textAlign: 'center',
            border: '2px dashed #2196F3',
            mb: 2,
          }}
        >
          <Stack spacing={2}>
            <Button
              variant="contained"
              size="large"
              startIcon={<CameraAltIcon />}
              onClick={startCamera}
              fullWidth
            >
              Tomar Foto con Cámara
            </Button>
            <Typography variant="body2" color="textSecondary">o</Typography>
            <Button
              variant="outlined"
              size="large"
              startIcon={<CloudUploadIcon />}
              onClick={() => fileInputRef.current?.click()}
              fullWidth
            >
              Subir desde archivo
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={handleFileSelect}
            />
          </Stack>
        </Paper>
      )}

      <canvas ref={canvasRef} style={{ display: 'none' }} />

      <Paper sx={{ p: 2, bgcolor: '#f5f5f5' }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
          Consejos
        </Typography>
        <Typography variant="body2" color="textSecondary">
          • Busca buena iluminación{"\n"}• Captura la cara del ave{"\n"}• Evita sombras
        </Typography>
      </Paper>
    </Container>
  );
};
