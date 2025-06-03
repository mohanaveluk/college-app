import { Component, Input, ViewChild } from '@angular/core';
import { College } from '../../../core/models/college.model';
import { MatMenuTrigger } from '@angular/material/menu';
import { Router } from '@angular/router';
import { SharedCommonModule, SharedMaterialModule } from '../../../shared/modules';
import { CollegeModel } from '../../../core/models/search-response.model';
import { TruncatePipe } from "../../../shared/utility/truncate.pipe";
import { CapitalizePipe } from "../../../shared/utility/capitalize.pipe";
import { ImageFallbackPipe } from "../../../shared/utility/image-fallback.pipe";
import { CollegeService } from '../../../core/services/college.service';
import { RecentCollege } from '../../../core/models/recent-college.model';
import { MatDialog } from '@angular/material/dialog';
import { ShareDialogComponent } from '../share-dialog/share-dialog.component';
import { EmailService } from '../../../shared/services/email.service';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-college-info-card-map',
  imports: [
    SharedCommonModule,
    SharedMaterialModule,
    TruncatePipe,
    CapitalizePipe,
    ImageFallbackPipe
],
  templateUrl: './college-info-card-map.component.html',
  styleUrl: './college-info-card-map.component.scss'
})
export class CollegeInfoCardMapComponent {
  @Input() college!: CollegeModel;
  @Input() viewMode: 'grid' | 'list' = 'grid';
  @ViewChild(MatMenuTrigger) menuTrigger!: MatMenuTrigger;

  isUserLoggedIn = false;
  error: string | null = null;
  recentCollege: RecentCollege[] = [];

  constructor(
    private router: Router,
    private collegeService: CollegeService,
    private emailService: EmailService,
    private authService: AuthService,
    
    private dialog: MatDialog) {
    this.authService.isUserLoggedIn().subscribe(isLoggedIn => {
      this.isUserLoggedIn = isLoggedIn;
    });
  }

  onCardClick(event: MouseEvent): void {
    // Don't navigate if clicking on the menu trigger or menu items
    if (!(event.target as HTMLElement).closest('.menu-trigger, .mat-menu-item')) {
      this.router.navigate(['/colleges', this.college.id]);
    }
  }

  saveCollege(event: MouseEvent): void {
    const collegeId = this.college.id;
    // Check if the user is logged in before saving
    if (!this.isUserLoggedIn) {
      this.authService.redirectUrl = this.router.url; // Save the current URL to redirect after login
      event.stopPropagation(); // Prevent the click from propagating to the card click handler
      this.router.navigate([`/auth/login`]); // Redirect to login page
      console.warn('User is not logged in. Cannot save college.');
      return;
    }

    if (collegeId) {
      const recentCollegeDto = {
        college_id: collegeId,
        user_id: 'user-guid', // Replace with actual user ID
        notes: '',
        tags: ['visited', 'interested'] // Example tags
      };

      this.collegeService.saveRecentCollege('user-guid', recentCollegeDto).subscribe({
        next: (data) => {
          this.recentCollege.push(data);
          console.log('Recent college saved:', data);
          this.error = null;

        },
        error: (err) => {
          this.error = err.message;
        },
      });
    }
  }

  stopPropagation(event: MouseEvent): void {
    event.stopPropagation();
  }

  combineAddress(collegeItem: CollegeModel): string {
    const {city, district, state } = collegeItem;
    return `${city}, ${district?.name}, ${state?.name}`;
  }

  combineAddressLv(collegeItem: CollegeModel): string {
    const {address, city, district, state, zip } = collegeItem;
    return `${address}, ${city}, ${district.name}, ${state.name} ${zip}`;
  }

  openShareDialog(event: MouseEvent): void {
    // Check if the user is logged in before saving
    if (!this.isUserLoggedIn) {
      this.authService.redirectUrl = this.router.url; // Save the current URL to redirect after login
      event.stopPropagation(); // Prevent the click from propagating to the card click handler
      this.router.navigate([`/auth/login`]); // Redirect to login page
      console.warn('User is not logged in. Cannot save college.');
      return;
    }
    
    const dialogRef = this.dialog.open(ShareDialogComponent, {
      width: '500px',
      height: '100vh', // Full viewport height
      position: { right: '0', top: '0', bottom: '0' },
      data: this.college,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.emailService.sendEmail(result.email, result.notes, this.college.id).subscribe({
          next: () => {
            alert('Email sent successfully!');
          },
          error: (err) => {
            alert('Failed to send email: ' + err.message);
          },
        });
      }
    });
  }
}
