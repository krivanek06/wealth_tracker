import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ActionButtonPressEnum } from '../account-holding-modal.model';

@Component({
	selector: 'app-record-state',
	templateUrl: './record-state.component.html',
	styleUrls: ['./record-state.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecordStateComponent {
	@Output() actionButtonPressEmitter = new EventEmitter<ActionButtonPressEnum>();
	@Input() isBuying = false;
	@Input() ownedUnits?: number;
	@Input() ownedUnitsShow = true;
	@Input() units?: number;
	@Input() price?: number;
	@Input() value?: number;
	@Input() allowCustomization = false;
	@Input() totalValue?: number | string | null;

	ActionButtonPressEnum = ActionButtonPressEnum;

	onActionButtonPress(type: ActionButtonPressEnum) {
		this.actionButtonPressEmitter.emit(type);
	}
}
