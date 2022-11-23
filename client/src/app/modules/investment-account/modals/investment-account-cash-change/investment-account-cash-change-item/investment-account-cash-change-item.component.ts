import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { InvestmentAccountCashChangeFragment, InvestmentAccountCashChangeType } from '../../../../../core/graphql';
import { customMemoize } from '../../../../../shared/decoratos';

@Component({
	selector: 'app-investment-account-cash-change-item',
	templateUrl: './investment-account-cash-change-item.component.html',
	styleUrls: ['./investment-account-cash-change-item.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvestmentAccountCashChangeItemComponent implements OnInit {
	@Output() deleteEmitter = new EventEmitter<InvestmentAccountCashChangeFragment>();

	@Input() cashChange!: InvestmentAccountCashChangeFragment;

	InvestmentAccountCashChangeType = InvestmentAccountCashChangeType;

	constructor() {}

	ngOnInit(): void {}

	@customMemoize()
	getNameFromType(type: InvestmentAccountCashChangeType): string {
		if (type === InvestmentAccountCashChangeType.AssetOperation) {
			return 'Asset';
		}
		return type.toLowerCase();
	}

	onDelete(): void {
		this.deleteEmitter.emit(this.cashChange);
	}
}
