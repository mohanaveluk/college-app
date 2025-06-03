import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { RbacService } from './rbac.service';

@Injectable({
  providedIn: 'root'
})
export class PermissionGuard implements CanActivate {
  constructor(
    private rbacService: RbacService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    const resource = route.data['resource'];
    const action = route.data['action'] || 'view';

    return this.rbacService.hasPermission(resource, action).pipe(
      tap(hasPermission => {
        if (!hasPermission) {
          this.router.navigate(['/unauthorized']);
        }
      })
    );
  }
}