import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { AccountIdentification } from '../../../../core/graphql';

@Component({
	selector: 'app-personal-account',
	templateUrl: './personal-account.component.html',
	styleUrls: ['./personal-account.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonalAccountComponent implements OnInit {
	@Input() personalAccountBasic!: AccountIdentification;

	constructor() {}

	ngOnInit(): void {}
}
