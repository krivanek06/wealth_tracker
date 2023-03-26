import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountManagerItemComponent } from './account-manager-item.component';

describe('AccountManagerItemComponent', () => {
  let component: AccountManagerItemComponent;
  let fixture: ComponentFixture<AccountManagerItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ AccountManagerItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountManagerItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
