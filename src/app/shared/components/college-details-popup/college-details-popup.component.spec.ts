import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollegeDetailsPopupComponent } from './college-details-popup.component';

describe('CollegeDetailsPopupComponent', () => {
  let component: CollegeDetailsPopupComponent;
  let fixture: ComponentFixture<CollegeDetailsPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollegeDetailsPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CollegeDetailsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
