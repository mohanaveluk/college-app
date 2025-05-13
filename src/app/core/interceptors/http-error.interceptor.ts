import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMsg = '';
      if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMsg = `Error: ${error.error.message}`;
      } else if (error.error instanceof Object) {
        errorMsg = error.error.message;
      } else {
        // Server-side error
        errorMsg = `Error Code: ${error.status},  Message: ${error.message}`;
      }
      console.error(errorMsg);
      return throwError(() => new Error(errorMsg));
    })
  );
};