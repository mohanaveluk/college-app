import { ApplicationConfig, ErrorHandler, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimations, provideNoopAnimations } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { httpErrorInterceptor } from './core/interceptors/http-error.interceptor';
import { provideClientHydration } from '@angular/platform-browser';
import { GlobalErrorHandler } from './core/error-handling/global-error-handler';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { CoreModule } from './core/core.module';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';



export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideAnimationsAsync(),
    //provideAnimations(),
    //provideNoopAnimations(),

    provideRouter(routes),
    provideAnimations(),

    // provideHttpClient(     
    //   withInterceptors([
    //     httpErrorInterceptor, // Handle HTTP errors globally
    //   ])
    // ),
    provideHttpClient(withInterceptorsFromDi()),
    { 
      provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true 
    }, // Auth interceptor for handling authentication tokens
    
    provideClientHydration(), // Enables SSR hydration
    // Error Handling
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler,
    },
    // Interceptors
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: AuthInterceptor,
    //   multi: true
    // },
    // Material Design defaults
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        appearance: 'outline',
        hideRequiredMarker: false,
        floatLabel: 'auto'
      }
    },
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: {
        duration: 5000,
        horizontalPosition: 'end',
        verticalPosition: 'bottom'
      }
    },
    CoreModule,
  ],

};
