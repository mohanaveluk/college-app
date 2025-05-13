import { Component } from '@angular/core';
import { SharedCommonModule, SharedMaterialModule } from '../../shared/modules';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-contact',
  imports: [
    SharedCommonModule,
    SharedMaterialModule,
  ],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {
  contactForm: FormGroup;
  
  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      subject: ['general', Validators.required],
      message: ['', Validators.required]
    });
  }
  
  onSubmit(): void {
    if (this.contactForm.invalid) {
      return;
    }
    
    // In a real application, you would send this to an API
    console.log('Form submitted:', this.contactForm.value);
    
    this.snackBar.open('Message sent successfully!', 'Close', { 
      duration: 3000,
      panelClass: 'success-snackbar'
    });
    
    this.contactForm.reset({
      subject: 'general'
    });
  }
}
