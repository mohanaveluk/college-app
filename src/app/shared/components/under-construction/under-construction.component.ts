import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SharedCommonModule, SharedMaterialModule } from '../../modules';

@Component({
  selector: 'app-under-construction',
  imports: [
    SharedCommonModule,
    SharedMaterialModule,
  ],
  templateUrl: './under-construction.component.html',
  styleUrl: './under-construction.component.scss'
})
export class UnderConstructionComponent {
  constructor(private router: Router) { }

  goHome(): void {
    this.router.navigate(['/']);
  }
}
