import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { SharedCommonModule, SharedMaterialModule } from '../../shared/modules';
import { CategorySectionv2, College } from '../../core/models/college.model';
import { ActivatedRoute, Router } from '@angular/router';
import { CollegeService } from '../../core/services/college.service';
import { Location } from '@angular/common';
import { CollegeModel, RecentlyViewed } from '../../core/models/search-response.model';
import { AuthService } from '../../auth/auth.service';
import { RecentCollege } from '../../core/models/recent-college.model';
import { CollegeInfoCardMapComponent } from "../shared/college-info-card-map/college-info-card-map.component";
import { LoadingSpinnerComponent } from "../shared/components/loading-spinner/loading-spinner.component";
import { MatDialog } from '@angular/material/dialog';
import { EmailService } from '../../shared/services/email.service';
import { ShareDialogComponent } from '../shared/share-dialog/share-dialog.component';

@Component({
  selector: 'app-college-details',
  imports: [
    SharedCommonModule,
    SharedMaterialModule,
    CollegeInfoCardMapComponent,
    LoadingSpinnerComponent
],
  templateUrl: './college-details.component.html',
  styleUrl: './college-details.component.scss'
})
export class CollegeDetailsComponent implements OnInit , AfterViewInit  {
  @ViewChildren('collegesScroll') collegesScrollElements!: QueryList<ElementRef>;

  college: CollegeModel | undefined;
  isUserLoggedIn = false;
  recentCollege: RecentCollege[] = [];
  recentColleges: CollegeModel[] = [];
  recentlyViewed: RecentlyViewed[] = [];
  categorySections!: CategorySectionv2;
  recentSection: CategorySectionv2 = {
    categorySection: {
      id: 'recent',
      title: 'Recently viewed',
      description: 'Recently viewed colleges',
      icon: 'history', //'history',
      expanded: true
    },
    colleges: [],
    showScrollButtons: false // Initialize scroll buttons visibility
  };

  error: string | null = null;
  
  loading = false;
  loadingMessage = "Loading";
  isMobile = window.innerWidth <= 768;
  isInitialized = false; // Initialization flag
  hasInRecent = false;



  constructor(
    private route: ActivatedRoute,
    private collegeService: CollegeService,
    private authService: AuthService,
    private emailService: EmailService,
    private router: Router,
    private location: Location,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog
  ) {

    // Listen for window resize events
    window.addEventListener('resize', () => {
      this.isMobile = window.innerWidth <= 768;
      if (!this.isMobile) {
        this.checkScrollButtonsVisibility();
      }
    });

    this.collegeService.recentColleges$.subscribe(colleges => {
      // Handle the updated list of recent colleges
      this.loadRecentColleges();
      console.log('Recently viewed colleges:', colleges);
    });
    this.authService.isUserLoggedIn().subscribe(isLoggedIn => {
      this.isUserLoggedIn = isLoggedIn;
      this.loadRecentColleges();
    });
  }
  
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const collegeId = params.get('id');
      if (collegeId) {
        this.loadCollege(collegeId);
      }
    });
  }

  ngAfterViewInit(): void {
    // Initial check for scroll buttons
    setTimeout(() => this.checkScrollButtonsVisibility(), 0);

    // Observe changes in the colleges scroll elements
    this.collegesScrollElements.changes.subscribe(() => {
      this.checkScrollButtonsVisibility();
    });
  }
  
  loadCollege(id: string): void {
    this.collegeService.getCollegeById(id).subscribe(college => {
      if (college) {
        this.college = college;
        this.college.image_url = college.image_url || 'images/college/greyed.jpg';
      } else {
        this.router.navigate(['/colleges']);
      }
    });
  }

  saveCollege(event: MouseEvent): void {
    const collegeId = this.college?.id;
    // Check if the user is logged in before saving
    if (!this.isUserLoggedIn) {
      this.authService.redirectUrl = this.router.url; // Save the current URL to redirect after login
      event.stopPropagation(); // Prevent the click from propagating to the card click handler
      this.router.navigate([`/auth/login`]); // Redirect to login page
      console.warn('User is not logged in. Cannot save college.');
      return;
    }

    if (collegeId) {
      
      const cIndex = this.recentColleges.findIndex(m => m.id === collegeId);
      if(cIndex >= 0){
        return;
      }

      const recentCollegeDto = {
        college_id: collegeId,
        user_id: 'user-guid', // Replace with actual user ID
        notes: '',
        tags: ['visited', 'interested'] // Example tags
      };



      this.collegeService.saveRecentCollege('user-guid', recentCollegeDto).subscribe({
        next: (data) => {
          //this.recentColleges.push(data);
          //this.recentSection.colleges = this.recentColleges;
          //this.categorySections = this.recentSection;
          console.log('Recent college saved:', data);
          this.error = null;

        },
        error: (err) => {
          this.error = err.message;
        },
      });
    }
  }

  loadRecentColleges(): void {
    this.recentlyViewed = [];
    this.hasInRecent = false;
    this.recentSection.colleges = [];

    if (!this.isUserLoggedIn) {
      return;
    }

    this.loading = true;
    this.collegeService.getRecentColleges('user-guid', 10, 1).subscribe({
      next: (data) => {
        this.recentlyViewed  = data.data || [];
        localStorage.setItem('rv', JSON.stringify(this.recentlyViewed));
        if (this.recentlyViewed.length > 0) {
          //this.recentColleges = data.data || [];
          this.recentSection.colleges = this.recentColleges = this.recentlyViewed.map((college: any) => {
            return {
              ...college.college,
              imageUrl: college.image_url || 'assets/images/college-placeholder.png' // Default image URL
            };
          });

          if(this.categorySections) {
            const recentIndex = this.categorySections.categorySection.id === 'recent';
            if (recentIndex) {
              this.categorySections.colleges = this.recentColleges;
              this.categorySections.showScrollButtons = this.recentSection.showScrollButtons;
            }
          }
          else{
            this.categorySections = this.recentSection;
          }
          
          const cIndex = this.recentColleges.findIndex(m => m.id === this.college?.id);
          if(cIndex >= 0){
            this.hasInRecent = true;
          }

          this.checkScrollButtonsVisibility(); // Check scroll buttons visibility after loading colleges
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message;
        this.loading = false;
      },
    });
  }

  checkScrollButtonsVisibility(): void {
    if (!this.collegesScrollElements) return;

    this.collegesScrollElements.forEach((element: ElementRef, index: number) => {
      const container = element.nativeElement;
      const hasOverflow = container.scrollWidth > container.clientWidth;
      
      if (this.categorySections && this.categorySections.showScrollButtons !== hasOverflow) {
        this.categorySections.showScrollButtons = hasOverflow;
        this.cdr.detectChanges();
      }
    });
  }

  getSectionId(section: CategorySectionv2): string {
    return `scroll-${section.categorySection.id}`;
  }

  getSectionTitle(section: CategorySectionv2): string {
    return section.categorySection.id;
  }

  scrollLeft(section: CategorySectionv2): void {
    const container = document.getElementById(`scroll-${section.categorySection.id}`);
    if (container) {
      container.scrollLeft -= this.isMobile ? 300 : 600;
    }
  }

  scrollRight(section: CategorySectionv2): void {
    const container = document.getElementById(`scroll-${section.categorySection.id}`);
    if (container) {
      container.scrollLeft +=  this.isMobile ? 300 : 600;
    }
  }

  hasScrollLeft(section: CategorySectionv2): boolean {
    return section?.showScrollButtons || false;// && this.isMobile && this.isInitialized;
  }
  
  
  hasScrollRight(section: CategorySectionv2): boolean {
    return section?.showScrollButtons || false;// && this.isMobile && this.isInitialized;
  }

  navigateToDetails(id: number): void {
    this.router.navigate(['/colleges', id]);
  }

  navigateToDetailsPage(id: string): void {
    this.router.navigate(['/colleges', id]);
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
        this.emailService.sendEmail(result.email, result.notes, this.college?.id!).subscribe({
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

  goBack(): void {
    this.location.back();
  }
}