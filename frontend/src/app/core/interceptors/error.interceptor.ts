import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { AppError } from '../models/auth.model';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const appError: AppError = {
        status: error.status,
        error: error.error?.error || error.statusText,
        message: error.error?.message || 'An error occurred',
        timestamp: error.error?.timestamp || new Date().toISOString(),
        path: error.error?.path || req.url,
        fieldErrors: error.error?.fieldErrors
      };

      return throwError(() => appError);
    })
  );
};

