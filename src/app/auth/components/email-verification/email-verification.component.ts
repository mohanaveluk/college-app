import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../auth.service';
import { SharedCommonModule, SharedMaterialModule } from '../../../shared/modules';
import { LoadingSpinnerComponent } from '../../../features/shared/components/loading-spinner/loading-spinner.component';


@Component({
  selector: 'app-email-verification',
  imports: [
    SharedCommonModule,
    SharedMaterialModule,
    LoadingSpinnerComponent,

  ],  
  templateUrl: './email-verification.component.html',
  styleUrl: './email-verification.component.scss'
})
export class EmailVerificationComponent {
  @Input() email!: string;
  @Output() verified = new EventEmitter<void>();
  
  verificationForm: FormGroup;
  verifying = false;
  loading = false;
  loadingMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.verificationForm = this.fb.group({
      code: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]]
    });
  }

  onSubmit(): void {
    if (this.verificationForm.valid) {
      this.verifying = true;
      this.loading = true;
      this.loadingMessage = 'Verifying email...';

      this.authService.verifyEmail({
        email: this.email,
        code: this.verificationForm.get('code')?.value || '0'
      }).subscribe({
        next: () => {
          this.verifying = false;
          this.loading = false;
          this.verified.emit();
        },
        error: (error: { error: { message: any; }; }) => {
          this.loading = false;
          this.verifying = false;
          this.snackBar.open(error.error.message || 'Verification failed', 'Close', {
            duration: 5000
          });
        }
      });
    }
  }

  resendCode(): void {
    this.loading = true;
    this.loadingMessage = 'Sending verification code...';

    this.authService.resendVerificationCode(this.email).subscribe({
      next: () => {
        this.loading = false;
        this.snackBar.open('Verification code sent to your email', 'Close', {
          duration: 5000
        });
      },
      error: (error: { error: { message: any; }; }) => {
        this.loading = false;
        this.snackBar.open(error.error.message || 'Failed to send code', 'Close', {
          duration: 5000
        });
      }
    });
  }
}
