import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { WELCOME_INVESTMENT_1, WELCOME_INVESTMENT_2, WELCOME_INVESTMENT_3 } from '../../models/links.model';

@Component({
	selector: 'app-welcome-investment-account',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './welcome-investment-account.component.html',
	styleUrls: ['./welcome-investment-account.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WelcomeInvestmentAccountComponent {
	WELCOME_INVESTMENT_1 = WELCOME_INVESTMENT_1;
	WELCOME_INVESTMENT_2 = WELCOME_INVESTMENT_2;
	WELCOME_INVESTMENT_3 = WELCOME_INVESTMENT_3;
}
