import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
	selector: 'app-action-buttons',
	templateUrl: './action-buttons.component.html',
	styleUrls: ['./action-buttons.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionButtonsComponent {
	@Output() transactionTypeChangeEmitter = new EventEmitter<void>();
	@Output() transactionShowChangeEmitter = new EventEmitter<void>();
	@Input() showHistoricalTransactions = false;
	@Input() isBuying = false;

	onTransactionTypeChange() {
		this.transactionTypeChangeEmitter.emit();
	}

	onTransactionShowChange() {
		this.transactionShowChangeEmitter.emit();
	}
}
