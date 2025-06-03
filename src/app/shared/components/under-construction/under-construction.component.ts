import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-under-construction',
  templateUrl: './under-construction.component.html',
  styleUrl: './under-construction.component.scss'
})
export class UnderConstructionComponent {
  constructor(private router: Router) {}

  goHome(): void {
    this.router.navigate(['/']);
  }
}
