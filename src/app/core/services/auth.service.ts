import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor() {
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
      
      // Removed push notification setup as it's no longer needed
      
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