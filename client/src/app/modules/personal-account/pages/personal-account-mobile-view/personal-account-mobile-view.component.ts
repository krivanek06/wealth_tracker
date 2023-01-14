import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormMatInputWrapperModule, GenericChartModule } from '../../../../shared/components';
import { PersonalAccountParent } from '../../classes';

@Component({
	selector: 'app-personal-account-mobile-view',
	templateUrl: './personal-account-mobile-view.component.html',
	styleUrls: ['./personal-account-mobile-view.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [CommonModule, FormMatInputWrapperModule, ReactiveFormsModule, GenericChartModule],
})
export class PersonalAccountMobileViewComponent extends PersonalAccountParent implements OnInit {
	constructor() {
		super();
	}

	ngOnInit(): void {}
}
