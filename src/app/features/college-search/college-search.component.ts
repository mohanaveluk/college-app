import { Component, OnInit } from '@angular/core';
import { SharedCommonModule, SharedMaterialModule } from '../../shared/modules';
import { College, CollegeSearchParams, SearchEntityParams } from '../../core/models/college.model';
import { CollegeService } from '../../core/services/college.service';
import { ActivatedRoute, Router } from '@angular/router';
//import { CollegeCardComponent } from "../shared/college-card/college-card.component";
import { SearchFormComponent } from "../shared/search-form/search-form.component";
//import { CollegeInfoCardComponent } from "../shared/college-info-card/college-info-card.component";
import { LoadingSpinnerComponent } from "../shared/components/loading-spinner/loading-spinner.component";
import { CollegeModel, CollegeSearchResponse, PaginationInfo } from '../../core/models/search-response.model';
import { CollegeInfoCardMapComponent } from "../shared/college-info-card-map/college-info-card-map.component";
import { SearchEntityComponent } from "../shared/search-entity/search-entity.component";
import { throwError } from 'rxjs';
@Component({
  selector: 'app-college-search',
  imports: [
    SharedCommonModule,
    SharedMaterialModule,
    //SearchFormComponent,
    //CollegeInfoCardComponent,
    LoadingSpinnerComponent,
    CollegeInfoCardMapComponent,
    SearchEntityComponent
],
  templateUrl: './college-search.component.html',
  styleUrl: './college-search.component.scss'
})
export class CollegeSearchComponent implements OnInit {
  colleges: College[] = [];
  recentColleges: CollegeModel[] = [];
  searchResults!: CollegeSearchResponse<CollegeModel>;
  pagination: PaginationInfo = {};
  resultCount = 0;

  loading = false;
  loadingMessage = "Loading colleges...";
  viewMode: 'grid' | 'list' = 'grid';
  searchParams: SearchEntityParams = {};// CollegeSearchParams = {};
  currentPage = 1;
  itemsPerPage = 50;
  error: string | null = null;
  
  constructor(
    private collegeService: CollegeService,
    private route: ActivatedRoute,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.searchParams = {
        k: params['search'] || params['keyword'] || params['k'],
        cs: params['cs'],
      };
      
      this.loadColleges();
      this.loadRecentColleges();
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
    this.searchParams.page = this.currentPage;
    this.searchParams.limit = this.itemsPerPage;
    this.collegeService.searchCollegex(this.searchParams).subscribe({
      next: (response) => {
        this.searchResults = response;
        this.resultCount = this.searchResults?.data ? this.searchResults.data.length : 0;
        this.pagination = this.searchResults?.pagination || { total: 0, page: 0, limit: 10, totalPages: 0 };
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
        // Rethrow the error to be handled by any higher-level error handling
        throwError(() => new Error(error.message));
      }
    });
  }

  loadRecentColleges(): void {
    this.loading = true;
    this.collegeService.getRecentColleges('user-guid', 10, 1).subscribe({
      next: (data) => {
        this.recentColleges = data.data || [];
        this.recentColleges.forEach((college: CollegeModel) => {
          college.image_url = college.image_url || 'assets/images/college-placeholder.png'; // Default image URL
        });
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
    this.currentPage++;
    this.searchParams.page = this.currentPage;
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
}
