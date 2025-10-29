import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FcmBackendService {
  private fcmUrl = 'https://fcm.googleapis.com/fcm/send';
  private serverKey = `key=${environment.firebase.apiKey}`;

  constructor() { }

  // Simulate sending notification to FCM
  async sendNotification(notificationData: any): Promise<void> {
    try {
      // In a real backend implementation, you would use the FCM Admin SDK
      // This is just a simulation of what the backend would do
      
      // Check if there are pending notifications in localStorage
      const pendingNotifications = JSON.parse(localStorage.getItem('pendingNotifications') || '[]');
      
      if (pendingNotifications.length > 0) {
        console.log('Processing pending notifications...');
        
        // Process each notification
        for (const notification of pendingNotifications) {
          // Simulate sending to FCM
          console.log('Sending notification to FCM:', notification);
          
          // In a real backend, you would do something like:
          /*
          const response = await fetch(this.fcmUrl, {
            method: 'POST',
            headers: {
              'Authorization': this.serverKey,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              notification: {
                title: notification.title,
                body: notification.body,
                icon: '/assets/icons/icon-72x72.png',
                click_action: '/dashboard'
              },
              to: '/topics/staff_notifications' // Send to all staff
              // Or send to specific tokens:
              // to: 'device_token_here'
            })
          });
          
          if (!response.ok) {
            throw new Error(`FCM request failed with status ${response.status}`);
          }
          */
        }
        
        // Clear processed notifications
        localStorage.removeItem('pendingNotifications');
        console.log('All notifications processed');
      }
    } catch (error) {
      console.error('Error processing notifications:', error);
      throw error;
    }
  }

  // Register device token for notifications
  async registerToken(token: string): Promise<void> {
    try {
      // In a real backend, you would store this token in a database
      // associated with the user so you can send targeted notifications
      const tokens = JSON.parse(localStorage.getItem('fcmTokens') || '[]');
      if (!tokens.includes(token)) {
        tokens.push(token);
        localStorage.setItem('fcmTokens', JSON.stringify(tokens));
      }
      console.log('Device token registered:', token);
    } catch (error) {
      console.error('Error registering token:', error);
      throw error;
    }
  }
}