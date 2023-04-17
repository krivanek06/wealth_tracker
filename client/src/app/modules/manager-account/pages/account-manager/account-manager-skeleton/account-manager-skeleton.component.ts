import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'app-account-manager-skeleton',
	templateUrl: './account-manager-skeleton.component.html',
	styleUrls: ['./account-manager-skeleton.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountManagerSkeletonComponent {}
