import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TagImageSelectorComponent } from './tag-image-selector.component';

describe('TagImageSelectorComponent', () => {
  let component: TagImageSelectorComponent;
  let fixture: ComponentFixture<TagImageSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ TagImageSelectorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TagImageSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
