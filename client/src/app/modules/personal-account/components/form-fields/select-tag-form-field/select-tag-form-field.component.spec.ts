import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectTagFormFieldComponent } from './select-tag-form-field.component';

describe('SelectTagFormFieldComponent', () => {
  let component: SelectTagFormFieldComponent;
  let fixture: ComponentFixture<SelectTagFormFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectTagFormFieldComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectTagFormFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
