// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import axios from 'axios';
import server from './environment';

// Your web app's Firebase configuration
// REPLACE THIS WITH YOUR ACTUAL CONFIG FROM FIREBASE CONSOLE
const firebaseConfig = {
  apiKey: "AIzaSyCHlP71q9ZQ90_ozA1DUo3Xb5wBkKE7xf8",
  authDomain: "quickmeet-af798.firebaseapp.com",
  projectId: "quickmeet-af798",
  storageBucket: "quickmeet-af798.firebasestorage.app",
  messagingSenderId: "497787112271",
  appId: "1:497787112271:web:c63e40499f9b754a5a933a",
  measurementId: "G-XQ5KWW52S8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Use your VAPID key here
// Use your VAPID key here
const VAPID_KEY = "BPh9D2uKof2k_MehDVOEMS6f6-Kjn7QTMOvuk0uW-s0h2UHAjwnJGYFv_Y7wtqXv8ApXKlHZqZcrp4f_yc7I36g";

let isRegistering = false;

export const requestForToken = async () => {
  if (isRegistering) {
    console.log('FCM: Already registering, skipping duplicate request.');
    return;
  }

  isRegistering = true;
  try {
    console.log('FCM: Requesting notification permission...');
    const permission = await Notification.requestPermission();
    console.log('FCM: Notification permission status:', permission);
    
    if (permission === 'granted') {
      console.log('FCM: Initializing service worker registration...');
      let registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
      await navigator.serviceWorker.ready;
      
      console.log('FCM: Service worker ready. Requesting token...');
      try {
        const currentToken = await getToken(messaging, { 
          vapidKey: VAPID_KEY,
          serviceWorkerRegistration: registration
        });
        
        if (currentToken) {
          console.log('FCM: Token generated successfully!');
          const userToken = localStorage.getItem('token');
          if (userToken) {
            await axios.post(`${server}/api/v1/users/update_fcm_token`, {
              token: userToken,
              fcm_token: currentToken
            });
            console.log('FCM: Backend updated.');
          }
          return currentToken;
        }
      } catch (tokenErr) {
        console.warn('FCM: Token request failed, attempting auto-fix (unregister & retry)...', tokenErr);
        // UNREGISTER and RETRY ONCE
        await registration.unregister();
        registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
        await navigator.serviceWorker.ready;
        
        const retryToken = await getToken(messaging, { 
          vapidKey: VAPID_KEY,
          serviceWorkerRegistration: registration
        });
        if (retryToken) {
          console.log('FCM: Token generated successfully after auto-fix!');
          const userToken = localStorage.getItem('token');
          if (userToken) {
            await axios.post(`${server}/api/v1/users/update_fcm_token`, {
              token: userToken,
              fcm_token: retryToken
            });
            console.log('FCM: Backend updated after auto-fix.');
          }
          return retryToken;
        }
      }
    }
  } catch (err) {
    console.error('FCM: Fatal error during registration/token request:', err);
  } finally {
    isRegistering = false;
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log('Received foreground message:', payload);
      resolve(payload);
    });
  });
