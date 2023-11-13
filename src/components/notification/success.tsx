"use client";
import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

interface CustomizedSnackbarsProps {
  showNotification: boolean;
  onCloseNotification: () => void;
}

export default function CustomizedSnackbars({
  showNotification,
  onCloseNotification,
}: CustomizedSnackbarsProps) {
  return (
    <Stack spacing={2} sx={{ width: '100%' }}>
      <Snackbar
        open={showNotification}
        autoHideDuration={6000}
        onClose={onCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }} // Positioning the snackbar on the top right corner
      >
        <Alert onClose={onCloseNotification} severity="success" sx={{ width: '30vw', fontSize: '1.2rem', padding: '1rem' }}>
          This is a success message!
        </Alert>
      </Snackbar>
    </Stack>
  );
}