import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ValuePresentationCardComponent } from '../../../../shared/components';
import { AccountState } from '../../models';

@Component({
	selector: 'app-personal-account-account-state',
	standalone: true,
	imports: [CommonModule, ValuePresentationCardComponent],
	templateUrl: './personal-account-account-state.component.html',
	styleUrls: ['./personal-account-account-state.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonalAccountAccountStateComponent {
	@Input() accountState!: AccountState;
}
