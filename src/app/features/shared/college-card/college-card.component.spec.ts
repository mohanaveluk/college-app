import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollegeCardComponent } from './college-card.component';

describe('CollegeCardComponent', () => {
  let component: CollegeCardComponent;
  let fixture: ComponentFixture<CollegeCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollegeCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CollegeCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
