import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AccountManagerApiService } from '../../core/api';
import { AccountIdentificationFragment } from '../../core/graphql';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
	availableAccounts$!: Observable<AccountIdentificationFragment[]>;

	constructor(private managerAccountApiService: AccountManagerApiService) {}

	ngOnInit(): void {
		this.availableAccounts$ = this.managerAccountApiService.getAvailableAccounts();
	}
}
