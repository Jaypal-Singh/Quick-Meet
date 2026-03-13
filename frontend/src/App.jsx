import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AllRoutes from './pages/allRoutes/AllRoutes';
import { onMessageListener } from './firebase';
import { Snackbar, Alert } from '@mui/material';

function App() {
  const [showNotification, setShowNotification] = useState(false);
  const [notification, setNotification] = useState({ title: '', body: '' });

  useEffect(() => {
    const unsubscribe = onMessageListener((payload) => {
      setNotification({
        title: payload.notification.title,
        body: payload.notification.body,
      });
      setShowNotification(true);
      console.log('Foreground notification received:', payload);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  return (
    <div className="App">
      <Router>
        <AllRoutes />
      </Router>

      <Snackbar
        open={showNotification}
        autoHideDuration={6000}
        onClose={() => setShowNotification(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setShowNotification(false)} severity="info" sx={{ width: '100%' }}>
          <strong>{notification.title}</strong>: {notification.body}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default App;
