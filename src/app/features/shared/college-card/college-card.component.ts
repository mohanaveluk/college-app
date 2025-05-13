import { Component, Input } from '@angular/core';
import { SharedCommonModule, SharedMaterialModule } from '../../../shared/modules';
import { College } from '../../../core/models/college.model';

@Component({
  selector: 'app-college-card',
      imports: [
        SharedCommonModule,
        SharedMaterialModule
      ],
  templateUrl: './college-card.component.html',
  styleUrl: './college-card.component.scss'
})
export class CollegeCardComponent {
  @Input() college!: College;
  @Input() public viewMode: 'grid' | 'list' = 'grid';
  
}
