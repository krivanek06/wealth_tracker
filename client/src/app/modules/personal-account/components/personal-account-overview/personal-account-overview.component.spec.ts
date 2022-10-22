import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalAccountOverviewComponent } from './personal-account-overview.component';

describe('PersonalAccountOverviewComponent', () => {
  let component: PersonalAccountOverviewComponent;
  let fixture: ComponentFixture<PersonalAccountOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PersonalAccountOverviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonalAccountOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
