import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PasswordResetService } from '../user-profile/services/password-reset.service';
import { passwordMatchValidator } from '../validators/password-match.validator';
import { SharedCommonModule, SharedMaterialModule } from '../../shared/modules';
import { LoadingSpinnerComponent } from '../../features/shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-reset-password',
  imports: [
    SharedCommonModule,
    SharedMaterialModule,
   // LoadingSpinnerComponent,
  ],    
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent implements OnInit {
  passwordForm: FormGroup;
  loading = false;
  hidePassword = true;
  hideConfirmPassword = true;
  private token: string = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private passwordResetService: PasswordResetService,
    private snackBar: MatSnackBar
  ) {
    this.passwordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: passwordMatchValidator });
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParams['token'];
    if (!this.token) {
      this.snackBar.open('Invalid reset token', 'Close', { duration: 5000 });
      this.router.navigate(['/auth/login']);
    }
  }

  onSubmit(): void {
    if (this.passwordForm.valid && this.token) {
      this.loading = true;
      const password = this.passwordForm.get('password')?.value;

      this.passwordResetService.resetPassword(this.token, password).subscribe({
        next: () => {
          this.snackBar.open(
            'Password has been reset successfully',
            'Close',
            { duration: 5000 }
          );
          this.router.navigate(['/auth/login']);
        },
        error: (error) => {
          this.snackBar.open(
            error?.error?.message || 'Failed to reset password',
            'Close',
            { duration: 5000 }
          );
          this.loading = false;
        }
      });
    }
  }
}
