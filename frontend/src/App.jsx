import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AllRoutes from './pages/allRoutes/AllRoutes';
import { onMessageListener } from './firebase';
import { Snackbar, Alert, Button, Typography, Box } from '@mui/material';
import VideocamIcon from '@mui/icons-material/Videocam';

function App() {
  const [showNotification, setShowNotification] = useState(false);
  const [notification, setNotification] = useState({ title: '', body: '', data: {} });

  useEffect(() => {
    const unsubscribe = onMessageListener((payload) => {
      setNotification({
        title: payload.notification.title,
        body: payload.notification.body,
        data: payload.data || {}
      });
      setShowNotification(true);
      console.log('Foreground notification received:', payload);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const handleJoin = () => {
    if (notification.data?.meeting_code) {
      window.location.href = `/video-meet?roomID=${notification.data.meeting_code}`;
    } else if (notification.data?.meeting_link) {
        window.location.href = notification.data.meeting_link;
    }
    setShowNotification(false);
  };

  return (
    <div className="App">
      <Router>
        <AllRoutes />
      </Router>

      <Snackbar
        open={showNotification}
        autoHideDuration={8000}
        onClose={() => setShowNotification(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{ mt: 2 }}
      >
        <Box sx={{
            background: 'linear-gradient(135deg, #1C2230 0%, #131722 100%)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            p: 2,
            boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
            minWidth: '320px',
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5
        }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                    <Typography sx={{ color: 'white', fontWeight: 700, fontSize: '15px', mb: 0.5 }}>
                        {notification.title}
                    </Typography>
                    <Typography sx={{ color: '#9CA3AF', fontSize: '13px', lineHeight: 1.4 }}>
                        {notification.body}
                    </Typography>
                </Box>
                <Box sx={{ 
                    bgcolor: 'rgba(99, 102, 241, 0.15)', 
                    borderRadius: '50%', 
                    p: 1, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center' 
                }}>
                    <VideocamIcon sx={{ color: '#6366F1', fontSize: '20px' }} />
                </Box>
            </Box>

            {(notification.data?.meeting_code || notification.data?.meeting_link) && (
                <Button
                    fullWidth
                    variant="contained"
                    onClick={handleJoin}
                    sx={{
                        background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                        color: 'white',
                        fontWeight: 700,
                        textTransform: 'none',
                        borderRadius: '12px',
                        py: 1,
                        mt: 0.5,
                        '&:hover': {
                            background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
                            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)'
                        }
                    }}
                >
                    Join Meeting
                </Button>
            )}
            
            <Button 
                onClick={() => setShowNotification(false)}
                sx={{ 
                    color: '#6B7280', 
                    fontSize: '11px', 
                    textTransform: 'none', 
                    alignSelf: 'center',
                    minWidth: 'auto',
                    '&:hover': { color: 'white' }
                }}
            >
                Dismiss
            </Button>
        </Box>
      </Snackbar>
    </div>
  );
}

export default App;
