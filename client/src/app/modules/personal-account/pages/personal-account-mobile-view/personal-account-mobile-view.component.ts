import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { FormMatInputWrapperModule, PieChartComponent } from '../../../../shared/components';
import { GenericChartSeriesPie } from '../../../../shared/models';
import { PersonalAccountParent } from '../../classes';

@Component({
	selector: 'app-personal-account-mobile-view',
	templateUrl: './personal-account-mobile-view.component.html',
	styleUrls: ['./personal-account-mobile-view.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [CommonModule, PieChartComponent, FormMatInputWrapperModule, ReactiveFormsModule],
})
export class PersonalAccountMobileViewComponent extends PersonalAccountParent implements OnInit {
	expenseTags$!: Observable<GenericChartSeriesPie>;

	constructor() {
		super();
	}

	ngOnInit(): void {
		this.filterForm.valueChanges.subscribe(console.log);
		this.filterDateInputSourceWrapper$.subscribe(console.log);
	}
}
