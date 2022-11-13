import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'largeNumberFormatter',
	standalone: true,
})
export class LargeNumberFormatterPipe implements PipeTransform {
	transform(
		value?: string | number | null | unknown,
		isPercent: boolean = false,
		showDollarSign: boolean = false
	): unknown {
		return this.stFormatLargeNumber(value, isPercent, showDollarSign);
	}

	private stIsNumber = (value: string | number | unknown): boolean => {
		return value != null && value !== '' && typeof value === 'number' && !isNaN(Number(value.toString()));
	};

	private stFormatLargeNumber = (
		value?: string | number | null | unknown,
		isPercent: boolean = false,
		showDollarSign: boolean = false
	) => {
		if (!value || (!this.stIsNumber(value) && typeof value !== 'number')) {
			return 'N/A';
		}

		let castedValue = Number(value);

		if (isPercent) {
			const rounded = Math.round(castedValue * 100 * 100) / 100;
			return `${rounded}%`;
		}

		let symbol = '';
		if (Math.abs(castedValue) >= 1000) {
			castedValue = castedValue / 1000;
			symbol = 'K';
		}

		if (Math.abs(castedValue) >= 1000) {
			castedValue = castedValue / 1000;
			symbol = 'M';
		}

		if (Math.abs(castedValue) >= 1000) {
			castedValue = castedValue / 1000;
			symbol = 'B';
		}

		if (Math.abs(castedValue) >= 1000) {
			castedValue = castedValue / 1000;
			symbol = 'T';
		}
		let result = castedValue.toFixed(2) + symbol;

		if (showDollarSign) {
			result = `$${result}`;
		}
		return result;
	};
}
