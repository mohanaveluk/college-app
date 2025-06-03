import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { SharedCommonModule, SharedMaterialModule } from '../../../shared/modules';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { Course } from '../../../core/models/search-response.model';
import { BehaviorSubject, combineLatest, distinctUntilChanged, map, Observable, startWith } from 'rxjs';
import { MatSelectChange } from '@angular/material/select';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-course-select',
  imports: [  
    SharedCommonModule,
    SharedMaterialModule,
    NgxMatSelectSearchModule
  ],
  templateUrl: './course-select.component.html',
  styleUrl: './course-select.component.scss'
})
export class CourseSelectComponent implements OnInit, OnChanges  {
  @Input() allCourses: Course[] = [];
  @Input() preselectedCourseIds: string[] = [];
  @Output() selected = new EventEmitter<Course[]>();
  //@Input() 
  private _allCourses: Course[] = [];
  //private coursesLoaded$ = new BehaviorSubject<boolean>(false);
  // Data streams
  private courses$ = new BehaviorSubject<Course[]>([]);

  set allCourses1(courses: Course[]) {
    this._allCourses = courses;
    this._initializeFilter();
    this._setPreselected();
  }

  courseControl1 = new FormControl();
  courseControl = new FormControl<Course[]>([]);
  searchControl = new FormControl('');
  filteredCourses!: Observable<Course[]>;
  selectedCourses: Course[] = [];



  get allCourses1(): Course[] {
    return this._allCourses;
  }

  constructor() {
    // Initialize the course control with an empty array
    
    this.filteredCourses = combineLatest([
      this.courses$,
      this.searchControl.valueChanges.pipe(
        startWith(''),
        distinctUntilChanged()
      )
    ]).pipe(
      map(([courses, search]) => this._filter(courses, search))
    );

  }
  ngOnInit() {
    //this._initializeFilter();
    // Set preselected courses
    // if (this.preselectedCourseIds && this.preselectedCourseIds.length > 0) {
    //   const preselected  = this.allCourses.filter(course => 
    //     this.preselectedCourseIds.includes(course.id)
    //   );
    //   this.courseControl.setValue(preselected);
    // }

    
    // Setup filtering
    // this.filteredCourses = this.courseControl.valueChanges.pipe(
    //   startWith(''),
    //   map(search => {
    //     let filterValue = '';
    //     if (typeof search === 'string') {
    //       filterValue = search;
    //     }
    //     return this._filter(filterValue);
    //   })
    // );


    // this.filteredCourses = this.searchControl.valueChanges.pipe(
    //   startWith(''),
    //   map(search => this._filter(search))
    // );
  }

  ngOnChanges1(changes: SimpleChanges): void {
    if (changes['allCourses'] && this.allCourses) {
      this.courses$.next(this.allCourses);
      this._setPreselected();
    }
  }

  ngOnChanges(): void {
    this.courses$.next(this.allCourses);
    if (this.preselectedCourseIds?.length && this.allCourses?.length) {
      const preselected = this.allCourses.filter(course => 
        this.preselectedCourseIds.includes(course.id)
      );
      this.courseControl.setValue(preselected);
    }
    else{
      this.courseControl.setValue([]);
    }
  }
  
  private _initializeFilter() {
    this.filteredCourses = this.searchControl.valueChanges.pipe(
      startWith(''),
      map(search => this._filter([], search))
    );
  }

  private _setPreselected() {
    if (this.preselectedCourseIds?.length && this.allCourses?.length) {
      const preselected = this.allCourses.filter(c => 
        this.preselectedCourseIds.includes(c.id)
        
      );
      this.selectedCourses = preselected;
      this.courseControl.setValue(preselected);
    }
    
  }

  private _filter2(search: string): Course[] {
    if (!search) return this.allCourses;
    return this.allCourses.filter(c => 
      c.name.toLowerCase().includes(search.toLowerCase()) || 
      c.code.toLowerCase().includes(search.toLowerCase())
    );
  }

   private _filter(courses: Course[], search: string | null): Course[] {
    if (!this.allCourses) return [];
    if (!search) return courses;
    const searchTerm = search.toLowerCase();
     return courses.filter(c =>
       c?.name?.toLowerCase().includes(searchTerm) ||
       c?.code?.toLowerCase().includes(searchTerm)
     );
  }

  private _filter1(search: string): Course[] {
    let filterValue = '';
    if (typeof search === 'string') {
      filterValue = search.toLowerCase();
    } else if (Array.isArray(search)) {
      // When items are selected, we get an array of courses
      return this.allCourses;
    }

    const allFilteredCourses = this.allCourses.filter(course => 
      course.name.toLowerCase().includes(filterValue) || 
      course.code.toLowerCase().includes(filterValue)
    );
    return allFilteredCourses.sort((a, b) => a.name.localeCompare(b.name));
  }

  onSelectionChange(event: MatSelectChange): void {
    this.selectedCourses = event.value;
    this.selected.emit(this.selectedCourses);
  }

  displayFn(course: Course): string {
    return course ? `${course.code} - ${course.name}` : '';
  }

  compareCourses1(course1: Course, course2: Course): boolean {
    // Compare by ID since it's the unique identifier
    return course1 && course2 ? course1.id === course2.id : course1 === course2;
  }

  compareCourses(course1: Course, course2: Course): boolean {
    return course1?.id === course2?.id;
  }

}
