import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { ModalSucessComponent } from '../../shared/components/modal-sucess/modal-sucess.component';
import { ModalService } from '../services/modal/modal.service';
import { PushNotificationService } from '../services/push-notification.service';

@Component({
  selector: 'app-loyout',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, ModalSucessComponent],
  templateUrl: './loyout.component.html',
  styleUrl: './loyout.component.css'
})
export class LoyoutComponent implements OnInit {
  modalOpen = false;

  constructor(
    private modalService: ModalService,
    private pushNotificationService: PushNotificationService
  ) {}

  ngOnInit(): void {
    this.modalService.modal$.subscribe((open) => {
      this.modalOpen = open;
    });
    
    // Initialize push notifications
    this.initializePushNotifications();
  }
  
  private async initializePushNotifications(): Promise<void> {
    try {
      // Check if user is authenticated (this would be done in a real app)
      const token = localStorage.getItem('authToken');
      if (token) {
        // For demo purposes, we'll request permission on app load if user is authenticated
        // In a real app, you might want to do this after login
        console.log('Initializing push notifications for authenticated user');
      }
    } catch (error) {
      console.error('Error initializing push notifications:', error);
    }
  }
}