import { Pipe, PipeTransform } from '@angular/core';
import { GeneralFunctionUtil } from '../utils';

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
		return GeneralFunctionUtil.formatLargeNumber(value, isPercent, showDollarSign);
	}
}
