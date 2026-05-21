import React from 'react';
import { Snackbar, Alert } from '@mui/material';
import { useOffline } from '@sisio/shared';

export const OfflineIndicator: React.FC = () => {
  const { isOnline } = useOffline();
  const [showAlert, setShowAlert] = React.useState(!isOnline);

  React.useEffect(() => {
    setShowAlert(!isOnline);
  }, [isOnline]);

  return (
    <Snackbar
      open={showAlert && !isOnline}
      autoHideDuration={null}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert
        severity="warning"
        onClose={() => setShowAlert(false)}
        sx={{ width: '100%' }}
      >
        📴 Sin conexión - Los cambios se guardarán localmente
      </Alert>
    </Snackbar>
  );
};
