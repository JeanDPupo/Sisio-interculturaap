import React, { useState } from 'react';
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
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import { useBird } from '@sisio/shared';

export const AudioUploadPage: React.FC = () => {
  const navigate = useNavigate();
  const { identifyFromAudio, identifying } = useBird();
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const audioRef = React.useRef<HTMLAudioElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('audio/')) {
      setAudioFile(file);
      setAudioUrl(URL.createObjectURL(file));
      setUploadProgress(0);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith('audio/')) {
      setAudioFile(file);
      setAudioUrl(URL.createObjectURL(file));
    }
  };

  const handleIdentify = async () => {
    if (!audioFile) return;

    try {
      setUploadProgress(10);
      await identifyFromAudio(audioFile);
      setUploadProgress(100);
      setTimeout(() => navigate('/bird-result'), 1000);
    } catch (error) {
      alert('Error identificando audio');
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

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600, textAlign: 'center' }}>
        🔊 Cargar Audio de Ave
      </Typography>

      <Paper
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        sx={{
          p: 4,
          textAlign: 'center',
          border: '2px dashed #1976d2',
          borderRadius: 2,
          cursor: 'pointer',
          bgcolor: '#f5f5f5',
          transition: 'all 0.3s ease',
          mb: 3,
          '&:hover': {
            bgcolor: '#e3f2fd',
            borderColor: '#1565c0',
          },
        }}
      >
        <input
          type="file"
          accept="audio/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
          id="audio-input"
        />
        <label htmlFor="audio-input" style={{ cursor: 'pointer', display: 'block' }}>
          <CloudUploadIcon sx={{ fontSize: 48, color: '#1976d2', mb: 1 }} />
          <Typography variant="h6" sx={{ mb: 1 }}>
            Arrastra tu audio aquí
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            o haz clic para seleccionar un archivo
          </Typography>
          <Typography variant="caption" sx={{ display: 'block', mb: 2, color: '#666' }}>
            Formatos soportados: MP3, WAV, OGG, M4A (máx 10MB)
          </Typography>
          <Button variant="outlined" component="span">
            Seleccionar Audio
          </Button>
        </label>
      </Paper>

      {audioFile && (
        <Stack spacing={2} sx={{ mb: 3 }}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                📁 Archivo Cargado
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                {audioFile.name}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="caption" color="textSecondary">
                  {(audioFile.size / 1024 / 1024).toFixed(2)} MB
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

          <Card sx={{ bgcolor: '#e8f5e9', borderLeft: '4px solid #4CAF50' }}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                💡 Consejos para mejor identificación
              </Typography>
              <Typography variant="body2" component="div">
                <ul style={{ margin: 0, paddingLeft: 20 }}>
                  <li>Graba en ambiente tranquilo sin ruido de fondo</li>
                  <li>Mínimo 5-10 segundos de canto del ave</li>
                  <li>Evita sonidos fuertes o distorsionados</li>
                  <li>Audio en formato MP3, WAV o similar</li>
                </ul>
              </Typography>
            </CardContent>
          </Card>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => {
                setAudioFile(null);
                setAudioUrl('');
              }}
              fullWidth
            >
              Cancelar
            </Button>
            <Button
              variant="contained"
              onClick={handleIdentify}
              disabled={identifying || uploadProgress > 0}
              fullWidth
            >
              {identifying ? <CircularProgress size={24} /> : 'Identificar Ave'}
            </Button>
          </Box>
        </Stack>
      )}
    </Container>
  );
};
