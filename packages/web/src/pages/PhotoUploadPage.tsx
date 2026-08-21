import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Alert,
  Stack,
} from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import FlipCameraIosIcon from '@mui/icons-material/FlipCameraIos';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import { motion, AnimatePresence } from 'framer-motion';
import { useBird, useOffline } from '@sisio/shared';

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
};

const glassmorphism = {
  background: 'rgba(255, 255, 255, 0.7)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  borderRadius: '16px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
  overflow: 'hidden',
};

const BirdFlyLoader: React.FC = () => (
  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
    <motion.div
      animate={{
        x: [0, 30, 0, -30, 0],
        y: [0, -15, 0, -15, 0],
      }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
    >
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
        <motion.path
          d="M32 20 C28 12, 16 8, 8 16 C16 14, 24 16, 28 20 L24 32 L16 48 L24 40 L28 52 L32 40 L36 52 L40 40 L48 48 L40 32 L36 20 C40 16, 48 14, 56 16 C48 8, 36 12, 32 20Z"
          fill={COLORS.verdeMusgo}
          animate={{
            d: [
              "M32 20 C28 12, 16 8, 8 16 C16 14, 24 16, 28 20 L24 32 L16 48 L24 40 L28 52 L32 40 L36 52 L40 40 L48 48 L40 32 L36 20 C40 16, 48 14, 56 16 C48 8, 36 12, 32 20Z",
              "M32 18 C26 10, 12 6, 4 14 C14 12, 24 14, 28 18 L22 30 L12 46 L22 38 L26 52 L32 38 L38 52 L42 38 L52 46 L42 30 L36 18 C42 14, 52 12, 62 14 C52 6, 38 10, 32 18Z",
              "M32 20 C28 12, 16 8, 8 16 C16 14, 24 16, 28 20 L24 32 L16 48 L24 40 L28 52 L32 40 L36 52 L40 40 L48 48 L40 32 L36 20 C40 16, 48 14, 56 16 C48 8, 36 12, 32 20Z",
            ],
          }}
          transition={{ duration: 0.6, repeat: Infinity }}
        />
      </svg>
    </motion.div>
    <Typography variant="body2" sx={{ color: COLORS.azulCielo, fontWeight: 500 }}>
      Identificando ave...
    </Typography>
  </Box>
);

const ViewfinderCorner: React.FC<{
  position: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
  active: boolean;
}> = ({ position, active }) => {
  const size = 40;
  const borderWidth = 3;

  const positionStyles: Record<string, React.CSSProperties> = {
    topLeft: { top: 0, left: 0, borderTop: `${borderWidth}px solid`, borderLeft: `${borderWidth}px solid` },
    topRight: { top: 0, right: 0, borderTop: `${borderWidth}px solid`, borderRight: `${borderWidth}px solid` },
    bottomLeft: { bottom: 0, left: 0, borderBottom: `${borderWidth}px solid`, borderLeft: `${borderWidth}px solid` },
    bottomRight: { bottom: 0, right: 0, borderBottom: `${borderWidth}px solid`, borderRight: `${borderWidth}px solid` },
  };

  return (
    <motion.div
      animate={{
        borderColor: active
          ? [COLORS.verdeMusgo, COLORS.verdeHoja, COLORS.verdeMusgo]
          : 'rgba(255,255,255,0.6)',
        scale: active ? [1, 1.15, 1] : 1,
      }}
      transition={{ duration: 1.5, repeat: active ? Infinity : 0 }}
      style={{
        position: 'absolute',
        width: size,
        height: size,
        ...positionStyles[position],
        borderRadius: 4,
        zIndex: 2,
      }}
    />
  );
};

const ScanLine: React.FC = () => (
  <motion.div
    animate={{ top: ['0%', '100%', '0%'] }}
    transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
    style={{
      position: 'absolute',
      left: 0,
      right: 0,
      height: 2,
      background: `linear-gradient(90deg, transparent, ${COLORS.verdeHoja}, transparent)`,
      boxShadow: `0 0 12px ${COLORS.verdeHoja}`,
      zIndex: 2,
    }}
  />
);

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
  const [zoom, setZoom] = useState(1);

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
    } catch {
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
    canvas.toBlob(
      (blob) => {
        if (blob) {
          setCapturedBlob(blob);
          setPreview(URL.createObjectURL(blob));
        }
      },
      'image/jpeg',
      0.85
    );
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
    if (!capturedBlob) return;

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
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <Typography
          variant="h5"
          sx={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 700,
            color: COLORS.negroSelva,
            mb: 3,
            textAlign: 'center',
          }}
        >
          Identificar Ave por Fotografía
        </Typography>
      </motion.div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
              {error}
            </Alert>
          </motion.div>
        )}
        {queued && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Alert severity="info" sx={{ mb: 2, borderRadius: 2 }}>
              Foto guardada en cola offline. Se procesará cuando haya conexión.
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loader"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <Box
              sx={{
                ...glassmorphism,
                p: 6,
                mb: 3,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <BirdFlyLoader />
            </Box>
          </motion.div>
        ) : preview ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <Box
              sx={{
                ...glassmorphism,
                mb: 2,
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              <motion.img
                src={preview}
                alt="Preview"
                style={{
                  width: '100%',
                  maxHeight: 400,
                  objectFit: 'cover',
                  transformOrigin: 'center center',
                }}
                animate={{ scale: zoom }}
                transition={{ type: 'spring', stiffness: 200 }}
                onDoubleClick={() => setZoom(zoom === 1 ? 1.8 : 1)}
              />
            </Box>
            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
              <Button
                variant="outlined"
                onClick={() => {
                  setPreview(null);
                  setCapturedBlob(null);
                  setQueued(false);
                  setZoom(1);
                }}
                fullWidth
                sx={{
                  borderColor: COLORS.azulCielo,
                  color: COLORS.azulCielo,
                  textTransform: 'none',
                  fontWeight: 600,
                  borderRadius: 2,
                  py: 1.5,
                }}
              >
                Nueva Foto
              </Button>
              <Button
                variant="contained"
                onClick={handleIdentify}
                disabled={loading}
                fullWidth
                sx={{
                  background: `linear-gradient(135deg, ${COLORS.verdeMusgo}, ${COLORS.azulCielo})`,
                  textTransform: 'none',
                  fontWeight: 600,
                  borderRadius: 2,
                  py: 1.5,
                  '&:hover': {
                    background: `linear-gradient(135deg, ${COLORS.verdeSelva}, ${COLORS.azulNoche})`,
                  },
                }}
              >
                {isOnline ? 'Identificar Ave' : 'Guardar para después'}
              </Button>
            </Stack>
          </motion.div>
        ) : cameraActive ? (
          <motion.div
            key="camera"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <Box
              sx={{
                ...glassmorphism,
                mb: 2,
                overflow: 'hidden',
                position: 'relative',
                aspectRatio: '4/3',
              }}
            >
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
              <ViewfinderCorner position="topLeft" active={cameraActive} />
              <ViewfinderCorner position="topRight" active={cameraActive} />
              <ViewfinderCorner position="bottomLeft" active={cameraActive} />
              <ViewfinderCorner position="bottomRight" active={cameraActive} />
              <ScanLine />
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <motion.div whileTap={{ scale: 0.9 }} whileHover={{ scale: 1.05 }}>
                <Button
                  onClick={capturePhoto}
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    border: `4px solid ${COLORS.blancoNiebla}`,
                    bgcolor: COLORS.blancoNiebla,
                    minWidth: 0,
                    boxShadow: `0 0 24px ${COLORS.verdeHoja}60`,
                    '&:hover': {
                      bgcolor: COLORS.blancoNiebla,
                      boxShadow: `0 0 32px ${COLORS.verdeHoja}80`,
                    },
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.6, 0, 0.6],
                    }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      borderRadius: '50%',
                      border: `2px solid ${COLORS.verdeHoja}`,
                    }}
                  />
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, ${COLORS.verdeMusgo}, ${COLORS.oroIndigena})`,
                    }}
                  />
                </Button>
              </motion.div>
            </Box>

            <Stack direction="row" spacing={2} sx={{ justifyContent: 'center' }}>
              <motion.div whileTap={{ scale: 0.9 }}>
                <Button
                  onClick={toggleCamera}
                  sx={{
                    color: COLORS.azulCielo,
                    minWidth: 48,
                    borderRadius: '50%',
                  }}
                >
                  <FlipCameraIosIcon />
                </Button>
              </motion.div>
              <motion.div whileTap={{ scale: 0.9 }}>
                <Button
                  onClick={stopCamera}
                  sx={{
                    color: COLORS.riesgoAlto,
                    textTransform: 'none',
                    fontWeight: 600,
                  }}
                >
                  Cancelar
                </Button>
              </motion.div>
            </Stack>
          </motion.div>
        ) : (
          <motion.div
            key="initial"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Box
              sx={{
                ...glassmorphism,
                p: 4,
                mb: 3,
                textAlign: 'center',
              }}
            >
              <Stack spacing={3}>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<CameraAltIcon />}
                    onClick={startCamera}
                    fullWidth
                    sx={{
                      py: 2.5,
                      background: `linear-gradient(135deg, ${COLORS.verdeMusgo}, ${COLORS.oroIndigena})`,
                      textTransform: 'none',
                      fontWeight: 700,
                      fontSize: '1.05rem',
                      borderRadius: 3,
                      boxShadow: `0 6px 24px ${COLORS.verdeMusgo}40`,
                      '&:hover': {
                        background: `linear-gradient(135deg, ${COLORS.verdeSelva}, ${COLORS.ambarSolar})`,
                        boxShadow: `0 8px 32px ${COLORS.verdeMusgo}60`,
                      },
                    }}
                  >
                    Tomar Foto con Cámara
                  </Button>
                </motion.div>

                <Typography variant="body2" sx={{ color: COLORS.azulCielo, fontWeight: 500 }}>
                  o
                </Typography>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<CloudUploadIcon />}
                    onClick={() => fileInputRef.current?.click()}
                    fullWidth
                    sx={{
                      py: 2.5,
                      borderColor: COLORS.azulCielo,
                      color: COLORS.azulCielo,
                      textTransform: 'none',
                      fontWeight: 700,
                      fontSize: '1.05rem',
                      borderRadius: 3,
                      borderWidth: 2,
                      '&:hover': {
                        borderColor: COLORS.azulNoche,
                        bgcolor: COLORS.azulCielo + '10',
                        borderWidth: 2,
                      },
                    }}
                  >
                    Subir desde Archivo
                  </Button>
                </motion.div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleFileSelect}
                />
              </Stack>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>

      <canvas ref={canvasRef} style={{ display: 'none' }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Box
          sx={{
            ...glassmorphism,
            p: 2.5,
            background: `linear-gradient(135deg, ${COLORS.blancoNiebla}CC, rgba(255,255,255,0.7))`,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <LightbulbIcon sx={{ color: COLORS.oroIndigena, fontSize: 20 }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: COLORS.negroSelva }}>
              Consejos para mejor identificación
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: COLORS.azulNoche, lineHeight: 1.6 }}>
            &bull; Busca buena iluminación natural{'\n'}
            &bull; Captura la cara y el pico del ave{'\n'}
            &bull; Evita sombras sobre el plumaje{'\n'}
            &bull; Mantén la cámara estable
          </Typography>
        </Box>
      </motion.div>
    </Container>
  );
};
