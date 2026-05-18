import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  CircularProgress,
  Alert,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useBird } from '@sisio/shared';

export const PhotoUploadPage: React.FC = () => {
  const navigate = useNavigate();
  const { identifyFromPhoto, loading, error } = useBird();
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleIdentify = async () => {
    if (!file) {
      alert('Por favor selecciona una foto');
      return;
    }

    try {
      await identifyFromPhoto(file);
      navigate('/bird-result');
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
        📸 Identificar Ave por Fotografía
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {preview ? (
        <Box>
          <Paper sx={{ mb: 2, overflow: 'hidden' }}>
            <img
              src={preview}
              alt="Preview"
              style={{ width: '100%', maxHeight: 400, objectFit: 'cover' }}
            />
          </Paper>

          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <Button
              variant="outlined"
              onClick={() => {
                setPreview(null);
                setFile(null);
              }}
              fullWidth
            >
              Cambiar Foto
            </Button>
            <Button
              variant="contained"
              onClick={handleIdentify}
              disabled={loading}
              fullWidth
            >
              {loading ? <CircularProgress size={24} /> : 'Identificar Ave 🦅'}
            </Button>
          </Box>
        </Box>
      ) : (
        <Paper
          sx={{
            p: 4,
            textAlign: 'center',
            border: '2px dashed #2196F3',
            cursor: 'pointer',
            '&:hover': { bgcolor: '#f5f5f5' },
            mb: 2,
          }}
          component="label"
        >
          <CloudUploadIcon sx={{ fontSize: 48, color: '#2196F3', mb: 2 }} />
          <Typography variant="h6" sx={{ mb: 1 }}>
            Sube una foto
          </Typography>
          <Typography variant="body2" color="textSecondary">
            O arrastra una imagen aquí
          </Typography>
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={handleFileSelect}
          />
        </Paper>
      )}

      <Paper sx={{ p: 2, bgcolor: '#f5f5f5' }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
          💡 Consejos
        </Typography>
        <Typography variant="body2" color="textSecondary">
          • Busca buena iluminación{'\n'}• Captura la cara del ave{'\n'}• Evita sombras
        </Typography>
      </Paper>
    </Container>
  );
};
