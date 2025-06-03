import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, Subject, tap, throwError } from 'rxjs';
import { ApiUrlBuilder } from '../../../shared/utility/api-url-builder';
import { ProfileUpdateRequest, UserProfile } from '../../../shared/models/user-profile.model';
import { AuthResponse } from '../../../shared/models/auth.model';
import { TokenService } from '../../../core/services/token.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = '/api/profile';
  private profileUpdatedSource = new Subject<void>();
  profileUpdated$ = this.profileUpdatedSource.asObservable();
  
  constructor(private http: HttpClient,
    private apiUrlBuilder: ApiUrlBuilder, 
    private tokenService: TokenService,
    private router: Router
  ) {}

  getProfile(): Observable<UserProfile> {
    const url = this.apiUrlBuilder.buildApiUrl('auth/profile');
    return this.http.get<UserProfile>(url).pipe(
      catchError(error => throwError(() => error))
    );
  }

  updateProfile(data: ProfileUpdateRequest): Observable<UserProfile> {
    const url = this.apiUrlBuilder.buildApiUrl('auth/profile');
    return this.http.put<UserProfile>(url, data).pipe(
      tap(() => this.profileUpdatedSource.next())
    );
  }

  uploadProfileImage(file: File): Observable<{ imageUrl: string }> {
    const formData = new FormData();
    formData.append('file', file);
    const url = this.apiUrlBuilder.buildApiUrl('auth/profile/image');
    return this.http.post<{ imageUrl: string }>(url, formData).pipe(
      tap(() => this.profileUpdatedSource.next())
    );
  }

  
}