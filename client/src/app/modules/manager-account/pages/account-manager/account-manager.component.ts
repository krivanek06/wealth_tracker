import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'app-account-manager',
	templateUrl: './account-manager.component.html',
	styleUrls: ['./account-manager.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountManagerComponent {}
