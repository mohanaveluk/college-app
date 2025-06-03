import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService, SocialAuthResponse } from '../auth.service';
import { LoginRequest } from '../../shared/models/auth.model';
import { SharedCommonModule, SharedMaterialModule } from '../../shared/modules';
import { LoadingSpinnerComponent } from '../../features/shared/components/loading-spinner/loading-spinner.component';
import { OtcLoginComponent } from "./components/otc-login/otc-login.component";
import { EmailVerificationComponent } from "../components/email-verification/email-verification.component";

@Component({
  selector: 'app-login',
  imports: [
    SharedCommonModule,
    SharedMaterialModule,
   // LoadingSpinnerComponent,
    OtcLoginComponent,
    EmailVerificationComponent
],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent  implements OnInit{
  
  public email = ''
  public password = ''
  loginForm: FormGroup;
  showVerification = false;
  unverifiedEmail = '';
  
  loading = false;
  hidePassword = true;
  errorMessage: string | null = null;
  showOtcLogin = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }
  
  ngOnInit() {
    // Check if user is already logged in
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/']);
    }
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.loading = true;
      const loginRequest: LoginRequest  = {email: this.loginForm.value.email, password: this.loginForm.value.password};
      this.authService.login(this.loginForm.value).subscribe( {
        next: (response) => {
          const redirectUrl = this.authService.redirectUrl || '/'; // Default to home if no redirect URL
          this.router.navigateByUrl(redirectUrl);
          this.authService.redirectUrl = null; // Clear redirectUrl
          this.loading = false;
          console.log(response);
        },
        error: (error) => {
          this.loading = false;
          if(typeof error === "string" && error.includes("unavailable")){
            this.errorMessage = error.toString();
          }
          else{
            this.errorMessage = error.error.message || 'An error occurred during login';
            console.error('Login failed:', error);
          }

          if (error !=null && error.error !=null && error.error.message.includes('verify your email')) {
            this.unverifiedEmail = this.loginForm.get('email')?.value;
            this.showVerification = true;
            this.snackBar.open(error.error.message || 'Verify your email', 'Close', {
              duration: 5000
            });
          } else {
            this.snackBar.open(error.error.message || 'Login failed', 'Close', {
              duration: 5000
            });
          }
        }
      });
    }
  }

  onVerified(): void {
    this.snackBar.open('Email verified successfully! Please login.', 'Close', {
      duration: 3000
    });
    this.errorMessage = null;
    this.showVerification = false;
    this.loginForm.reset();
  }

  onSocialLogin(provider: string): void {
    this.authService.socialLogin(provider).then((observable) => {
      observable.subscribe({
        next: (response: SocialAuthResponse) => {
          console.log('Login successful:', response);
          this.router.navigate(['/home3']);
        },
        error: (error) => {
          console.error('Login failed:', error);
          this.snackBar.open(`${provider} login failed: ${error.message}`, 'Close');
        }
      });
    }).catch((error) => {
      console.error('Error initiating social login:', error);
      // Handle error in initiating social login
    });
  }

  onSendOtc(mobile: string): void {
    this.authService.sendOtc(mobile).subscribe({
      next: () => {
        this.snackBar.open('One-time code sent to your mobile number', 'Close');
      },
      error: (error: { message: any; }) => {
        this.snackBar.open(`Failed to send code: ${error.message}`, 'Close');
      }
    });
  }

  onVerifyOtc(data: {mobile: string, code: string}): void {
    this.authService.verifyOtc(data.mobile, data.code).subscribe({
      next: () => this.router.navigate(['/exam/list']),
      error: (error: { message: any; }) => {
        this.snackBar.open(`Verification failed: ${error.message}`, 'Close');
      }
    });
  }

  toggleOtcLogin(): void {
    this.showOtcLogin = !this.showOtcLogin;
  }


  /*onSubmit1() {
    this.authService.login(this.email, this.password).subscribe(response => {
      // Handle successful login
      this.router.navigate(['/exams']);
    }, error => {
      // Handle login error
      console.error('Login failed', error);
    });
  }
  */
}
