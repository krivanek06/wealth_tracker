import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerAccountListAccountsComponent } from './manager-account-list-accounts.component';

describe('ManagerAccountListAccountsComponent', () => {
  let component: ManagerAccountListAccountsComponent;
  let fixture: ComponentFixture<ManagerAccountListAccountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManagerAccountListAccountsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagerAccountListAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
