import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-session-expired-dialog',
  templateUrl: './session-expired-dialog.component.html',
  styleUrls: ['./session-expired-dialog.component.scss']
})
export class SessionExpiredDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<SessionExpiredDialogComponent>,
    private router: Router
  ) {}

  onLogin(): void {
    this.dialogRef.close('login');
    this.router.navigate(['/auth/login']);
  }

  onHome(): void {
    this.dialogRef.close('home');
    this.router.navigate(['/']);
  }
}