import { Component, OnInit } from '@angular/core';
import { SharedCommonModule, SharedMaterialModule } from '../../../shared/modules';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CollegeService } from '../../../core/services/college.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-college-form',
  imports: [
    SharedCommonModule,
    SharedMaterialModule,
  ],
  templateUrl: './college-form.component.html',
  styleUrl: './college-form.component.scss'
})
export class CollegeFormComponent implements OnInit {
  collegeForm: FormGroup;
  courseCtrl: FormControl;
  courses: string[] = [];
  isEditMode = false;
  collegeId: number | null = null;
  
  constructor(
    private fb: FormBuilder,
    private collegeService: CollegeService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.collegeForm = this.createForm();
    this.courseCtrl = this.fb.control('');
  }
  
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.collegeId = parseInt(id, 10);
        this.loadCollege(this.collegeId);
      }
    });
  }
  
  loadCollege(id: number): void {
    this.collegeService.getCollegeById(id).subscribe(college => {
      if (college) {
        this.collegeForm.patchValue({
          name: college.name,
          city: college.city,
          state: college.state,
          category: college.category,
          address: college.address,
          rating: college.rating,
          established: college.established,
          imageUrl: college.imageUrl,
          description: college.description,
          contact: {
            phone: college.contact.phone,
            email: college.contact.email,
            website: college.contact.website
          }
        });
        
        this.courses = [...college.courses];
      } else {
        this.snackBar.open('College not found', 'Close', { duration: 3000 });
        this.router.navigate(['/admin']);
      }
    });
  }
  
  createForm(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      category: ['', Validators.required],
      address: ['', Validators.required],
      rating: [4.0, [Validators.required, Validators.min(0), Validators.max(5)]],
      established: [null, Validators.required],
      imageUrl: ['', Validators.required],
      description: ['', Validators.required],
      contact: this.fb.group({
        phone: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        website: ['', Validators.required]
      })
    });
  }
  
  addCourse(): void {
    if (this.courseCtrl.value) {
      const course = this.courseCtrl.value.trim();
      if (!this.courses.includes(course)) {
        this.courses.push(course);
      }
      this.courseCtrl.setValue('');
    }
  }
  
  removeCourse(course: string): void {
    this.courses = this.courses.filter(c => c !== course);
  }
  
  onSubmit(): void {
    if (this.collegeForm.invalid || this.courses.length === 0) {
      if (this.courses.length === 0) {
        this.snackBar.open('Please add at least one course', 'Close', { duration: 3000 });
      }
      return;
    }
    
    const collegeData = {
      ...this.collegeForm.value,
      courses: this.courses,
      active: true,
      performance: {
        placements: 85,
        research: 80,
        infrastructure: 85,
        teaching: 90
      }
    };
    
    if (this.isEditMode && this.collegeId) {
      this.collegeService.updateCollege(this.collegeId, collegeData).subscribe(() => {
        this.snackBar.open('College updated successfully', 'Close', { duration: 3000 });
        this.router.navigate(['/admin']);
      });
    } else {
      this.collegeService.createCollege(collegeData).subscribe(() => {
        this.snackBar.open('College added successfully', 'Close', { duration: 3000 });
        this.router.navigate(['/admin']);
      });
    }
  }
  
  goBack(): void {
    this.router.navigate(['/admin']);
  }
}