import { Component, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedCommonModule, SharedMaterialModule } from '../../../../shared/modules';
import { LoadingSpinnerComponent } from '../../../../features/shared/components/loading-spinner/loading-spinner.component';


@Component({
  selector: 'app-otc-login',
  imports: [
    SharedCommonModule,
    SharedMaterialModule,
   // LoadingSpinnerComponent,
  ],  
  templateUrl: './otc-login.component.html',
  styleUrl: './otc-login.component.scss'
})
export class OtcLoginComponent {
  @Output() sendOtc = new EventEmitter<string>();
  @Output() verifyOtc = new EventEmitter<{mobile: string, code: string}>();

  otcForm: FormGroup;
  codeSent = false;

  constructor(private fb: FormBuilder) {
    this.otcForm = this.fb.group({
      mobile: ['', [Validators.required, Validators.pattern('^\\+?[1-9]\\d{1,14}$')]],
      code: [{ value: '', disabled: true }, [Validators.required, Validators.pattern('^[0-9]{6}$')]]
    });
  }

  onSendOtc(): void {
    if (this.otcForm.get('mobile')?.valid) {
      this.sendOtc.emit(this.otcForm.get('mobile')?.value);
      this.otcForm.get('code')?.enable();
      this.codeSent = true;
    }
  }

  onVerifyOtc(): void {
    if (this.otcForm.valid) {
      this.verifyOtc.emit({
        mobile: this.otcForm.get('mobile')?.value,
        code: this.otcForm.get('code')?.value
      });
    }
  }
}
