import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { WELCOME_PERSONAL_1, WELCOME_PERSONAL_2, WELCOME_PERSONAL_3 } from '../../models/links.model';

@Component({
	selector: 'app-welcome-personal-account',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './welcome-personal-account.component.html',
	styleUrls: ['./welcome-personal-account.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WelcomePersonalAccountComponent {
	WELCOME_PERSONAL_1 = WELCOME_PERSONAL_1;
	WELCOME_PERSONAL_2 = WELCOME_PERSONAL_2;
	WELCOME_PERSONAL_3 = WELCOME_PERSONAL_3;
}
