import { Component, OnInit } from '@angular/core';
import { SharedCommonModule, SharedMaterialModule } from '../../shared/modules';
import { College, CollegeSearchParams } from '../../core/models/college.model';
import { CollegeService } from '../../core/services/college.service';
import { ActivatedRoute, Router } from '@angular/router';
//import { CollegeCardComponent } from "../shared/college-card/college-card.component";
import { SearchFormComponent } from "../shared/search-form/search-form.component";
import { CollegeInfoCardComponent } from "../shared/college-info-card/college-info-card.component";

@Component({
  selector: 'app-college-list',
  imports: [
    SharedCommonModule,
    SharedMaterialModule,
    SearchFormComponent,
    CollegeInfoCardComponent
],
  templateUrl: './college-list.component.html',
  styleUrl: './college-list.component.scss'
})
export class CollegeListComponent implements OnInit {
  colleges: College[] = [];
  loading = false;
  viewMode: 'grid' | 'list' = 'grid';
  searchParams: CollegeSearchParams = {};
  
  constructor(
    private collegeService: CollegeService,
    private route: ActivatedRoute,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.searchParams = {
        name: params['search'] || params['name'],
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
    this.collegeService.getColleges(this.searchParams).subscribe((colleges: College[]) => {
      this.colleges = colleges;
      this.loading = false;
    });
  }
  
  loadMore(): void {
    // In a real app, you would implement pagination
    // For now, we'll just show a message
    alert('In a real application, this would load more colleges.');
  }
  
  navigateToDetails(id: number): void {
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
