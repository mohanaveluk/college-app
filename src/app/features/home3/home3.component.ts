import { Component, OnInit } from '@angular/core';
import { SharedCommonModule, SharedMaterialModule } from '../../shared/modules';
import { CollegeCardComponent } from '../shared/college-card/college-card.component';
//import { CategorySection } from '../../core/models/college.model';
import { CollegeService } from '../../core/services/college.service';
import { Router } from '@angular/router';
import { CollegeInfoCardComponent } from "../shared/college-info-card/college-info-card.component";
import { CategorySection } from '../../core/models/college.model';

@Component({
  selector: 'app-home3',
  imports: [
    SharedCommonModule,
    SharedMaterialModule,
    CollegeInfoCardComponent,
],
  templateUrl: './home3.component.html',
  styleUrl: './home3.component.scss'
})
export class Home3Component implements OnInit  {
  searchQuery = '';
  categorySections: CategorySection[] = [];
  isMobile = window.innerWidth <= 768;
  isInitialized = false; // Initialization flag

  constructor(
    private collegeService: CollegeService,
    private router: Router
  ) {
    // Listen for window resize events
    window.addEventListener('resize', () => {
      this.isMobile = window.innerWidth <= 768;
    });
  }
  
  ngOnInit(): void {
    this.initializeCategorySections();
    this.isInitialized = true;
  }

  initializeCategorySections(): void {
    const sections: CategorySection[] = [
      {
        title: 'Engineering Colleges',
        description: 'Top engineering institutions offering cutting-edge technical education',
        icon: 'engineering',
        colleges: [],
        expanded: true
      },
      {
        title: 'Medical Colleges',
        description: 'Leading medical schools for aspiring healthcare professionals',
        icon: 'local_hospital',
        colleges: [],
        expanded: false
      },
      {
        title: 'Arts & Humanities',
        description: 'Prestigious institutions for liberal arts and humanities education',
        icon: 'palette',
        colleges: [],
        expanded: false
      },
      {
        title: 'Science Colleges',
        description: 'Research-focused institutions for natural and applied sciences',
        icon: 'science',
        colleges: [],
        expanded: false
      },
      {
        title: 'Law Colleges',
        description: 'Premier law schools for legal education and justice studies',
        icon: 'gavel',
        colleges: [],
        expanded: false
      },
      {
        title: 'Business Schools',
        description: 'Top-rated institutions for management and business education',
        icon: 'business',
        colleges: [],
        expanded: false
      },
      {
        title: 'Pharmacy Colleges',
        description: 'Leading institutions for pharmaceutical studies and research',
        icon: 'medication',
        colleges: [],
        expanded: false
      }
    ];

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

  toggleExpansion(section: CategorySection): void {
    console.log('Toggling section:', section);
    if (this.isInitialized) {
      this.isInitialized = false;
      return;
    }
    section.expanded = !section.expanded;
  }
}
