import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-welcome-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './welcome-about.component.html',
  styleUrls: ['./welcome-about.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WelcomeAboutComponent {

}
