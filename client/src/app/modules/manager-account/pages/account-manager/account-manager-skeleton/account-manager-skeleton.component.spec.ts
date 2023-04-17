import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountManagerSkeletonComponent } from './account-manager-skeleton.component';

describe('AccountManagerSkeletonComponent', () => {
  let component: AccountManagerSkeletonComponent;
  let fixture: ComponentFixture<AccountManagerSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ AccountManagerSkeletonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountManagerSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
