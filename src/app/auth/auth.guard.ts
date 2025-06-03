import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable, map, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    return this.authService.isUserLoggedIn().pipe(
      take(1),
      map(isLoggedIn => {
        if (isLoggedIn) {

          // Check subscription status for exam routes
          /*if (this.router.url.startsWith('/exam')) {
            return this.pricingService.getAccountInfo().pipe(
              map(info => {
                if (info.subscriptionStatus === 'expired') {
                  this.router.navigate(['/pricing/plans']);
                  return false;
                }
                return true;
              })
            );
          }*/
          
          return true;
        }

        // Store the attempted URL for redirecting
        this.authService.redirectUrl = state.url;

        // Navigate to the login page
        this.router.navigate(['/auth/login']);
        return false;
      }
    ));
  }
}