import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, CircularProgress, Stack, Tooltip } from '@mui/material';
import RotateRightIcon from '@mui/icons-material/RotateRight';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import FitScreenIcon from '@mui/icons-material/FitScreen';
import { BirdScene, Bird } from '@sisio/shared';

interface ARViewerProps {
  bird: Bird;
}

const BIRD_PHOTOS: Record<string, string> = {
  'aguila': '/assets/images/birds/aguila-real.jpg',
  'colibr': '/assets/images/birds/colibri-garganta-roja.jpg',
  'flamenco': '/assets/images/birds/flamenco-andino.jpg',
  'loro': '/assets/images/birds/loro-verde.jpg',
  'tucan': '/assets/images/birds/tucan-toco.jpg',
  'turpial': '/assets/images/birds/turpial.jpg',
};

const AR_PHOTOS: Record<string, string> = {
  'turpial': '/assets/images/birds/turpial-ar.jpg',
};

const BIRD_3D_MODELS: Record<string, string> = {
  'turpial': '/assets/models/turpial.glb',
};

function normalize(str: string): string {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

function getARPhoto(name: string): string | null {
  const lower = normalize(name);
  for (const [key, photo] of Object.entries(AR_PHOTOS)) {
    if (lower.includes(key)) return photo;
  }
  return null;
}

function get3DModel(name: string): string | null {
  const lower = normalize(name);
  for (const [key, model] of Object.entries(BIRD_3D_MODELS)) {
    if (lower.includes(key)) return model;
  }
  return null;
}

function getBirdPhoto(name: string): string | null {
  const lower = normalize(name);
  for (const [key, photo] of Object.entries(BIRD_PHOTOS)) {
    if (lower.includes(key)) return photo;
  }
  return null;
}

function getARFallback(name: string): string | null {
  return getARPhoto(name) || getBirdPhoto(name);
}

export const ARViewer: React.FC<ARViewerProps> = ({ bird }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<BirdScene | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const initScene = async () => {
      try {
        sceneRef.current = new BirdScene({
          canvas: canvasRef.current!,
          bird,
        });

        await sceneRef.current.initialize();
        setLoading(false);
      } catch (err: any) {
        setError(err.message || 'Error inicializando AR');
        setLoading(false);
      }
    };

    initScene();

    return () => {
      sceneRef.current?.dispose();
    };
  }, [bird]);

  const handleRotate = () => {
    sceneRef.current?.rotateModel(45);
  };

  const handleZoomIn = () => {
    sceneRef.current?.zoomModel(1.2);
  };

  const handleZoomOut = () => {
    sceneRef.current?.zoomModel(0.8);
  };

  const handleReset = () => {
    sceneRef.current?.resetModel();
  };

  const handleToggleWireframe = () => {
    sceneRef.current?.toggleWireframe();
  };

  const handleSnapshot = async () => {
    if (!sceneRef.current) return;
    try {
      const blob = await sceneRef.current.takeSnapshot();
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `sisio-${bird.nombre_cientifico}-ar.png`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.warn('Snapshot failed:', err);
    }
  };

  const photo = getARFallback(bird.nombre_cientifico || '') || getARFallback(bird.nombre_espanol || '');

  if (error || !sceneRef.current) {
    return (
      <Box sx={{ p: 2, textAlign: 'center', borderRadius: 3, overflow: 'hidden', background: 'rgba(255,255,255,0.03)' }}>
        {photo ? (
          <img src={photo} alt={bird.nombre_espanol || bird.nombre_cientifico} style={{ width: '100%', maxHeight: 300, objectFit: 'cover', borderRadius: 12 }} />
        ) : (
          <div style={{ fontSize: 80, padding: 20 }}>🦅</div>
        )}
        <div style={{ color: '#b0c4a0', marginTop: 8, fontSize: 14 }}>Visualizador 3D no disponible</div>
      </Box>
    );
  }

  return (
    <Box sx={{ position: 'relative', width: '100%', bgcolor: '#fafafa' }}>
      {loading && (
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 10,
          }}
        >
          <CircularProgress />
        </Box>
      )}

      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: 400,
          display: 'block',
          borderRadius: 8,
        }}
      />

      <Stack
        direction="row"
        spacing={1}
        sx={{
          mt: 2,
          p: 2,
          bgcolor: 'white',
          borderRadius: 2,
          flexWrap: 'wrap',
          gap: 1,
        }}
      >
        <Tooltip title="Rotar modelo">
          <Button
            size="small"
            variant="outlined"
            onClick={handleRotate}
            startIcon={<RotateRightIcon />}
          >
            Rotar
          </Button>
        </Tooltip>

        <Tooltip title="Zoom entrada">
          <Button
            size="small"
            variant="outlined"
            onClick={handleZoomIn}
            startIcon={<ZoomInIcon />}
          >
            Acercar
          </Button>
        </Tooltip>

        <Tooltip title="Zoom salida">
          <Button
            size="small"
            variant="outlined"
            onClick={handleZoomOut}
            startIcon={<ZoomOutIcon />}
          >
            Alejar
          </Button>
        </Tooltip>

        <Tooltip title="Resetear vista">
          <Button
            size="small"
            variant="outlined"
            onClick={handleReset}
            startIcon={<RestartAltIcon />}
          >
            Resetear
          </Button>
        </Tooltip>

        <Tooltip title="Toggle wireframe">
          <Button
            size="small"
            variant="outlined"
            onClick={handleToggleWireframe}
            startIcon={<FitScreenIcon />}
          >
            Wireframe
          </Button>
        </Tooltip>

        <Tooltip title="Tomar captura">
          <Button
            size="small"
            variant="contained"
            onClick={handleSnapshot}
          >
            📸 Captura
          </Button>
        </Tooltip>
      </Stack>
    </Box>
  );
};
