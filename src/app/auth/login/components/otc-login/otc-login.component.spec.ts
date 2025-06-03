import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtcLoginComponent } from './otc-login.component';

describe('OtcLoginComponent', () => {
  let component: OtcLoginComponent;
  let fixture: ComponentFixture<OtcLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OtcLoginComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OtcLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
