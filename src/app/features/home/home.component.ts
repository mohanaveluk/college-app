import { Component } from '@angular/core';
import { SharedCommonModule, SharedMaterialModule } from '../../shared/modules';
import { CollegeService } from '../../core/services/college.service';
import { Router } from '@angular/router';
import { College } from '../../core/models/college.model';
import { CollegeCardComponent } from "../shared/college-card/college-card.component";

@Component({
  selector: 'app-home',
  imports: [
    SharedCommonModule,
    SharedMaterialModule,
    CollegeCardComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  searchQuery = '';
  featuredColleges: College[] = [];
  
  categories = [
    { 
      label: 'Deemed Universities', 
      value: 'deemed', 
      icon: 'school', 
      description: 'Universities with high educational standards and academic excellence'
    },
    { 
      label: 'Affiliated Colleges', 
      value: 'affiliated', 
      icon: 'account_balance', 
      description: 'Colleges affiliated with established universities'
    },
    { 
      label: 'Autonomous Colleges', 
      value: 'autonomous', 
      icon: 'architecture', 
      description: 'Colleges with the freedom to design their curricula'
    },
    { 
      label: 'Other Institutions', 
      value: 'other', 
      icon: 'business', 
      description: 'Specialized institutions and other educational facilities'
    }
  ];
  
  constructor(
    private collegeService: CollegeService,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    this.loadFeaturedColleges();
  }
  
  loadFeaturedColleges(): void {
    this.collegeService.getColleges().subscribe(colleges => {
      this.featuredColleges = colleges.slice(0, 3);
    });
  }
  
  search(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/colleges'], { 
        queryParams: { search: this.searchQuery } 
      });
    }
  }
  
  searchByCategory(category: string): void {
    this.router.navigate(['/colleges'], { 
      queryParams: { category } 
    });
  }
  
  navigateToDetails(id: number): void {
    this.router.navigate(['/colleges', id]);
  }
}
