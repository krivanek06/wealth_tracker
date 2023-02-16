import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ACCOUNT_KEY, PersonalAccountOverviewFragment } from '../../../../core/graphql';

@Component({
	selector: 'app-personal-account',
	templateUrl: './personal-account.component.html',
	styleUrls: ['./personal-account.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonalAccountComponent implements OnInit {
	personalAccountBasic?: PersonalAccountOverviewFragment;

	constructor(private route: ActivatedRoute) {}

	ngOnInit(): void {
		this.personalAccountBasic = this.route.snapshot.data?.[ACCOUNT_KEY] as PersonalAccountOverviewFragment;
	}
}
