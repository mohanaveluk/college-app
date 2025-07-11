import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { College } from '../../../core/models/college.model';
import { MatMenuTrigger } from '@angular/material/menu';
import { Router } from '@angular/router';
import { SharedCommonModule, SharedMaterialModule } from '../../../shared/modules';
import { CollegeModel, RecentlyViewed } from '../../../core/models/search-response.model';
import { TruncatePipe } from "../../../shared/utility/truncate.pipe";
import { CapitalizePipe } from "../../../shared/utility/capitalize.pipe";
import { ImageFallbackPipe } from "../../../shared/utility/image-fallback.pipe";
import { CollegeService } from '../../../core/services/college.service';
import { RecentCollege } from '../../../core/models/recent-college.model';
import { MatDialog } from '@angular/material/dialog';
import { ShareDialogComponent } from '../share-dialog/share-dialog.component';
import { EmailService } from '../../../shared/services/email.service';
import { AuthService } from '../../../auth/auth.service';
import { animate, style, transition, trigger } from '@angular/animations';
//import { CollegeDetailsPopupComponent } from "../../../shared/components/college-details-popup/college-details-popup.component";

@Component({
  selector: 'app-college-info-card-map',
  imports: [
    SharedCommonModule,
    SharedMaterialModule,
    TruncatePipe,
    CapitalizePipe,
    ImageFallbackPipe,
    //CollegeDetailsPopupComponent
],
  templateUrl: './college-info-card-map.component.html',
  styleUrl: './college-info-card-map.component.scss',
  animations: [
    trigger('itemEnter', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
  
})
export class CollegeInfoCardMapComponent {
  @Input() college!: CollegeModel;
  @Input() viewMode: 'grid' | 'list' = 'grid';
  @Input() isNew = false; // Add this input
  @ViewChild(MatMenuTrigger) menuTrigger!: MatMenuTrigger;
  @Output() collegeClick = new EventEmitter<string>();

  isUserLoggedIn = false;
  error: string | null = null;
  recentCollege: RecentCollege[] = [];

  showPopup = false;
  selectedCollegeId = '';

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
      //this.router.navigate(['/colleges', this.college.id]);
      //this.openCollegeDetailsPopup(this.college.id);
      this.stopPropagation(event);
      this.collegeClick.emit(this.college.id);
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

      const rv = localStorage.getItem('rv');
      const rvObj: RecentlyViewed[] = JSON.parse(rv!);
      const rIndex = rvObj && rvObj.findIndex(x => x.college_id === collegeId);
      if(rIndex >= 0){
        return;
      }

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

  trackByCollegeId(index: number, college: CollegeModel): string {
    return college.id; // or any unique identifier
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

  openCollegeDetailsPopup(id: string): void {
    this.selectedCollegeId = id;
    this.showPopup = true;
  }

  closePopup(): void {
    this.showPopup = false;
    this.selectedCollegeId = ''; // Reset to default value
  }
}
