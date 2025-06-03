import { Component, OnDestroy, OnInit } from '@angular/core';

import { SharedCommonModule, SharedMaterialModule } from '../../../shared/modules';
import { map, Observable, shareReplay, Subscription } from 'rxjs';
import { AuthService } from '../../../auth/auth.service';
import { ProfileService } from '../../../auth/user-profile/services/profile.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [
    SharedCommonModule,
    SharedMaterialModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit, OnDestroy {
  isUserLoggedIn = false;
  searchTerm: string = '';
  searchQuery = '';

  userName!: string;
  isHandset$: Observable<boolean>;
  userEmail = '';
  userInitials: string = '';
  userAvatar: string | null = null;
  private profileSubscription?: Subscription;
  
  constructor(
    private breakpointObserver: BreakpointObserver,
    private authService: AuthService,
    private profileService: ProfileService,
    private router: Router
  ) { 
    this.isHandset$ = this.breakpointObserver.observe(Breakpoints.Handset)
      .pipe(
        map(result => result.matches),
        shareReplay()
      );
      console.log((this.isHandset$));
  }

  async ngOnInit() {
    // Mock user email for demo - in real app, get from auth service
    //this.updateUserInitials();
    this.authService.isUserLoggedIn().subscribe(isLoggedIn => {
      this.isUserLoggedIn = isLoggedIn;
      if (isLoggedIn) {
        this.loadUserProfile()
      }
    });

    // Subscribe to profile updates
    this.profileSubscription = this.profileService.profileUpdated$.subscribe(() => {
      this.loadUserProfile();
    });
  }

  ngOnDestroy() {
    if (this.profileSubscription) {
      this.profileSubscription.unsubscribe();
    }
  }

  search(): void {
    // Handle search logic here
    console.log('Search term:', this.searchTerm);
  }

  

  onSearch(): void {
    if (this.searchQuery.trim()) {
      // Implement search functionality
      console.log('Searching for:', this.searchQuery);
    }
  }

  private loadUserProfile() {
    this.profileService.getProfile().subscribe(profile => {
      this.userName = `${profile.first_name} ${profile.last_name}`;
      this.userEmail = profile.email;
      this.userAvatar = profile.profileImage;
      this.updateUserInitials();
      this.userName = this.authService.getUserName();
      this.userInitials = this.getUserInitials(this.userName);
    },
    error => {
      console.error('Error loading user profile:', error);
      this.userName = 'User';
      this.authService.clearUserData();
      this.isUserLoggedIn = false;
      // Handle error (e.g., show a notification)
    }
  );
  }

  updateUserInitials() {
    this.userInitials = this.userName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  get isLoggedIn(): boolean {
    return this.isUserLoggedIn; //this.authService.isLoggedIn();
  }

  private getUserInitials(name: string): string {
    const names = name.split(' ');
    const initials = names.map(n => n[0]).join('');
    return initials.toUpperCase();
  }

  logout() {
    this.authService.logout().subscribe((response) => {
      console.log(response.message);
      this.router.navigate(['/auth/login']);
    });
  }
}
