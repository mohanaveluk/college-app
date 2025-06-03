import { Component } from '@angular/core';
import { SharedCommonModule, SharedMaterialModule } from '../../shared/modules';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { mobileNumberValidator } from '../../shared/utility/mobile-number.validator';
import { ContactForm } from './contact.model';
import { ContactService } from './contact.service';
import { Router } from '@angular/router';
import { LoadingSpinnerComponent } from "../shared/components/loading-spinner/loading-spinner.component";

@Component({
  selector: 'app-contact',
  imports: [
    SharedCommonModule,
    SharedMaterialModule,
    LoadingSpinnerComponent
],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {
  contactForm: FormGroup;
  public isSubmitting = false;
  isSubmitted = false;
  loading = false;
  loadingMessage = "Processing..."
  
  
  constructor(
    private fb: FormBuilder,
    private contactService: ContactService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [mobileNumberValidator()]],
      //phoneCode: ['+1', Validators.required], // Default to +1 for US
      subject: ['general', Validators.required],
      message: ['', Validators.required]
    });
  }
  
  onSubmit(): void {
    if (this.contactForm.invalid) {
      this.snackBar.open('Please fill in all required fields.', 'Close', { 
        duration: 3000,
        panelClass: 'error-snackbar'
      });
      this.markAllAsTouched();
      return;
    }
    
    if (this.contactForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.loading = true;
      let errorMessage = "";
      this.contactForm.value.phone = this.contactForm.value.phone.replace(/[^0-9]/g, ''); 
      let phoneNumber = this.contactForm.value.phone.replace('+1', '');
      let formData: ContactForm = this.contactForm.value;
      


      this.contactService.submitContactForm(formData).subscribe({
        next: (response) => {
          this.loading = false;
          this.snackBar.open('Form submitted successfully!', 'Close', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
            panelClass: 'success-snackbar'
          });
          this.isSubmitted = true;
          this.contactForm.reset({subject: 'general'});
          this.isSubmitting = false;
        },
        error: (error) => {
          this.loading = false;
          this.isSubmitting = false;
          if(error && error.message) {
            errorMessage = error.message;
          }
          else{
            errorMessage = 'Error submitting form. Please try again.';
          }
          this.snackBar.open(errorMessage, 'Close', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });
        }
      });
    }

    
  }

  private markAllAsTouched() {
    Object.keys(this.contactForm.controls).forEach(field => {
      const control = this.contactForm.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
  }
}
