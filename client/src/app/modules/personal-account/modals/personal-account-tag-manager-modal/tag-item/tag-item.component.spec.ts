import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TagItemComponent } from './tag-item.component';

describe('TagItemComponent', () => {
  let component: TagItemComponent;
  let fixture: ComponentFixture<TagItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ TagItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TagItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
