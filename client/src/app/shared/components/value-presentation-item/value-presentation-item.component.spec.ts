import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValuePresentationItemComponent } from './value-presentation-item.component';

describe('ValuePresentationItemComponent', () => {
  let component: ValuePresentationItemComponent;
  let fixture: ComponentFixture<ValuePresentationItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValuePresentationItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValuePresentationItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
