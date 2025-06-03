import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SharedCommonModule, SharedMaterialModule } from '../../../shared/modules';
import { CollegeSearchParams } from '../../../core/models/college.model';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-search-form',
  imports: [
    SharedCommonModule,
    SharedMaterialModule,
  ],
  templateUrl: './search-form.component.html',
  styleUrl: './search-form.component.scss'
})
export class SearchFormComponent implements OnInit {
  @Input() initialSearchParams: CollegeSearchParams = {};
  @Output() search = new EventEmitter<CollegeSearchParams>();
  
  searchForm: FormGroup;
  
  constructor(private fb: FormBuilder) {
    this.searchForm = this.fb.group({
      keyword: [''],
      city: [''],
      state: [''],
      category: [''],
      course: [''],
      radius: [20],
      latitude: [null],
      longitude: [null]
    });
  }
  
  ngOnInit(): void {
    this.resetForm();
  }
  
  resetForm(): void {
    this.searchForm.reset({
      keyword: this.initialSearchParams.keyword || '',
      city: this.initialSearchParams.city || '',
      state: this.initialSearchParams.state || '',
      category: this.initialSearchParams.category || '',
      course: this.initialSearchParams.course || '',
      radius: this.initialSearchParams.radius || 20,
      latitude: this.initialSearchParams.latitude || null,
      longitude: this.initialSearchParams.longitude || null
    });
  }
  
  onSubmit(): void {
    const formValues = this.searchForm.value;
    
    // Remove empty values
    const filteredParams: CollegeSearchParams = {};
    
    Object.keys(formValues).forEach(key => {
      const value = formValues[key];
      if (value !== null && value !== '' && value !== undefined) {
        filteredParams[key as keyof CollegeSearchParams] = value;
      }
    });
    
    this.search.emit(filteredParams);
  }
}
