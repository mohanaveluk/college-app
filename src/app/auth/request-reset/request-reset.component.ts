import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PasswordResetService } from '../user-profile/services/password-reset.service';
import { SharedCommonModule, SharedMaterialModule } from '../../shared/modules';
import { LoadingSpinnerComponent } from '../../features/shared/components/loading-spinner/loading-spinner.component';

interface EmailProvider {
  name: string;
  url: string;
  domain: string[];
}

@Component({
  selector: 'app-request-reset',
  imports: [
    SharedCommonModule,
    SharedMaterialModule,
   // LoadingSpinnerComponent,
  ],    
  templateUrl: './request-reset.component.html',
  styleUrl: './request-reset.component.scss'
})
export class RequestResetComponent {
  resetForm: FormGroup;
  loading = false;
  resetSuccess = false;
  userEmail = '';

  private emailProviders: EmailProvider[] = [
    { 
      name: 'Gmail',
      url: 'https://mail.google.com',
      domain: ['gmail.com', 'googlemail.com']
    },
    { 
      name: 'Outlook',
      url: 'https://outlook.live.com',
      domain: ['outlook.com', 'hotmail.com', 'live.com']
    },
    { 
      name: 'Yahoo Mail',
      url: 'https://mail.yahoo.com',
      domain: ['yahoo.com', 'ymail.com']
    }
  ];

  constructor(
    private fb: FormBuilder,
    private passwordResetService: PasswordResetService,
    private snackBar: MatSnackBar
  ) {
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.resetForm.valid) {
      this.loading = true;
      this.userEmail = this.resetForm.get('email')?.value;

      this.passwordResetService.requestReset(this.userEmail).subscribe({
        next: () => {
          this.loading = false;
          this.resetSuccess = true;
          this.snackBar.open(
            'Password reset link has been sent to your email',
            'Close',
            { duration: 5000 }
          );
          this.resetForm.reset();
          this.loading = false;
        },
        error: (error: { error: { message: any; }; }) => {
          this.snackBar.open(
            error?.error?.message || 'Failed to send reset link',
            'Close',
            { duration: 5000 }
          );
          this.loading = false;
        }
      });
    }
  }

  get emailProviderName(): string {
    const emailDomain = this.userEmail.split('@')[1];
    const provider = this.emailProviders.find(p => 
      p.domain.includes(emailDomain)
    );
    return provider?.name || 'Email';
  }

  openEmailProvider(): void {
    const emailDomain = this.userEmail.split('@')[1];
    const provider = this.emailProviders.find(p => 
      p.domain.includes(emailDomain)
    );
    
    if (provider) {
      window.open(provider.url, '_blank');
    } else {
      // For unknown email providers, try to construct a webmail URL
      window.open(`https://${emailDomain}`, '_blank');
    }
  }
}

