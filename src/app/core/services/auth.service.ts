import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PushNotificationService } from './push-notification.service';
import { FcmBackendService } from './fcm-backend.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private pushNotificationService: PushNotificationService,
    private fcmBackendService: FcmBackendService
  ) {
    // Check if user is already authenticated (e.g., from localStorage)
    const token = localStorage.getItem('authToken');
    if (token) {
      this.isAuthenticatedSubject.next(true);
    }
  }

  async login(username: string, password: string): Promise<boolean> {
    // Simple authentication logic - in a real app, this would be an API call
    if (username && password) {
      // Set a fake token for demonstration
      localStorage.setItem('authToken', 'fake-jwt-token');
      this.isAuthenticatedSubject.next(true);
      
      // Request push notification permission for staff members
      try {
        const fcmToken = await this.pushNotificationService.requestPermission();
        console.log('FCM Token obtained:', fcmToken);
        
        // Register token with backend
        await this.fcmBackendService.registerToken(fcmToken);
        
        // Start listening for messages
        this.pushNotificationService.listenForMessages();
        console.log('Push notifications enabled for staff member');
        
        // Process any pending notifications
        await this.fcmBackendService.sendNotification({});
      } catch (error) {
        console.error('Failed to enable push notifications:', error);
      }
      
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem('authToken');
    this.isAuthenticatedSubject.next(false);
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }
}