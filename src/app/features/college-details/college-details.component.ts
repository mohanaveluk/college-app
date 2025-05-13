import { Component, OnInit } from '@angular/core';
import { SharedCommonModule, SharedMaterialModule } from '../../shared/modules';
import { College } from '../../core/models/college.model';
import { ActivatedRoute, Router } from '@angular/router';
import { CollegeService } from '../../core/services/college.service';
import { Location } from '@angular/common';

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
  college: College | undefined;
  
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
        this.loadCollege(parseInt(collegeId, 10));
      }
    });
  }
  
  loadCollege(id: number): void {
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