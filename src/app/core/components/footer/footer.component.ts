import { Component } from '@angular/core';
import { SharedCommonModule, SharedMaterialModule } from '../../../shared/modules';

@Component({
  selector: 'app-footer',
  imports: [
    SharedCommonModule,
    SharedMaterialModule
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  year = new Date().getFullYear();
}
