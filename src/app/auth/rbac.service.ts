import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, shareReplay, tap } from 'rxjs/operators';
import { Group, Permission } from '../../shared/models/group.model';
import { ApiUrlBuilder } from '../../shared/utility/api-url-builder';
import { CreatePermissionDto } from '../../shared/models/permission/create-permission.dto';
import { UpdatePermissionDto } from '../../shared/models/permission/update-permission.dto';

@Injectable({
  providedIn: 'root'
})
export class RbacService {
    private userPermissionsCache$?: Observable<Permission[]>;
    private permissionsCache$?: Observable<Permission[]>;

    constructor(private http: HttpClient,
        private apiUrlBuilder: ApiUrlBuilder,
    ) { }

    getUserPermissions(): Observable<Permission[]> {
        if (!this.userPermissionsCache$) {
            const requestApi = this.apiUrlBuilder.buildApiUrl('auth/permissions');
            this.userPermissionsCache$ = this.http.get<Permission[]>(requestApi).pipe(
                shareReplay(1)
            );
        }
        return this.userPermissionsCache$;
    }

    hasPermission(resource: string, action: string = 'view'): Observable<boolean> {
        return this.getUserPermissions().pipe(
            map(permissions => permissions.some(
                p => p.resource === resource && p.action === action
            ))
        );
    }

    clearPermissionsCache(): void {
        this.userPermissionsCache$ = undefined;
    }

    // Group Management
    createGroup(group: Partial<Group>): Observable<Group> {
        const requestApi = this.apiUrlBuilder.buildApiUrl('groups');
        return this.http.post<Group>(requestApi, group);
    }

    updateGroup(groupId: string, updates: Partial<Group>): Observable<Group> {
        const requestApi = this.apiUrlBuilder.buildApiUrl(`groups/${groupId}`);
        return this.http.put<Group>(requestApi, updates);
    }

    deleteGroup(groupId: string): Observable<void> {
        const requestApi = this.apiUrlBuilder.buildApiUrl(`groups/${groupId}`);
        return this.http.delete<void>(requestApi);
    }

    getGroups(userId: string): Observable<Group[]> {
        const requestApi = this.apiUrlBuilder.buildApiUrl(`groups`);
        return this.http.get<Group[]>(requestApi);
    }

    // User-Group Management
    addUserToGroup(userId: string, groupId: string): Observable<void> {
        const requestApi = this.apiUrlBuilder.buildApiUrl('user-groups');
        return this.http.post<void>(requestApi, { userId, groupId }).pipe(
            tap(() => this.clearPermissionsCache())
        );
    }

    removeUserFromGroup(userId: string, groupId: string): Observable<void> {
        const requestApi = this.apiUrlBuilder.buildApiUrl(`user-groups/${userId}/${groupId}`);
        return this.http.delete<void>(requestApi).pipe(
            tap(() => this.clearPermissionsCache())
        );
    }

    getUserGroups(userId: string): Observable<Group[]> {
        const requestApi = this.apiUrlBuilder.buildApiUrl(`users/${userId}/groups`);
        return this.http.get<Group[]>(requestApi);
    }

    getMyGroups(): Observable<Group[]> {
        const requestApi = this.apiUrlBuilder.buildApiUrl(`users/groups`);
        return this.http.get<Group[]>(requestApi);
    }

    getAllGroupsWithUsers(): Observable<Group[]> {
        const requestApi = this.apiUrlBuilder.buildApiUrl(`groups/with-users`);
        return this.http.get<Group[]>(requestApi);
    }

    clearResourcePermissionsCache(): void {
        this.permissionsCache$ = undefined;
    }

    createPermission(dto: CreatePermissionDto): Observable<Permission[]> {
        const requestApi = this.apiUrlBuilder.buildApiUrl(`permissions`);
        return this.http.post<Permission[]>(requestApi, dto).pipe(
            tap(() => this.clearResourcePermissionsCache())
        );
    }

    updatePermission(resource: string, dto: UpdatePermissionDto): Observable<Permission[]> {
        const requestApi = this.apiUrlBuilder.buildApiUrl(`permissions/${resource}`);
        return this.http.put<Permission[]>(requestApi, dto).pipe(
            tap(() => this.clearResourcePermissionsCache())
        );
    }

    getPermissions(): Observable<Permission[]> {
        const requestApi = this.apiUrlBuilder.buildApiUrl(`permissions`);
        if (!this.permissionsCache$) {
            this.permissionsCache$ = this.http.get<Permission[]>(requestApi).pipe(
                shareReplay(1)
            );
        }
        return this.permissionsCache$;
    }

    getPermissionsByResource(resource: string): Observable<Permission[]> {
        const requestApi = this.apiUrlBuilder.buildApiUrl(`permissions/${resource}`);
        return this.http.get<Permission[]>(requestApi);
    }

    deletePermission(resource: string): Observable<void> {
        const requestApi = this.apiUrlBuilder.buildApiUrl(`permissions/${resource}`);
        return this.http.delete<void>(requestApi).pipe(
            tap(() => this.clearResourcePermissionsCache())
        );
      }
}