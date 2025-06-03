import { Component, OnInit } from '@angular/core';
import { SharedCommonModule, SharedMaterialModule } from '../../shared/modules';
import { College } from '../../core/models/college.model';
import { ActivatedRoute, Router } from '@angular/router';
import { CollegeService } from '../../core/services/college.service';
import { Location } from '@angular/common';
import { CollegeModel } from '../../core/models/search-response.model';

@Component({
  selector: 'app-college-details',
  imports: [
    SharedCommonModule,
    SharedMaterialModule,
  ],
  templateUrl: './college-details.component.html',
  styleUrl: './college-details.component.scss'
})
export class CollegeDetailsComponent implements OnInit {
  college: CollegeModel | undefined;
  
  constructor(
    private route: ActivatedRoute,
    private collegeService: CollegeService,
    private router: Router,
    private location: Location
  ) {}
  
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const collegeId = params.get('id');
      if (collegeId) {
        this.loadCollege(collegeId);
      }
    });
  }
  
  loadCollege(id: string): void {
    this.collegeService.getCollegeById(id).subscribe(college => {
      if (college) {
        this.college = college;
      } else {
        this.router.navigate(['/colleges']);
      }
    });
  }

  goBack(): void {
    this.location.back();
  }
}