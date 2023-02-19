import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalAccountTagAllocationChartComponent } from './personal-account-tag-allocation-chart.component';

describe('PersonalAccountTagAllocationChartComponent', () => {
  let component: PersonalAccountTagAllocationChartComponent;
  let fixture: ComponentFixture<PersonalAccountTagAllocationChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ PersonalAccountTagAllocationChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonalAccountTagAllocationChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
