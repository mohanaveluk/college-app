import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SharedCommonModule, SharedMaterialModule } from '../../../../shared/modules';
import { LoadingSpinnerComponent } from '../../../../features/shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-profile-image',
  imports: [
    SharedCommonModule,
    SharedMaterialModule,
   // LoadingSpinnerComponent,

  ],
  templateUrl: './profile-image.component.html',
  styleUrl: './profile-image.component.scss'
})
export class ProfileImageComponent {
  @Input() currentImage: string | null = null;
  @Output() imageSelected = new EventEmitter<File>();
  @Output() imageRemoved = new EventEmitter<void>();

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file && file.type.match(/image\/*/) && file.size <= 5000000) {
      this.imageSelected.emit(file);
    }
  }

  removeImage(): void {
    this.imageRemoved.emit();
  }
}
