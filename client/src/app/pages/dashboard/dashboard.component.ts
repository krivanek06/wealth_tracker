import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { PersonalAccountApiService } from './../../core/api/personal-account-api.service';
import { PersonalAccountOverviewBasicFragment } from './../../core/graphql/schema-backend.service';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
	personalAccountBasic$!: Observable<PersonalAccountOverviewBasicFragment[]>;
	constructor(private personalAccountApiService: PersonalAccountApiService) {}

	ngOnInit(): void {
		this.personalAccountBasic$ = this.personalAccountApiService.getPersonalAccounts();
	}
}
