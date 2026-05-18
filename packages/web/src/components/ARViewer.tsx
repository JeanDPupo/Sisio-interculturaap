import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, CircularProgress, Stack, Tooltip } from '@mui/material';
import RotateRightIcon from '@mui/icons-material/RotateRight';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import FitScreenIcon from '@mui/icons-material/FitScreen';
import { BirdScene } from '@sisio/shared/babylon';
import { Bird } from '@sisio/shared';

interface ARViewerProps {
  bird: Bird;
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
    const blob = await sceneRef.current?.takeSnapshot();
    if (blob) {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sisio-${bird.nombre_cientifico}-ar.png`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: 'center', bgcolor: '#ffebee', borderRadius: 2 }}>
        <div style={{ color: '#c62828' }}>Error: {error}</div>
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
