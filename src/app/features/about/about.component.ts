import { Component } from '@angular/core';
import { SharedCommonModule, SharedMaterialModule } from '../../shared/modules';

@Component({
  selector: 'app-about',
  imports: [
    SharedCommonModule,
    SharedMaterialModule,
  ],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {

}
