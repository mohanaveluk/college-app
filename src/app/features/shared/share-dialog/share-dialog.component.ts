import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SharedCommonModule, SharedMaterialModule } from '../../../shared/modules';
import { CollegeModel } from '../../../core/models/search-response.model';
import { ImageFallbackPipe } from "../../../shared/utility/image-fallback.pipe";

@Component({
  selector: 'app-share-dialog',
  imports: [
    SharedCommonModule,
    SharedMaterialModule,
    ImageFallbackPipe
],
  templateUrl: './share-dialog.component.html',
  styleUrl: './share-dialog.component.scss'
})
export class ShareDialogComponent implements OnInit {
  shareForm!: FormGroup;
  college!: CollegeModel;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ShareDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.college = this.data;
    this.shareForm = this.fb.group({
      collegeId: [this.data.id, [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      notes: [''],
    });
  }

  onSubmit(): void {
    if (this.shareForm.valid) {
      console.log('Form Value:', this.shareForm.value);
      this.dialogRef.close(this.shareForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
