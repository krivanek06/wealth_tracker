import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { PersonalAccountApiService } from './../../core/api/personal-account-api.service';
import { PersonalAccountOverviewFragment } from './../../core/graphql/schema-backend.service';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
	personalAccounts$!: Observable<PersonalAccountOverviewFragment[]>;
	constructor(private personalAccountApiService: PersonalAccountApiService) {}

	ngOnInit(): void {
		this.personalAccounts$ = this.personalAccountApiService.getPersonalAccounts();
	}
}
