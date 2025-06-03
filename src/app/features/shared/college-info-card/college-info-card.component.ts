import { Component, Input, ViewChild } from '@angular/core';
import { College } from '../../../core/models/college.model';
import { MatMenuTrigger } from '@angular/material/menu';
import { Router } from '@angular/router';
import { SharedCommonModule, SharedMaterialModule } from '../../../shared/modules';
import { CollegeModel } from '../../../core/models/search-response.model';

@Component({
  selector: 'app-college-info-card',
  imports: [
    SharedCommonModule,
    SharedMaterialModule
  ],
  templateUrl: './college-info-card.component.html',
  styleUrl: './college-info-card.component.scss'
})
export class CollegeInfoCardComponent {
  @Input() college!: College;
  @Input() viewMode: 'grid' | 'list' = 'grid';
  @ViewChild(MatMenuTrigger) menuTrigger!: MatMenuTrigger;

  constructor(private router: Router) {}

  onCardClick(event: MouseEvent): void {
    // Don't navigate if clicking on the menu trigger or menu items
    if (!(event.target as HTMLElement).closest('.menu-trigger, .mat-menu-item')) {
      this.router.navigate(['/colleges', this.college.id]);
    }
  }

  stopPropagation(event: MouseEvent): void {
    event.stopPropagation();
  }
}
