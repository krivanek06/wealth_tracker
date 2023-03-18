import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'app-welcome-personal-account',
	templateUrl: './personal-account.component.html',
	styleUrls: ['./personal-account.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonalAccountComponent {}
