import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { AccountIdentification } from '../../../core/graphql';

@Component({
	selector: 'app-dashboard-navigation',
	templateUrl: './dashboard-navigation.component.html',
	styleUrls: ['./dashboard-navigation.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardNavigationComponent implements OnInit {
	@Input() availableAccounts!: AccountIdentification[];

	constructor() {}

	ngOnInit(): void {}
}
