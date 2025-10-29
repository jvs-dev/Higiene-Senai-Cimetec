import { Injectable } from '@angular/core';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { environment } from '../../../environments/environment';
import { initializeApp } from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {
  private messaging: any;

  constructor() {
    try {
      // Initialize Firebase App
      const app = initializeApp(environment.firebase);
      // Initialize Firebase Messaging
      this.messaging = getMessaging(app);
    } catch (error) {
      console.error('Error initializing Firebase Messaging:', error);
    }
  }

  // Request permission for push notifications
  requestPermission(): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        if (!this.messaging) {
          reject('Firebase Messaging not initialized');
          return;
        }

        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          // Use the VAPID key from environment
          const vapidKey = environment.firebase.vapidKey;
          
          const token = await getToken(this.messaging, {
            vapidKey: vapidKey
          });
          
          if (token) {
            console.log('FCM Token:', token);
            resolve(token);
          } else {
            reject('No registration token available');
          }
        } else {
          reject('Permission denied');
        }
      } catch (error) {
        console.error('Error getting FCM token:', error);
        reject(error);
      }
    });
  }

  // Listen for foreground messages
  listenForMessages(): void {
    if (!this.messaging) {
      console.error('Firebase Messaging not initialized');
      return;
    }

    onMessage(this.messaging, (payload) => {
      console.log('Message received in foreground:', payload);
      // Customize how you want to handle foreground messages
      // For example, show a custom notification or update UI
      this.showCustomNotification(payload);
    });
  }

  // Show custom notification when app is in foreground
  private showCustomNotification(payload: any): void {
    // Extract notification data
    const notificationTitle = payload.notification?.title || 'Nova notificação';
    const notificationOptions = {
      body: payload.notification?.body || 'Você tem uma nova notificação',
      icon: payload.notification?.icon || '/assets/icons/icon-72x72.png',
      data: payload.data || {}
    };

    // Create notification
    const notification = new Notification(notificationTitle, notificationOptions);
    
    // Handle click event
    notification.onclick = (event) => {
      event.preventDefault();
      // Handle notification click - for example, navigate to dashboard
      window.open('/dashboard', '_blank');
    };
  }

  // Method to send a test notification (for development)
  sendTestNotification(): void {
    // This would typically be called from your backend
    console.log('Would send test notification here');
  }
}