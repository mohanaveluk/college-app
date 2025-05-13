import { Component } from '@angular/core';
import { SharedCommonModule, SharedMaterialModule } from '../../../shared/modules';

@Component({
  selector: 'app-header',
  imports: [
    SharedCommonModule,
    SharedMaterialModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

}
