import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValuePresentationCardComponent } from './value-presentation-card.component';

describe('ValuePresentationCardComponent', () => {
  let component: ValuePresentationCardComponent;
  let fixture: ComponentFixture<ValuePresentationCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ValuePresentationCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValuePresentationCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
