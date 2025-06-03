import { Component, OnDestroy, OnInit } from '@angular/core';
import { CollegeService } from '../../../core/services/college.service';
import { College } from '../../../core/models/college.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Sort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';
import { SharedCommonModule, SharedMaterialModule } from '../../../shared/modules';
import { AuthService } from '../../../auth/auth.service';
import { Subject, takeUntil } from 'rxjs';
import { CollegeModel, CollegeSearchResponse } from '../../../core/models/search-response.model';

@Component({
  selector: 'app-admin-dashboard',
  imports: [
    SharedCommonModule,
    SharedMaterialModule,
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  collegeReponse!: CollegeSearchResponse<CollegeModel>;
  colleges!: CollegeModel[];
  filteredColleges: CollegeModel[] = [];
  displayedColumnsv1: string[] = ['id', 'name', 'city', 'state', 'category', 'rating', 'status', 'actions'];
  displayedColumns: string[] = ['name', 'city', 'state', 'category', 'rating', 'status', 'actions'];
  searchTerm = '';
  isUserLoggedIn = false;
  private destroy$ = new Subject<void>();
  
  constructor(
    private collegeService: CollegeService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}
  
  ngOnInit(): void {
    this.authService.isUserLoggedIn().subscribe(isLoggedIn => {
      this.isUserLoggedIn = isLoggedIn;
      if (isLoggedIn) {
        this.loadColleges();
      } else {
        this.snackBar.open('You must be logged in to access the admin dashboard', 'Close', { duration: 3000 });
      }
    });
  }
  
  loadColleges(): void {
    if (!this.isUserLoggedIn) {
      return;
    }

    // Fetch colleges from the service
    this.filteredColleges = [];
    this.collegeService.getColleges()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.collegeReponse = response;
          this.colleges = this.collegeReponse.data;
          this.filteredColleges = [...this.collegeReponse.data];
          this.applyFilter();
        },
        error: (err) => {
          console.error('Failed to load colleges:', err);
          // Optionally: Display a user-friendly error message
          this.filteredColleges = []; // Prevent invalid data source
        }
      });

  }
  
  applyFilter(): void {
    if (!this.searchTerm.trim()) {
      this.filteredColleges = [...this.collegeReponse.data];
      return;
    }
    
    const filterValue = this.searchTerm.toLowerCase();
    this.filteredColleges = this.collegeReponse.data.filter(college => 
      college.name.toLowerCase().includes(filterValue) ||
      college.city.toLowerCase().includes(filterValue) ||
      college.state.name.toLowerCase().includes(filterValue) ||
      college.category.toLowerCase().includes(filterValue)
    );
  }
  
  sortData(sort: Sort): void {
    const data = [...this.filteredColleges];
    
    if (!sort.active || sort.direction === '') {
      this.filteredColleges = data;
      return;
    }
    
    this.filteredColleges = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'id': return this.compare(a.id, b.id, isAsc);
        case 'name': return this.compare(a.name, b.name, isAsc);
        case 'city': return this.compare(a.city, b.city, isAsc);
        case 'state': return this.compare(a.state.name, b.state.name, isAsc);
        case 'category': return this.compare(a.category, b.category, isAsc);
        case 'rating': return this.compare(a.rating, b.rating, isAsc);
        default: return 0;
      }
    });
  }
  
  compare(a: number | string, b: number | string, isAsc: boolean): number {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
  
  handlePageEvent(event: PageEvent): void {
    // In a real application, this would handle pagination
    console.log(event);
  }
  
  toggleCollegeStatus(college: CollegeModel): void {
    college.active = !college.active;
    
    this.collegeService.updateCollege(college.id, { active: college.active }).subscribe(() => {
      this.snackBar.open(
        `${college.name} ${college.active ? 'activated' : 'deactivated'} successfully`, 
        'Close', 
        { duration: 3000 }
      );
    });
  }
  
  deleteCollege(college: CollegeModel): void {
    if (confirm(`Are you sure you want to delete ${college.name}?`)) {
      this.collegeService.deleteCollege(college.id).subscribe(() => {
        this.colleges = this.colleges.filter(c => c.id !== college.id);
        this.applyFilter();
        this.snackBar.open(`${college.name} deleted successfully`, 'Close', { duration: 3000 });
      });
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}