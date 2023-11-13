"use client";
import * as React from 'react';
import Stack from '@mui/material/Stack';
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
        autoHideDuration={2000}
        onClose={onCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }} // Positioning the snackbar on the top right corner
      >
        <Alert onClose={onCloseNotification} iconMapping={{
            error: (
              <div
                style={{
                  marginTop: "9px",
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'white',
                }}
              >
               <div style={{
                  width: '25px',
                  height: '25px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  backgroundColor: 'red',
                  color:'white'
                }}>&times;</div>
              </div>
            ),
          }} severity="error" sx={{ width: '30vw', fontSize: '1.2rem', padding: '1rem',borderLeft: '4px solid #FF0000', backgroundColor: '#FDF7F7',color: 'black',}} >
          <span style={{ fontWeight: 'bold' }}>Wrong ID or Key</span>
          <br />
          <span style={{ fontSize: '0.9rem', color: 'grey' }}>License ID or license key is wrong, please try again</span>
        </Alert>
      </Snackbar>
    </Stack>
  );
}