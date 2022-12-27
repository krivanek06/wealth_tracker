import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { UserFragment } from '../../../../../core/graphql';

@Component({
	selector: 'app-user-profile-info',
	templateUrl: './user-profile-info.component.html',
	styleUrls: ['./user-profile-info.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserProfileInfoComponent implements OnInit {
	@Input() authenticatedUser!: UserFragment;

	constructor() {}

	ngOnInit(): void {}
}
