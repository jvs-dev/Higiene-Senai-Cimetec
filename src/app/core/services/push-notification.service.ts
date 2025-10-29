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
    // Initialize Firebase App
    const app = initializeApp(environment.firebase);
    // Initialize Firebase Messaging
    this.messaging = getMessaging(app);
  }

  // Request permission for push notifications
  requestPermission(): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          // Use the VAPID key from environment
          const vapidKey = environment.firebase.vapidKey;
          
          const token = await getToken(this.messaging, {
            vapidKey: vapidKey
          });
          console.log('FCM Token:', token);
          resolve(token);
        } else {
          reject('Permission denied');
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  // Listen for foreground messages
  listenForMessages(): void {
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
      icon: payload.notification?.icon || '/assets/icons/icon-72x72.png'
    };

    // Create notification
    new Notification(notificationTitle, notificationOptions);
  }

  // Method to send a test notification (for development)
  sendTestNotification(): void {
    // This would typically be called from your backend
    console.log('Would send test notification here');
  }
}