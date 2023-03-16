import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WelcomePersonalAccountComponent } from './welcome-personal-account.component';

describe('WelcomePersonalAccountComponent', () => {
  let component: WelcomePersonalAccountComponent;
  let fixture: ComponentFixture<WelcomePersonalAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ WelcomePersonalAccountComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WelcomePersonalAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
