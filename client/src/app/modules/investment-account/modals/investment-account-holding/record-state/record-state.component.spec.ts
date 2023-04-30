import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordStateComponent } from './record-state.component';

describe('RecordStateComponent', () => {
  let component: RecordStateComponent;
  let fixture: ComponentFixture<RecordStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ RecordStateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecordStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
