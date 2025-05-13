import { ErrorHandler, Injectable } from '@angular/core';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  handleError(error: Error): void {
    console.error('An error occurred:', error);
    // Add your error handling logic here
    // For example: logging to a service, showing user-friendly messages, etc.
  }
}