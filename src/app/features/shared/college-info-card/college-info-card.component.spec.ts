import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollegeInfoCardComponent } from './college-info-card.component';

describe('CollegeInfoCardComponent', () => {
  let component: CollegeInfoCardComponent;
  let fixture: ComponentFixture<CollegeInfoCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollegeInfoCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CollegeInfoCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
