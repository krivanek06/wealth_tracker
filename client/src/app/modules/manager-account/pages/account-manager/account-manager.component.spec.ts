import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountManagerComponent } from './account-manager.component';

describe('AccountManagerComponent', () => {
  let component: AccountManagerComponent;
  let fixture: ComponentFixture<AccountManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ AccountManagerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
