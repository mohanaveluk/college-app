import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedCommonModule, SharedMaterialModule } from '../../shared/modules';
import { LoadingSpinnerComponent } from '../../features/shared/components/loading-spinner/loading-spinner.component';
import { EmailVerificationComponent } from "../components/email-verification/email-verification.component";

@Component({
  selector: 'app-register',
  imports: [
    SharedCommonModule,
    SharedMaterialModule,
    //LoadingSpinnerComponent,
    EmailVerificationComponent
],  
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  public name!: string;
  public email!: string;
  public password!: string;
  registerForm!: FormGroup;
  registeredEmail = '';
  showVerification = false;
  loading = false;
  errorMessage = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.registerForm = this.fb.group({
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(10)]]
    });
  }


  onSubmit() {

    let phoneNumber = this.registerForm.value.phone?.replace('+1', '');
    const register = this.registerForm.value;
    //register.mobile = phoneNumber !== undefined ? `+1${phoneNumber}`: null;
    this.loading = true;
    this.authService.register(register).subscribe(response => {
      // Handle successful registration
      //this.router.navigate(['/login']);

      this.registeredEmail = this.registerForm.get('email')?.value;
      this.showVerification = true;
      this.loading = false;
      
    }, error => {
      // Handle registration error
      this.loading = false;
      this.errorMessage = error?.error?.message;
      console.error('Registration failed', error);
      this.snackBar.open(error.error.message || 'Registration failed', 'Close', {
        duration: 5000
      });
    });
  }

  onVerified(): void {
    this.snackBar.open('Email verified successfully!', 'Close', {
      duration: 3000
    });
    this.router.navigate(['/auth/login']);
  }
}
