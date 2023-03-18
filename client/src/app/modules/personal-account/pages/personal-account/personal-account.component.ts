import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ACCOUNT_KEY, PersonalAccountOverviewFragment } from '../../../../core/graphql';

@Component({
	selector: 'app-welcome-personal-account',
	templateUrl: './personal-account.component.html',
	styleUrls: ['./personal-account.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonalAccountComponent implements OnInit {
	personalAccountBasic?: PersonalAccountOverviewFragment;

	constructor() {}

	ngOnInit(): void {
		this.personalAccountBasic = this.route.snapshot.data?.[ACCOUNT_KEY] as PersonalAccountOverviewFragment;
	}
}
