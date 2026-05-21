import React from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <Container maxWidth="sm" sx={{ py: 8 }}>
          <Box sx={{ textAlign: 'center' }}>
            <ErrorIcon sx={{ fontSize: 64, color: '#f44336', mb: 2 }} />
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
              Algo salió mal
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
              {this.state.error?.message || 'Ocurrió un error inesperado'}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button variant="contained" onClick={this.handleReset}>
                Intentar de nuevo
              </Button>
              <Button variant="outlined" onClick={() => window.location.reload()}>
                Recargar página
              </Button>
            </Box>
            {process.env.NODE_ENV === 'development' && (
              <Box
                component="pre"
                sx={{
                  mt: 3,
                  p: 2,
                  bgcolor: '#f5f5f5',
                  borderRadius: 1,
                  overflow: 'auto',
                  fontSize: 12,
                  textAlign: 'left',
                }}
              >
                {this.state.error?.stack}
              </Box>
            )}
          </Box>
        </Container>
      );
    }

    return this.props.children;
  }
}
