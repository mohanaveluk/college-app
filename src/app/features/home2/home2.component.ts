import { Component, OnInit } from '@angular/core';
import { SharedCommonModule, SharedMaterialModule } from '../../shared/modules';
import { CollegeCardComponent } from '../shared/college-card/college-card.component';
import { CategorySection } from '../../core/models/college.model';
import { CollegeService } from '../../core/services/college.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home2',
  imports: [
    SharedCommonModule,
    SharedMaterialModule,
    CollegeCardComponent
  ],
  templateUrl: './home2.component.html',
  styleUrl: './home2.component.scss'
})
export class Home2Component implements OnInit {
  searchQuery = '';
  categorySections: CategorySection[] = [];
  
  constructor(
    private collegeService: CollegeService,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    this.initializeCategorySections();
  }

  initializeCategorySections(): void {
    const sections: CategorySection[] = [
      {
        title: 'Engineering Colleges',
        description: 'Top engineering institutions offering cutting-edge technical education',
        icon: 'engineering',
        colleges: []
      },
      {
        title: 'Medical Colleges',
        description: 'Leading medical schools for aspiring healthcare professionals',
        icon: 'local_hospital',
        colleges: []
      },
      {
        title: 'Arts & Humanities',
        description: 'Prestigious institutions for liberal arts and humanities education',
        icon: 'palette',
        colleges: []
      },
      {
        title: 'Science Colleges',
        description: 'Research-focused institutions for natural and applied sciences',
        icon: 'science',
        colleges: []
      },
      {
        title: 'Law Colleges',
        description: 'Premier law schools for legal education and justice studies',
        icon: 'gavel',
        colleges: []
      },
      {
        title: 'Business Schools',
        description: 'Top-rated institutions for management and business education',
        icon: 'business',
        colleges: []
      },
      {
        title: 'Pharmacy Colleges',
        description: 'Leading institutions for pharmaceutical studies and research',
        icon: 'medication',
        colleges: []
      }
    ];

    // Load colleges for each section
    sections.forEach(section => {
      this.collegeService.getColleges().subscribe(colleges => {
        section.colleges = colleges;
      });
    });

    this.categorySections = sections;
  }
  
  search(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/colleges'], { 
        queryParams: { search: this.searchQuery } 
      });
    }
  }

  scrollLeft(sectionId: string): void {
    const container = document.getElementById(`scroll-${sectionId}`);
    if (container) {
      container.scrollLeft -= 600;
    }
  }

  scrollRight(sectionId: string): void {
    const container = document.getElementById(`scroll-${sectionId}`);
    if (container) {
      container.scrollLeft += 600;
    }
  }
  
  navigateToDetails(id: number): void {
    this.router.navigate(['/colleges', id]);
  }
}
