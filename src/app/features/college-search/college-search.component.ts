import { ChangeDetectorRef, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { SharedCommonModule, SharedMaterialModule } from '../../shared/modules';
import { CategorySectionv2, College, CollegeSearchParams, SearchEntityParams } from '../../core/models/college.model';
import { CollegeService } from '../../core/services/college.service';
import { ActivatedRoute, Router } from '@angular/router';
//import { CollegeCardComponent } from "../shared/college-card/college-card.component";
import { SearchFormComponent } from "../shared/search-form/search-form.component";
//import { CollegeInfoCardComponent } from "../shared/college-info-card/college-info-card.component";
import { LoadingSpinnerComponent } from "../shared/components/loading-spinner/loading-spinner.component";
import { CollegeModel, CollegeSearchResponse, PaginationInfo, RecentlyViewed } from '../../core/models/search-response.model';
import { CollegeInfoCardMapComponent } from "../shared/college-info-card-map/college-info-card-map.component";
import { SearchEntityComponent } from "../shared/search-entity/search-entity.component";
import { BehaviorSubject, throwError } from 'rxjs';
import { RecentCollege } from '../../core/models/recent-college.model';
import { AuthService } from '../../auth/auth.service';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { animate, style, transition, trigger } from '@angular/animations';


@Component({
  selector: 'app-college-search',
  imports: [
    SharedCommonModule,
    SharedMaterialModule,
    //SearchFormComponent,
    //CollegeInfoCardComponent,
    LoadingSpinnerComponent,
    CollegeInfoCardMapComponent,
    SearchEntityComponent,
    SearchFormComponent
],
  templateUrl: './college-search.component.html',
  styleUrl: './college-search.component.scss',
  host: {
    '[@itemEnter]': '',
    '[@.disabled]': '!isNew'
  },
  animations: [
    trigger('itemEnter', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class CollegeSearchComponent implements OnInit {
  @ViewChildren('collegesScroll') collegesScrollElements!: QueryList<ElementRef>;
  @ViewChild(CdkVirtualScrollViewport) viewport!: CdkVirtualScrollViewport;
  viewportHeight = 'calc(100vh - 200px)'; // Adjust as needed

  colleges1: College[] = [];
  recentColleges: CollegeModel[] = [];
  colleges: CollegeModel[] = [];
  private newItems: CollegeModel[] = [];
  colleges$ = new BehaviorSubject<CollegeModel[]>([]);
  searchResults!: CollegeSearchResponse<CollegeModel>;
  pagination: PaginationInfo = {};
  resultCount = 0;
  private scrollPosition = 0;
  // Track newly added items
  private newItemIds = new Set<string>();

  isUserLoggedIn = false;
  recentCollege: RecentCollege[] = [];
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

  loading = false;
  loadingMessage = "Loading colleges...";
  viewMode: 'grid' | 'list' = 'grid';
  searchParams: SearchEntityParams = {};// CollegeSearchParams = {};
  currentPage = 1;
  itemsPerPage = 20;
  isMobile = window.innerWidth <= 768;
  error: string | null = null;
  hasInRecent = false;

  constructor(
    private collegeService: CollegeService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {
    window.addEventListener('resize', () => {
      this.isMobile = window.innerWidth <= 768;
      if (!this.isMobile) {
        this.checkScrollButtonsVisibility();
      }
    });
    this.collegeService.recentColleges$.subscribe(colleges => {
      // Handle the updated list of recent colleges
      //this.loadRecentColleges();
      console.log('Recently viewed colleges:', colleges);
    });
    this.authService.isUserLoggedIn().subscribe(isLoggedIn => {
      this.isUserLoggedIn = isLoggedIn;
      //this.loadRecentColleges();
    });
  }
  
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.searchParams = {
        k: params['search'] || params['keyword'] || params['k'],
        cs: params['cs'],
      };
      this.loadColleges();
    });
  }
  
  onSearch(params: CollegeSearchParams): void {
    this.currentPage = 1;
    this.resultCount = 0;
    this.scrollPosition = 0;
    this.searchParams = { ...params };
    this.updateQueryParams();
    this.loadColleges();
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

  loadColleges(): void {
    this.loading = true;
    // this.collegeService.getColleges(this.searchParams).subscribe((colleges: College[]) => {
    //   this.colleges = colleges || [];
    //   this.loading = false;
    // });
    this.searchParams.page = this.currentPage;
    this.searchParams.limit = this.itemsPerPage;
    this.collegeService.searchCollegex(this.searchParams).subscribe({
      next: (response) => {
        this.searchResults = response;
        this.newItems = response.data || []; // Store only new items
        // Store new item IDs for animation tracking
        response.data?.forEach(college => this.newItemIds.add(college.id));
        
        
        // For first page load, replace the data
        if (this.currentPage === 1) {
          this.colleges = response.data || [];
        }
        // For subsequent loads, append the data
        else {
          this.colleges = [...this.colleges, ...(response.data || [])];
        }
        
        this.colleges$.next(this.colleges);
        this.resultCount += this.searchResults?.data ? this.searchResults.data.length : 0;
        this.pagination = this.searchResults?.pagination || { total: 0, page: 0, limit: 10, totalPages: 0 };
        this.loading = false;
        // Force change detection
        this.cdr.detectChanges();

        // Restore scroll position after render
        // Restore scroll position after Angular updates the view
        requestAnimationFrame(() => {
          window.scrollTo({
            top: this.scrollPosition,
            behavior: 'auto'
          });
        });

        setTimeout(() => this.newItemIds.clear(), 1000);

      },
      error: (error) => {
        console.error('Search failed:', error);
        this.loading = false;
        // Optionally reset searchResults on error
        this.searchResults = {
          data: [],
          pagination: {
            total: 0,
            page: 1,
            limit: 10,
            totalPages: 0
          }
        };
        // Rethrow the error to be handled by any higher-level error handling
        throwError(() => new Error(error.message));
      }
    });
  }

  // Add this method to check if item is new
  isNewItem(college: CollegeModel): boolean {
    return this.newItemIds.has(college.id);
  }  

  loadRecentColleges1(): void {
    this.loading = true;
    this.collegeService.getRecentColleges('user-guid', 10, 1).subscribe({
      next: (data) => {
        this.recentColleges = data.data || [];
        this.recentColleges.forEach((college: CollegeModel) => {
          college.image_url = college.image_url || 'images/college/greyed.jpg'; // Default image URL
        });
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message;
        this.loading = false;
      },
    });
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
              this.cdr.detectChanges();
              setTimeout(() => this.checkScrollButtonsVisibility(), 0);
            }
          }
          else{
            this.categorySections = this.recentSection;
            this.cdr.detectChanges();
            setTimeout(() => this.checkScrollButtonsVisibility(), 0);
          }
          
          /*const cIndex = this.recentColleges.findIndex(m => m.id === this.college?.id);
          if(cIndex >= 0){
            this.hasInRecent = true;
          }*/

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
  
  getPageNumbers(totalPages: number): number[] {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    //this.searchColleges(/* your existing search params */);
  }
  
  loadMore(): void {
    // In a real app, you would implement pagination
    // For now, we'll just show a message
    // Save current scroll position
    this.scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
    this.currentPage++;
    this.searchParams.page = this.currentPage;
    this.loadColleges();
  }
  
  trackByCollegeId(index: number, college: CollegeModel): string {
    return college.id; // or any unique identifier
  }

  navigateToDetails(id: number): void {
    this.router.navigate(['/colleges', id]);
  }

  navigateToDetail(id: string): void {
    this.router.navigate(['/colleges', id]);
  }
  
  removeFilter(key: keyof SearchEntityParams): void {
    if (this.searchParams[key]) {
      delete this.searchParams[key];
      this.updateQueryParams();
      this.loadColleges();
    }
  }
  
  clearAllFilters(): void {
    this.searchParams = {};
    this.updateQueryParams();
    this.loadColleges();
  }
  
  hasFilters(): boolean {
    return Object.keys(this.searchParams).length > 0;
  }
  
  private updateQueryParams(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: this.searchParams,
      queryParamsHandling: 'merge'
    });
  }

  hasLoadMore(): boolean {
    return this.searchResults && this.searchResults.pagination && this.pagination.totalPages! > this.pagination.page!;
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

  navigateToDetailsPage(id: string): void {
    this.router.navigate(['/colleges', id]);
  }
}
