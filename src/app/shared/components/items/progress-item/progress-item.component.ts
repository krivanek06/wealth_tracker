import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

export enum BUDGET_VALUE_FILL_COLORS_KEYS {
	VERY_LOW_VALUE = '#008f88',
	LOW_VALUE = '#199419',
	MEDIUM = '#7c691e',
	HIGH = '#a17a2a',
	VERY_HIGH = '#b13929',
	TOO_MUCH = '#b01a06',
}

@Component({
	selector: 'app-progress-item',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './progress-item.component.html',
	styleUrls: ['./progress-item.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressItemComponent implements OnInit {
	@Input() currentValue!: number;
	@Input() totalThresholdValue!: number;

	variableColor!: string;

	ngOnInit(): void {
		this.variableColor = this.resolveBudgetClass();
	}

	private resolveBudgetClass() {
		const filledPrct = this.currentValue / this.totalThresholdValue;

		if (filledPrct <= 0.15) {
			return BUDGET_VALUE_FILL_COLORS_KEYS.VERY_LOW_VALUE;
		}
		if (filledPrct <= 0.3) {
			return BUDGET_VALUE_FILL_COLORS_KEYS.LOW_VALUE;
		}
		if (filledPrct <= 0.45) {
			return BUDGET_VALUE_FILL_COLORS_KEYS.MEDIUM;
		}
		if (filledPrct <= 0.65) {
			return BUDGET_VALUE_FILL_COLORS_KEYS.HIGH;
		}
		if (filledPrct <= 0.85) {
			return BUDGET_VALUE_FILL_COLORS_KEYS.VERY_HIGH;
		}
		return BUDGET_VALUE_FILL_COLORS_KEYS.TOO_MUCH;
	}
}
