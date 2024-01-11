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
  message : Message;
  showNotification: boolean;
  onCloseNotification: () => void;
}

type Message = {
  title : string,
  content : string,
}

export default function CustomizedSnackbars({
  message,
  showNotification,
  onCloseNotification,
}: CustomizedSnackbarsProps) {
  return (
    <Stack spacing={2} sx={{ width: '100%' }}>
      <Snackbar
        open={showNotification}
        autoHideDuration={1500}
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
                  backgroundColor: '#149064',
                  color:'white'
                }}>&#10004;</div>
              </div>
            ),
          }} severity="error" sx={{ width: '30vw', fontSize: '1.2rem', padding: '1rem',borderLeft: '4px solid #149064', backgroundColor: '#F6FBF9',color: 'black',}} >
          <span style={{ fontWeight: 'bold' }}>{message.title}</span>
          <br />
          <span style={{ fontSize: '0.9rem', color: 'grey' }}>{message.content}</span>
        </Alert>
      </Snackbar>
    </Stack>
  );
}