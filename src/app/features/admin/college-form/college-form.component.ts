import { Component, OnInit } from '@angular/core';
import { SharedCommonModule, SharedMaterialModule } from '../../../shared/modules';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CollegeService } from '../../../core/services/college.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Course, State } from '../../../core/models/search-response.model';
import { CourseSelectComponent } from "../../shared/course-select/course-select.component";
import { CourseService } from '../../../core/services/course.service';

@Component({
  selector: 'app-college-form',
  imports: [
    SharedCommonModule,
    SharedMaterialModule,
    CourseSelectComponent
],
  templateUrl: './college-form.component.html',
  styleUrl: './college-form.component.scss'
})
export class CollegeFormComponent implements OnInit {
  collegeForm: FormGroup;
  courseCtrl: FormControl;
  courses: string[] = [];
  selectedCourseIds: string[] = [];
  courseList: Course[] = [];
  selectedCourseList: Course[] = [];

  stateList: State[] = [];
  districtList: State[] = [];
  countryList: State[] = [];
  isEditMode = false;
  collegeId: string | null = null;
  isLoading = false;
  error: string | null = null;

  
  constructor(
    private fb: FormBuilder,
    private collegeService: CollegeService,
    private courseService: CourseService,
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
        this.collegeId = id;
        this.loadCourses();
        this.loadStates();
        this.loadDistricts();
        this.loadCountries();
        this.loadCollege(this.collegeId);
      }
    });
  }
  
  loadCollege(id: string): void {
    this.collegeService.getCollegeById(id).subscribe(college => {
      if (college) {
        this.collegeForm.patchValue({
          name: college.name,
          city: college.city,
          state: college.state.id,
          district: college.district.id,
          country: college.country.id,
          category: college.category,
          address: college.address,
          rating: college.rating,
          established: college.established,
          imageUrl: college.image_url,
          description: college.description,
          contact: {
            phone: college.phone,
            email: college.email,
            website: college.website
          }
        });
        
        // contact: {
        //   phone: college.contact.phone,
        //   email: college.contact.email,
        //   website: college.contact.website
        // }


        this.courses = [...(college.collegeCourses ?? []).map(course => course).map(c => c.course.name)];
        this.selectedCourseIds = [...(college.collegeCourses ?? []).map(course => course).map(c => c.course.id)];
        this.selectedCourseList = [...(college.collegeCourses ?? []).map(course => course).map(c => c.course)];
        //this.courseCtrl.setValue('');
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
      district: ['', Validators.required],
      country: ['', Validators.required],
      category: ['', Validators.required],
      address: ['', Validators.required],
      rating: [4.0, [Validators.required, Validators.min(0), Validators.max(5)]],
      established: [null, Validators.required],
      imageUrl: [''],
      description: ['', Validators.required],
      contact: this.fb.group({
        phone: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        website: ['', Validators.required]
      }),
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
    this.selectedCourseList = this.selectedCourseList.filter(c => c.name !== course);
    this.selectedCourseIds = [...(this.selectedCourseList ?? []).map(c => c.id)];
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
      courses: this.getSelectedCourseArray(this.selectedCourseIds),
      active: true,
      rating: parseFloat((this.collegeForm.value.rating)),
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
  
  loadCourses(): void {
    this.isLoading = true;
    this.error = null;
    
    this.courseService.getAllCourses().subscribe({
      next: (response: any) => {
        this.courseList = response.data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load courses. Please try again later.';
        this.isLoading = false;
        console.error('Error loading courses:', err);
      }
    });
  }

  loadStates(): void {
    this.isLoading = true;
    this.error = null;
    
    this.collegeService.getStates().subscribe({
      next: (response: any) => {
        this.stateList = response;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load state. Please try again later.';
        this.isLoading = false;
        console.error('Error loading state:', err);
      }
    });
  }

    loadDistricts(): void {
    this.isLoading = true;
    this.error = null;
    
    this.collegeService.getDistricts().subscribe({
      next: (response: any) => {
        this.districtList = response;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load district. Please try again later.';
        this.isLoading = false;
        console.error('Error loading district:', err);
      }
    });
  }

    loadCountries(): void {
    this.isLoading = true;
    this.error = null;
    
    this.collegeService.getCountries().subscribe({
      next: (response: any) => {
        this.countryList = response;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load country. Please try again later.';
        this.isLoading = false;
        console.error('Error loading country:', err);
      }
    });
  }


  onSelected(selectedCourses: Course[]){
    this.courses = [...(selectedCourses ?? []).map(c => c.name)];
    this.selectedCourseList = selectedCourses;
  }

  getSelectedCourseArray(courseIds: string[]){
    //let selectedCoursesArray = [];
    //selectedCoursesArray = this.courseList.filter(c => courseIds.includes(c.id));
    const courses = courseIds.map(course_id => ({
      course_id,
      research: 0,
      infrastructure: 0,
      teaching: 0
    }));
    return courses;
  }

  goBack(): void {
    this.router.navigate(['/admin']);
  }
}