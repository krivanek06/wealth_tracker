import { Directive, Input, OnInit, Renderer2, ViewContainerRef } from '@angular/core';
import { GeneralFuntionUtl } from '../utils';

/**
 * Use this if you already have the prct diff & diff
 */
export type ChangeValues = {
	change?: number;
	changesPercentage?: number;
};

/**
 * Use this if you only have values and you want to calculate the prct diff & diff
 */
export type CurrentValues = {
	value: number;
	valueToCompare: number;
};

@Directive({
	selector: '[appPerceptageIncrease]',
	standalone: true,
})
export class PerceptageIncreaseDirective implements OnInit {
	/**
	 * choose to populate data for changeValues or currentValues
	 */
	@Input() changeValues?: ChangeValues;
	@Input() currentValues?: CurrentValues;
	@Input() useCurrencySign = false;

	@Input() flexStyle: 'row' | 'col' = 'row';

	@Input() changesPercentageSpanClasses: string[] = [];
	@Input() changesSpanClasses: string[] = [];

	constructor(private rederer2: Renderer2, private vr: ViewContainerRef) {}

	ngOnInit(): void {
		if (this.changeValues) {
			const change = this.changeValues.change ? this.round2Dec(this.changeValues.change) : null;
			const changesPercentage = this.changeValues.changesPercentage
				? this.round2Dec(this.changeValues.changesPercentage)
				: null;
			this.createElement(change, changesPercentage);
			return;
		}

		if (this.currentValues) {
			const value = this.currentValues.value - this.currentValues.valueToCompare;
			const change = this.round2Dec(value);
			const changesPercentage = this.round2Dec((value / this.currentValues.valueToCompare) * 100);
			this.createElement(change, changesPercentage);
			return;
		}

		throw new Error('[PerceptageIncreaseDirective]: define changeValues or currentValues');
	}

	/**
	 * Creates element to the UI
	 *
	 * @param change - changed value between the current and compared to item
	 * @param changesPercentage - changed prct between the current and compared to item
	 */
	private createElement(change: number | null, changesPercentage: number | null): void {
		if (!changesPercentage && !change) {
			return;
		}

		// color to use
		const color =
			(!!change && change > 0) || (!!changesPercentage && changesPercentage > 0) ? 'g-color-success' : 'g-color-danger';

		// create elements
		const wrapper = this.vr.element.nativeElement;

		// add scss classes
		this.rederer2.addClass(wrapper, 'flex');
		if (this.flexStyle === 'row') {
			this.rederer2.addClass(wrapper, 'items-center');
			this.rederer2.addClass(wrapper, 'gap-x-1');
		} else {
			this.rederer2.addClass(wrapper, 'flex-col');
			this.rederer2.addClass(wrapper, 'items-start');
		}

		// display percentage
		if (changesPercentage) {
			// wrapper for value and icon
			const valueChangeAndIconWrapper = this.rederer2.createElement('div');

			// percentage
			const changesPercentageSpan = this.rederer2.createElement('span');
			const changesPercentageText = this.rederer2.createText(`${String(changesPercentage)}%`);

			// mat-icon
			const matIcon = this.rederer2.createElement('mat-icon');
			const matIconText =
				changesPercentage > 0 ? this.rederer2.createText('trending_up') : this.rederer2.createText('trending_down');

			// have value and icon in one div for 'col' styling
			this.rederer2.addClass(valueChangeAndIconWrapper, 'flex');
			this.rederer2.addClass(valueChangeAndIconWrapper, 'items-center');
			this.rederer2.addClass(valueChangeAndIconWrapper, 'gap-1');
			this.rederer2.addClass(matIcon, color);

			// classes mat-icon
			this.rederer2.addClass(matIcon, 'mat-icon');
			this.rederer2.addClass(matIcon, 'material-icons');

			// colors
			this.rederer2.addClass(changesPercentageSpan, color);

			// additional classes
			this.changesPercentageSpanClasses.forEach((c) => this.rederer2.addClass(changesPercentageSpan, c));

			// attach to each other
			this.rederer2.appendChild(matIcon, matIconText);
			this.rederer2.appendChild(changesPercentageSpan, changesPercentageText);
			this.rederer2.appendChild(valueChangeAndIconWrapper, changesPercentageSpan);
			this.rederer2.appendChild(valueChangeAndIconWrapper, matIcon);
			this.rederer2.appendChild(wrapper, valueChangeAndIconWrapper);
		}

		// display value
		if (change) {
			const sign = this.useCurrencySign ? '$' : '';

			const changeSpan = this.rederer2.createElement('span');
			const text = `${sign} ${GeneralFuntionUtl.formatLargeNumber(change)}`;
			const changeText = !!changesPercentage ? this.rederer2.createText(`(${text})`) : this.rederer2.createText(text);

			// changesPercentage does not exist -> changeSpan will be color
			this.rederer2.addClass(changeSpan, color);

			// additional classes
			this.changesSpanClasses.forEach((c) => this.rederer2.addClass(changeSpan, c));

			// shwow on DOM
			this.rederer2.appendChild(changeSpan, changeText);

			this.rederer2.appendChild(wrapper, changeSpan);
		}
	}

	private round2Dec(value: number): number {
		return Math.round(value * 100) / 100;
	}
}
