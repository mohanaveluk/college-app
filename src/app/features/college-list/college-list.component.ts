import { Component, OnInit } from '@angular/core';
import { SharedCommonModule, SharedMaterialModule } from '../../shared/modules';
import { College, CollegeSearchParams } from '../../core/models/college.model';
import { CollegeService } from '../../core/services/college.service';
import { ActivatedRoute, Router } from '@angular/router';
//import { CollegeCardComponent } from "../shared/college-card/college-card.component";
import { SearchFormComponent } from "../shared/search-form/search-form.component";
//import { CollegeInfoCardComponent } from "../shared/college-info-card/college-info-card.component";
import { LoadingSpinnerComponent } from "../shared/components/loading-spinner/loading-spinner.component";
import { CollegeModel, CollegeSearchResponse } from '../../core/models/search-response.model';
import { CollegeInfoCardMapComponent } from "../shared/college-info-card-map/college-info-card-map.component";
@Component({
  selector: 'app-college-list',
  imports: [
    SharedCommonModule,
    SharedMaterialModule,
    SearchFormComponent,
    LoadingSpinnerComponent,
    CollegeInfoCardMapComponent
  ],
  templateUrl: './college-list.component.html',
  styleUrl: './college-list.component.scss'
})
export class CollegeListComponent implements OnInit {
  colleges: College[] = [];
  searchResults!: CollegeSearchResponse<CollegeModel>;

  loading = false;
  loadingMessage = "Loading colleges...";
  viewMode: 'grid' | 'list' = 'grid';
  searchParams: CollegeSearchParams = {};
  currentPage = 1;
  itemsPerPage = 10;
  
  constructor(
    private collegeService: CollegeService,
    private route: ActivatedRoute,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.searchParams = {
        keyword: params['search'] || params['keyword'] || params['s'],
        city: params['city'],
        state: params['state'],
        category: params['category'],
        course: params['course']
      };
      
      this.loadColleges();
    });
  }
  
  onSearch(params: CollegeSearchParams): void {
    this.searchParams = { ...params };
    this.updateQueryParams();
    this.loadColleges();
  }
  
  loadColleges(): void {
    this.loading = true;
    // this.collegeService.getColleges(this.searchParams).subscribe((colleges: College[]) => {
    //   this.colleges = colleges || [];
    //   this.loading = false;
    // });

    this.collegeService.searchColleges(this.searchParams).subscribe({
      next: (response) => {
        this.searchResults = response;
        this.loading = false;
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
      }
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
    alert('In a real application, this would load more colleges.');
  }
  
  navigateToDetails(id: number): void {
    this.router.navigate(['/colleges', id]);
  }

  navigateToDetail(id: string): void {
    this.router.navigate(['/colleges', id]);
  }
  
  removeFilter(key: keyof CollegeSearchParams): void {
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
}
