import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WelcomeHeroComponent } from './welcome-hero.component';

describe('WelcomeHeroComponent', () => {
  let component: WelcomeHeroComponent;
  let fixture: ComponentFixture<WelcomeHeroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ WelcomeHeroComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WelcomeHeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
