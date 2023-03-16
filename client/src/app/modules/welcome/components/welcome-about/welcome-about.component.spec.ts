import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WelcomeAboutComponent } from './welcome-about.component';

describe('WelcomeAboutComponent', () => {
  let component: WelcomeAboutComponent;
  let fixture: ComponentFixture<WelcomeAboutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ WelcomeAboutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WelcomeAboutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
