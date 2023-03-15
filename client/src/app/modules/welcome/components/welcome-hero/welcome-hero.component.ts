import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-welcome-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './welcome-hero.component.html',
  styleUrls: ['./welcome-hero.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WelcomeHeroComponent {

}
