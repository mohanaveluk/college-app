import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-social-login',
  templateUrl: './social-login.component.html',
  styleUrl: './social-login.component.scss'
})
export class SocialLoginComponent {
  @Output() socialLogin = new EventEmitter<string>();

  loginWith(provider: string): void {
    this.socialLogin.emit(provider);
  }
}
