import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { SharedCommonModule, SharedMaterialModule } from '../../shared/modules';
import { CollegeCardComponent } from '../shared/college-card/college-card.component';
//import { CategorySection } from '../../core/models/college.model';
import { CollegeService } from '../../core/services/college.service';
import { ActivatedRoute, Router } from '@angular/router';
//import { CollegeInfoCardComponent } from "../shared/college-info-card/college-info-card.component";
import { CategorySection, CategorySectionv2, SearchEntityParams } from '../../core/models/college.model';
import { CollegeInfoCardMapComponent } from "../shared/college-info-card-map/college-info-card-map.component";
import { SearchEntityComponent } from "../shared/search-entity/search-entity.component";
import { CollegeModel, RecentlyViewed } from '../../core/models/search-response.model';
import { Category, CategoryService } from '../../core/services/categoryService';
import { AuthService } from '../../auth/auth.service';
import { LoadingSpinnerComponent } from "../shared/components/loading-spinner/loading-spinner.component";
import { CollegeDetailsPopupComponent } from "../../shared/components/college-details-popup/college-details-popup.component";

@Component({
  selector: 'app-home3',
  imports: [
    SharedCommonModule,
    SharedMaterialModule,
    //CollegeInfoCardComponent,
    CollegeInfoCardMapComponent,
    SearchEntityComponent,
    LoadingSpinnerComponent,
    CollegeDetailsPopupComponent
],
  templateUrl: './home3.component.html',
  styleUrl: './home3.component.scss'
})
export class Home3Component implements OnInit , AfterViewInit {
  @ViewChildren('collegesScroll') collegesScrollElements!: QueryList<ElementRef>;
  
  isUserLoggedIn = false;
  searchQuery = '';
  //categories: string[] = ['Engineering', 'Medical', 'Pharmacy', 'Arts'];
  categories: Category[] = [];
  
  categorySections1: CategorySection[] = [];
  categorySections: CategorySectionv2[] = [];
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

  isMobile = window.innerWidth <= 768;
  isInitialized = false; // Initialization flag

  loading = false;
  loadingMessage = "Processing";
  error: string | null = null;
  selectedCategory: string | null = null;
  recentColleges: CollegeModel[] = [];
  recentlyViewed: RecentlyViewed[] = [];

  searchParams: SearchEntityParams = {};
  searchType = 'keyword';

  showPopup = false;
  selectedCollegeId = '';

  JSON: any;
  

  constructor(
    private collegeService: CollegeService,
    private categoryService: CategoryService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {
    // Listen for window resize events
    window.addEventListener('resize', () => {
      this.isMobile = window.innerWidth <= 768;
      if (!this.isMobile) {
        this.checkScrollButtonsVisibility();
      }
    });

  }
  
  ngOnInit(): void {
    //this.initializeCategorySections();
    this.loadCollegesByCategory(['d3ca6d6f-1ac0-4fac-add6-22f4058f067e','533840c1-898b-4000-9915-9a602cf89a33', '6da73e49-169c-4414-824c-f09784a090ee']);
    this.isInitialized = true;
    this.loadCategories();

    this.authService.isUserLoggedIn().subscribe(isLoggedIn => {
      this.isUserLoggedIn = isLoggedIn;
    });
    
    this.collegeService.recentColleges$.subscribe(colleges => {
      // Handle the updated list of recent colleges
      this.loadRecentColleges();
      console.log('Recently viewed colleges:', colleges);
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

  checkScrollButtonsVisibility(): void {
    if (!this.collegesScrollElements) return;

    this.collegesScrollElements.forEach((element: ElementRef, index: number) => {
      const container = element.nativeElement;
      const hasOverflow = container.scrollWidth > container.clientWidth;
      
      if (this.categorySections && this.categorySections.length > 0 && this.categorySections[index].showScrollButtons !== hasOverflow) {
        this.categorySections[index].showScrollButtons = hasOverflow;
        this.cdr.detectChanges();
      }
    });
  }
  
  initializeCategorySections(): void {
    const sections: CategorySection[] = [
      {
        id: '1',
        title: 'Engineering Colleges',
        description: 'Top engineering institutions offering cutting-edge technical education',
        icon: 'engineering',
        colleges: [],
        expanded: true
      },
      {
        id: '2',
        title: 'Medical Colleges',
        description: 'Leading medical schools for aspiring healthcare professionals',
        icon: 'local_hospital',
        colleges: [],
        expanded: false
      },
      {
        id: '3',
        title: 'Arts & Humanities',
        description: 'Prestigious institutions for liberal arts and humanities education',
        icon: 'palette',
        colleges: [],
        expanded: false
      },
      {
        id: '4',
        title: 'Science Colleges',
        description: 'Research-focused institutions for natural and applied sciences',
        icon: 'science',
        colleges: [],
        expanded: false
      },
      {
        id: '5',
        title: 'Law Colleges',
        description: 'Premier law schools for legal education and justice studies',
        icon: 'gavel',
        colleges: [],
        expanded: false
      },
      {
        id: '6',
        title: 'Business Schools',
        description: 'Top-rated institutions for management and business education',
        icon: 'business',
        colleges: [],
        expanded: false
      },
      {
        id: '7',
        title: 'Pharmacy Colleges',
        description: 'Leading institutions for pharmaceutical studies and research',
        icon: 'medication',
        colleges: [],
        expanded: false
      }
    ];

    sections.forEach(section => {
      this.collegeService.getCollegesMock().subscribe(colleges => {
        section.colleges = colleges;
      });
    });

    this.categorySections1 = sections;
  }
  
  loadCollegesByCategory(categorySectionIds: string[]): void {
    this.loading = true;
    this.error = null;
    
    this.collegeService.getCollegesByCategorySections(categorySectionIds).subscribe({
      next: (response) => {
        let categorySections = response.results;
        
        categorySections.forEach((section: CategorySectionv2) => {
          section.showScrollButtons = false; // Initialize scroll buttons visibility
          // const container = document.getElementById(`scroll-${section.categorySection.id}`);
          // if (container) {
          //   const hasOverflow = container.scrollWidth > container.clientWidth;
          //   section.showScrollButtons = hasOverflow;
          // }
        });

        categorySections.forEach((section: CategorySectionv2) => {
          section.colleges = section.colleges.map((college: CollegeModel) => {
            return {
              ...college,
              imageUrl: college.image_url || 'assets/images/college-placeholder.png' // Default image URL
            };
          });
        });

        this.categorySections = categorySections.filter(s => s.colleges.length > 0) || [];

        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load colleges. Please try again later.';
        this.loading = false;
        console.error('Error loading colleges:', err);
      }
    });
  }

  loadRecentColleges(): void {
    this.recentlyViewed = [];
    //this.recentSection.colleges = [];

    if (!this.isUserLoggedIn) {
      return;
    }

    this.loading = true;
    this.collegeService.getRecentColleges('user-guid', 10, 1).subscribe({
      next: (data) => {
        this.recentlyViewed  = data.data || [];
        localStorage.setItem('rv', JSON.stringify(this.recentlyViewed));
        if (this.recentlyViewed.length > 0) {
          this.recentColleges = data.data || [];
          this.recentSection.colleges = this.recentlyViewed.map((college: any) => {
            return {
              ...college.college,
              imageUrl: college.image_url || 'images/college/greyed.jpg' // Default image URL
            };
          });

          if(this.categorySections.length > 0) {
            const recentIndex = this.categorySections.findIndex(section => section.categorySection.id === 'recent');
            if (recentIndex !== -1) {
              this.categorySections[recentIndex].colleges = this.recentSection.colleges;
              this.categorySections[recentIndex].showScrollButtons = this.recentSection.showScrollButtons;
              this.categorySections[recentIndex].colleges;
              this.cdr.detectChanges();
              setTimeout(() => this.checkScrollButtonsVisibility(), 0); // Check scroll buttons visibility after loading colleges
            }
            else{
              this.categorySections.push(this.recentSection);
              this.cdr.detectChanges();
              setTimeout(() => this.checkScrollButtonsVisibility(), 0); // Check scroll buttons visibility after loading colleges
            }
          }
          
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message;
        this.loading = false;
      },
    });
  }

  search(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/colleges'], { 
        queryParams: { search: this.searchQuery } 
      });
    }
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

  toggleExpansion(section: CategorySectionv2): void {
    console.log('Toggling section:', section);
    if (this.isInitialized) {
      this.isInitialized = false;
      return;
    }
    section.categorySection.expanded = !section.categorySection.expanded;
  }

  onSearch(params: SearchEntityParams): void {
    console.log('Search params:', params);
    this.searchParams = { ...params };
    if(this.searchParams?.k) {
      //if(this.searchParams?.cs === 'All' || !this.searchParams?.cs){
        //this.searchParams.cs = '';
      //}
      console.log('Search params if keyword exist:', this.searchParams);

      this.updateQueryParams();
    }
  }

  loadColleges(){}
  loadCategories(){
    this.categoryService.getCategories().subscribe({
      next: (response) => {
        this.categories = response;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  searchByCategory(category: string): void {
    this.router.navigate(['/colleges'], { 
      queryParams: { category } 
    });
  }

  updateQueryParams(){
    this.router.navigate(['/colleges'], {
      queryParams: this.searchParams,
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
