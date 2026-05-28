import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  LinearProgress,
  Stack,
  Alert,
} from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
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

const WaveformBar: React.FC<{ index: number; recording: boolean }> = ({ index, recording }) => {
  const [height, setHeight] = useState(20);

  React.useEffect(() => {
    if (!recording) {
      setHeight(20);
      return;
    }
    const interval = setInterval(() => {
      setHeight(Math.random() * 60 + 15);
    }, 120 + index * 20);
    return () => clearInterval(interval);
  }, [recording, index]);

  return (
    <motion.div
      animate={{ height }}
      transition={{ type: 'spring', stiffness: 300, damping: 15 }}
      style={{
        width: 4,
        borderRadius: 2,
        background: `linear-gradient(to top, ${COLORS.verdeMusgo}, ${COLORS.oroIndigena})`,
      }}
    />
  );
};

const ConcentricRings: React.FC = () => (
  <Box sx={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
    {[1, 2, 3].map((ring) => (
      <motion.div
        key={ring}
        initial={{ scale: 1, opacity: 0.6 }}
        animate={{ scale: [1, 1.8 + ring * 0.3], opacity: [0.5, 0] }}
        transition={{
          duration: 1.8,
          repeat: Infinity,
          delay: ring * 0.3,
          ease: 'easeOut',
        }}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: 100,
          height: 100,
          marginTop: -50,
          marginLeft: -50,
          borderRadius: '50%',
          border: `2px solid ${COLORS.riesgoAlto}`,
        }}
      />
    ))}
  </Box>
);

export const AudioUploadPage: React.FC = () => {
  const navigate = useNavigate();
  const { identifyFromAudio, loading } = useBird();
  const { isOnline, addAudioToQueue } = useOffline();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chunksRef = useRef<Blob[]>([]);

  const [recording, setRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [timer, setTimer] = useState(0);
  const [queued, setQueued] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startRecording = useCallback(async () => {
    try {
      setError(null);
      chunksRef.current = [];
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4',
      });

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mediaRecorder.mimeType });
        setRecordedBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        setRecording(false);
        if (timerRef.current) clearInterval(timerRef.current);
        setTimer(0);
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((t) => t.stop());
          streamRef.current = null;
        }
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(250);
      setRecording(true);

      timerRef.current = setInterval(() => {
        setTimer((t) => t + 1);
      }, 1000);
    } catch {
      setError('No se pudo acceder al micrófono. Verifica los permisos.');
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('audio/')) {
      setRecordedBlob(file);
      setAudioUrl(URL.createObjectURL(file));
    }
  }, []);

  const handleIdentify = async () => {
    if (!recordedBlob) return;

    if (!isOnline) {
      const reader = new FileReader();
      reader.onloadend = () => {
        addAudioToQueue(reader.result as string);
        setQueued(true);
      };
      reader.readAsDataURL(recordedBlob);
      return;
    }

    const ext = recordedBlob.type.includes('webm') ? 'webm' : 'mp4';
    const file = new File([recordedBlob], `audio.${ext}`, { type: recordedBlob.type });
    try {
      setUploadProgress(10);
      await identifyFromAudio(file);
      setUploadProgress(100);
      setTimeout(() => navigate('/bird-result'), 1000);
    } catch {
      setError('Error identificando audio');
      setUploadProgress(0);
    }
  };

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
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
          Identificar Ave por Canto
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
              Audio guardado en cola offline. Se procesará cuando haya conexión.
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 3,
        }}
      >
        <Box sx={{ flex: 1 }}>
          <AnimatePresence mode="wait">
            {audioUrl ? (
              <motion.div
                key="player"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <Stack spacing={2}>
                  <Box sx={{ ...glassmorphism, p: 3 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 600, mb: 2, color: COLORS.negroSelva }}
                    >
                      Audio capturado
                    </Typography>

                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        mb: 2,
                      }}
                    >
                      <motion.div whileTap={{ scale: 0.9 }}>
                        <Button
                          onClick={handlePlayPause}
                          sx={{
                            width: 56,
                            height: 56,
                            minWidth: 0,
                            borderRadius: '50%',
                            background: `linear-gradient(135deg, ${COLORS.oroIndigena}, ${COLORS.ambarSolar})`,
                            color: COLORS.negroSelva,
                            '&:hover': {
                              background: `linear-gradient(135deg, ${COLORS.ambarSolar}, ${COLORS.oroIndigena})`,
                            },
                          }}
                        >
                          {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
                        </Button>
                      </motion.div>

                      <Box sx={{ flex: 1 }}>
                        <audio
                          ref={audioRef}
                          src={audioUrl}
                          onEnded={() => setIsPlaying(false)}
                          style={{ display: 'none' }}
                        />
                        <Box
                          sx={{
                            height: 6,
                            borderRadius: 3,
                            bgcolor: 'rgba(0,0,0,0.08)',
                            overflow: 'hidden',
                          }}
                        >
                          <motion.div
                            style={{
                              height: '100%',
                              borderRadius: 3,
                              background: `linear-gradient(90deg, ${COLORS.oroIndigena}, ${COLORS.ambarSolar})`,
                            }}
                            initial={{ width: '0%' }}
                            animate={{ width: '60%' }}
                            transition={{ duration: 1 }}
                          />
                        </Box>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            mt: 0.5,
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{ fontFamily: 'monospace', color: COLORS.azulNoche }}
                          >
                            00:00
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ fontFamily: 'monospace', color: COLORS.azulNoche }}
                          >
                            {formatTime(timer || 5)}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>

                  {uploadProgress > 0 && uploadProgress < 100 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                    >
                      <Box sx={{ ...glassmorphism, p: 2 }}>
                        <Typography variant="body2" sx={{ mb: 1, color: COLORS.azulCielo }}>
                          Identificando ave...
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={uploadProgress}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            bgcolor: 'rgba(0,0,0,0.06)',
                            '& .MuiLinearProgress-bar': {
                              borderRadius: 4,
                              background: `linear-gradient(90deg, ${COLORS.verdeMusgo}, ${COLORS.oroIndigena})`,
                            },
                          }}
                        />
                      </Box>
                    </motion.div>
                  )}

                  <Stack direction="row" spacing={2}>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        setRecordedBlob(null);
                        setAudioUrl('');
                        setQueued(false);
                        setUploadProgress(0);
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
                      Nuevo Audio
                    </Button>
                    <Button
                      variant="contained"
                      onClick={handleIdentify}
                      disabled={loading || uploadProgress > 0}
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
                </Stack>
              </motion.div>
            ) : recording ? (
              <motion.div
                key="recording"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <Box
                  sx={{
                    ...glassmorphism,
                    p: 4,
                    textAlign: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                    border: `2px solid ${COLORS.riesgoAlto}40`,
                  }}
                >
                  <ConcentricRings />

                  <Typography
                    variant="h2"
                    sx={{
                      fontFamily: 'monospace',
                      fontWeight: 700,
                      color: COLORS.riesgoAlto,
                      mb: 1,
                      position: 'relative',
                      zIndex: 1,
                    }}
                  >
                    {formatTime(timer)}
                  </Typography>

                  <Typography
                    variant="body1"
                    sx={{ color: COLORS.riesgoAlto, fontWeight: 500, mb: 3, position: 'relative', zIndex: 1 }}
                  >
                    Grabando...
                  </Typography>

                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      gap: 1,
                      mb: 3,
                      height: 80,
                      alignItems: 'flex-end',
                      position: 'relative',
                      zIndex: 1,
                    }}
                  >
                    {Array.from({ length: 20 }).map((_, i) => (
                      <WaveformBar key={i} index={i} recording={recording} />
                    ))}
                  </Box>

                  <motion.div whileTap={{ scale: 0.9 }} style={{ position: 'relative', zIndex: 1 }}>
                    <Button
                      variant="contained"
                      size="large"
                      startIcon={<StopIcon />}
                      onClick={stopRecording}
                      sx={{
                        bgcolor: COLORS.riesgoAlto,
                        textTransform: 'none',
                        fontWeight: 700,
                        borderRadius: 3,
                        px: 4,
                        py: 1.5,
                        '&:hover': { bgcolor: '#D32F2F' },
                      }}
                    >
                      Detener Grabación
                    </Button>
                  </motion.div>
                </Box>
              </motion.div>
            ) : (
              <motion.div
                key="idle"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Box sx={{ ...glassmorphism, p: 4, textAlign: 'center' }}>
                  <Stack spacing={3} alignItems="center">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="contained"
                        size="large"
                        startIcon={<MicIcon />}
                        onClick={startRecording}
                        sx={{
                          py: 3,
                          px: 5,
                          width: 160,
                          height: 160,
                          borderRadius: '50%',
                          minWidth: 0,
                          background: `linear-gradient(135deg, ${COLORS.oroIndigena}, ${COLORS.ambarSolar})`,
                          color: COLORS.negroSelva,
                          boxShadow: `0 8px 32px ${COLORS.oroIndigena}50`,
                          '&:hover': {
                            background: `linear-gradient(135deg, ${COLORS.ambarSolar}, ${COLORS.oroIndigena})`,
                            boxShadow: `0 12px 40px ${COLORS.oroIndigena}70`,
                          },
                          fontSize: '1.1rem',
                          fontWeight: 700,
                          textTransform: 'none',
                          flexDirection: 'column',
                          gap: 1,
                        }}
                      >
                        <MicIcon sx={{ fontSize: 40 }} />
                        Grabar
                      </Button>
                    </motion.div>

                    <Typography variant="body2" sx={{ color: COLORS.azulCielo, fontWeight: 500 }}>
                      o
                    </Typography>

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      style={{ width: '100%' }}
                    >
                      <Paper
                        sx={{
                          p: 3,
                          textAlign: 'center',
                          border: `2px dashed ${COLORS.azulCielo}`,
                          borderRadius: 3,
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          '&:hover': {
                            bgcolor: COLORS.azulCielo + '08',
                            borderColor: COLORS.azulNoche,
                          },
                        }}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <CloudUploadIcon
                          sx={{ fontSize: 48, color: COLORS.azulCielo, mb: 1 }}
                        />
                        <Typography variant="h6" sx={{ color: COLORS.negroSelva, fontWeight: 600, mb: 0.5 }}>
                          Subir archivo de audio
                        </Typography>
                        <Typography variant="caption" sx={{ color: COLORS.azulCielo }}>
                          MP3, WAV, OGG, M4A
                        </Typography>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="audio/*"
                          hidden
                          onChange={handleFileSelect}
                        />
                      </Paper>
                    </motion.div>
                  </Stack>
                </Box>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>

        <Box sx={{ width: { xs: '100%', md: 280 }, flexShrink: 0 }}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
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
                &bull; Graba en ambiente tranquilo sin ruido de fondo{'\n'}
                &bull; Mínimo 5-10 segundos de canto del ave{'\n'}
                &bull; Evita sonidos fuertes o distorsionados{'\n'}
                &bull; Acércate lo más posible al ave
              </Typography>
            </Box>
          </motion.div>
        </Box>
      </Box>
    </Container>
  );
};
