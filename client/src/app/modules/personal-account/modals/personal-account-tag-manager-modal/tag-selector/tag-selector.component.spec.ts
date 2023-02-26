import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TagSelectorComponent } from './tag-selector.component';

describe('TagSelectorComponent', () => {
  let component: TagSelectorComponent;
  let fixture: ComponentFixture<TagSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ TagSelectorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TagSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
