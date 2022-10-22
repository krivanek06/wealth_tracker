import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { PersonalAccountApiService } from './../../../../core/api';
import { PersonalAccountOverviewFragment } from './../../../../core/graphql';

@Component({
	selector: 'app-personal-account',
	templateUrl: './personal-account.component.html',
	styleUrls: ['./personal-account.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonalAccountComponent implements OnInit {
	@Input() personalAccount!: PersonalAccountOverviewFragment;

	constructor(private personalAccountApiService: PersonalAccountApiService) {}

	ngOnInit(): void {}
}
