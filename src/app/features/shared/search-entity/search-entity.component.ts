import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { SearchEntityParams } from '../../../core/models/college.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SharedCommonModule, SharedMaterialModule } from '../../../shared/modules';

@Component({
  selector: 'app-search-entity',
  imports: [
    SharedCommonModule,
    SharedMaterialModule,
],
  templateUrl: './search-entity.component.html',
  styleUrl: './search-entity.component.scss'
})
export class SearchEntityComponent implements OnInit {
  @Input() initialSearchParams: SearchEntityParams = {};
  @Output() search = new EventEmitter<SearchEntityParams>();
  @ViewChild('searchInput') searchInput!: ElementRef;
  
  categories: string[] = ['All', 'Engineering', 'Medical', 'Pharmacy', 'Arts'];
  selectedCategory: string | null = null;

  searchQuery = '';
  searchType = 'keyword';

  searchForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.searchForm = this.fb.group({
      k: [''],
      cs: ['All'],
    });
  }
  
  ngOnInit(): void {
    this.resetForm();
  }
  onSubmit(): void {
    const formValues = this.searchForm.value;
    
    // Remove empty values
    const filteredParams: SearchEntityParams = {};
    
    Object.keys(formValues).forEach(key => {
      const value = formValues[key];
      if (value !== null && value !== '' && value !== undefined) {
        filteredParams[key as keyof SearchEntityParams] = value;
      }
    });
    
    this.search.emit(filteredParams);
  }

  clearSearch() {
    //this.searchQuery = '';
    // Optional: Set focus back to input after clearing
    //this.searchInput.nativeElement.focus();
    // Clear the form control value
    this.searchForm.get('k')?.setValue('');

    // Set focus back to the input field
    if (this.searchInput && this.searchInput.nativeElement) {
      this.searchInput.nativeElement.focus();
    }

  }

  resetForm(): void {
    this.searchForm.reset({
      k: this.initialSearchParams.k || '',
      cs: this.initialSearchParams.cs || '',
    });
  }
  

}
