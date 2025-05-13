import { Component, OnInit } from '@angular/core';
import { CollegeService } from '../../../core/services/college.service';
import { College } from '../../../core/models/college.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Sort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';
import { SharedCommonModule, SharedMaterialModule } from '../../../shared/modules';

@Component({
  selector: 'app-admin-dashboard',
  imports: [
    SharedCommonModule,
    SharedMaterialModule,
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent implements OnInit {
  colleges: College[] = [];
  filteredColleges: College[] = [];
  displayedColumns: string[] = ['id', 'name', 'city', 'state', 'category', 'rating', 'status', 'actions'];
  searchTerm = '';
  
  constructor(
    private collegeService: CollegeService,
    private snackBar: MatSnackBar
  ) {}
  
  ngOnInit(): void {
    this.loadColleges();
  }
  
  loadColleges(): void {
    this.collegeService.getColleges().subscribe((colleges: College[]) => {
      this.colleges = colleges;
      this.filteredColleges = [...colleges];
      this.applyFilter();
    });
  }
  
  applyFilter(): void {
    if (!this.searchTerm.trim()) {
      this.filteredColleges = [...this.colleges];
      return;
    }
    
    const filterValue = this.searchTerm.toLowerCase();
    this.filteredColleges = this.colleges.filter(college => 
      college.name.toLowerCase().includes(filterValue) ||
      college.city.toLowerCase().includes(filterValue) ||
      college.state.toLowerCase().includes(filterValue) ||
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
        case 'state': return this.compare(a.state, b.state, isAsc);
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
  
  toggleCollegeStatus(college: College): void {
    college.active = !college.active;
    
    this.collegeService.updateCollege(college.id, { active: college.active }).subscribe(() => {
      this.snackBar.open(
        `${college.name} ${college.active ? 'activated' : 'deactivated'} successfully`, 
        'Close', 
        { duration: 3000 }
      );
    });
  }
  
  deleteCollege(college: College): void {
    if (confirm(`Are you sure you want to delete ${college.name}?`)) {
      this.collegeService.deleteCollege(college.id).subscribe(() => {
        this.colleges = this.colleges.filter(c => c.id !== college.id);
        this.applyFilter();
        this.snackBar.open(`${college.name} deleted successfully`, 'Close', { duration: 3000 });
      });
    }
  }
}