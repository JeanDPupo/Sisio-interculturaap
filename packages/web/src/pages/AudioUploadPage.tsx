import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Card,
  CardContent,
  LinearProgress,
  CircularProgress,
  Stack,
  Alert,
} from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useBird, useOffline } from '@sisio/shared';

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
    } catch (err) {
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
    if (!recordedBlob) {
      alert('Primero graba o selecciona un audio');
      return;
    }

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
    } catch (err) {
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
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, textAlign: 'center' }}>
        Identificar Ave por Canto
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {queued && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Audio guardado en cola offline. Se procesará cuando haya conexión.
        </Alert>
      )}

      {audioUrl ? (
        <Stack spacing={2} sx={{ mb: 3 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Audio capturado
                </Typography>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={isPlaying ? <StopIcon /> : <PlayArrowIcon />}
                  onClick={handlePlayPause}
                >
                  {isPlaying ? 'Detener' : 'Reproducir'}
                </Button>
              </Box>
              <audio
                ref={audioRef}
                src={audioUrl}
                onEnded={() => setIsPlaying(false)}
                style={{ width: '100%' }}
              />
            </CardContent>
          </Card>

          {uploadProgress > 0 && uploadProgress < 100 && (
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <CircularProgress size={24} />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Identificando ave...
                    </Typography>
                    <LinearProgress variant="determinate" value={uploadProgress} />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          )}

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => {
                setRecordedBlob(null);
                setAudioUrl('');
                setQueued(false);
              }}
              fullWidth
            >
              Nuevo Audio
            </Button>
            <Button
              variant="contained"
              onClick={handleIdentify}
              disabled={loading || uploadProgress > 0}
              fullWidth
            >
              {loading ? <CircularProgress size={24} /> : isOnline ? 'Identificar Ave' : 'Guardar para después'}
            </Button>
          </Box>
        </Stack>
      ) : (
        <Stack spacing={2}>
          {recording ? (
            <Paper
              sx={{
                p: 4,
                textAlign: 'center',
                bgcolor: '#ffebee',
                border: '2px solid #f44336',
                borderRadius: 2,
              }}
            >
              <Typography variant="h3" sx={{ mb: 2, fontFamily: 'monospace' }}>
                {formatTime(timer)}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2, color: '#d32f2f' }}>
                Grabando...
              </Typography>
              <Button
                variant="contained"
                color="error"
                size="large"
                startIcon={<StopIcon />}
                onClick={stopRecording}
              >
                Detener Grabación
              </Button>
            </Paper>
          ) : (
            <>
              <Button
                variant="contained"
                size="large"
                startIcon={<MicIcon />}
                onClick={startRecording}
                sx={{ py: 3 }}
              >
                Iniciar Grabación
              </Button>

              <Typography variant="body2" color="textSecondary" textAlign="center">o</Typography>

              <Paper
                sx={{
                  p: 3,
                  textAlign: 'center',
                  border: '2px dashed #1976d2',
                  borderRadius: 2,
                  cursor: 'pointer',
                  '&:hover': { bgcolor: '#f5f5f5' },
                }}
                onClick={() => fileInputRef.current?.click()}
              >
                <CloudUploadIcon sx={{ fontSize: 48, color: '#1976d2', mb: 1 }} />
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Subir archivo de audio
                </Typography>
                <Typography variant="caption" color="textSecondary">
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
            </>
          )}

          <Card sx={{ bgcolor: '#e8f5e9', borderLeft: '4px solid #4CAF50' }}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Consejos para mejor identificación
              </Typography>
              <Typography variant="body2" component="div">
                <ul style={{ margin: 0, paddingLeft: 20 }}>
                  <li>Graba en ambiente tranquilo sin ruido de fondo</li>
                  <li>Mínimo 5-10 segundos de canto del ave</li>
                  <li>Evita sonidos fuertes o distorsionados</li>
                  <li>Acércate lo más posible al ave</li>
                </ul>
              </Typography>
            </CardContent>
          </Card>
        </Stack>
      )}
    </Container>
  );
};
