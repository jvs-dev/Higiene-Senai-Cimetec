import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';
import { FirebaseService } from './core/services/firebase.service';
import { PushNotificationService } from './core/services/push-notification.service';
import { FcmBackendService } from './core/services/fcm-backend.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    FirebaseService,
    PushNotificationService,
    FcmBackendService
  ]
};