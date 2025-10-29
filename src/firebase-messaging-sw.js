// Import and configure the Firebase SDK
importScripts('https://www.gstatic.com/firebasejs/9.6.10/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.10/firebase-messaging-compat.js');

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAv4L9vCX4mRkX1Ly12LJyf-J3LND1nxjU",
  authDomain: "sanittrack.firebaseapp.com",
  projectId: "sanittrack",
  storageBucket: "sanittrack.firebasestorage.app",
  messagingSenderId: "428022424629",
  appId: "1:428022424629:web:6572e39ce135922feafd7c"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Retrieve Firebase Messaging object
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage(function(payload) {
  console.log('Received background message:', payload);
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon || '/assets/icons/icon-72x72.png'
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});