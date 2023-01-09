import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { PersonalAccountFacadeService } from '../../../../core/api';
import { AccountIdentification, PersonalAccountDetailsFragment } from '../../../../core/graphql';
import { PieChartComponent } from '../../../../shared/components';
import { GenericChartSeriesPie } from '../../../../shared/models';

@Component({
	selector: 'app-personal-account-mobile-view',
	templateUrl: './personal-account-mobile-view.component.html',
	styleUrls: ['./personal-account-mobile-view.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [CommonModule, PieChartComponent],
})
export class PersonalAccountMobileViewComponent implements OnInit {
	@Input() set accountIdentification(data: AccountIdentification | null) {
		this.personalAccountBasic = data;
		this.initData();
	}

	personalAccountDetails$!: Observable<PersonalAccountDetailsFragment | null>;
	expenseTags$!: Observable<GenericChartSeriesPie>;

	private personalAccountBasic: AccountIdentification | null = null;

	constructor(private personalAccountFacadeService: PersonalAccountFacadeService) {}

	ngOnInit(): void {}

	private initData(): void {}
}
