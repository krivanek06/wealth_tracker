import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalAccountAggregationRadioButtonsComponent } from './personal-account-aggregation-radio-buttons.component';

describe('PersonalAccountAggregationRadioButtonsComponent', () => {
  let component: PersonalAccountAggregationRadioButtonsComponent;
  let fixture: ComponentFixture<PersonalAccountAggregationRadioButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PersonalAccountAggregationRadioButtonsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonalAccountAggregationRadioButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
