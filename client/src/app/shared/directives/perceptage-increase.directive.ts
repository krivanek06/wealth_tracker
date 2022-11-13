import { Directive, Input, OnInit, Renderer2, ViewContainerRef } from '@angular/core';
import { GeneralFuntionUtl } from '../utils';

/**
 * Use this if you already have the prct diff & diff
 */
export type ChangeValues = {
	change: number;
	changesPercentage: number;
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
	@Input() changeValues?: ChangeValues;
	@Input() currentValues?: CurrentValues;
	@Input() useCurrencySign = false;

	/**
	 * If it should apply default flex classes
	 */
	@Input() addDefaultClasses = true;

	constructor(private rederer2: Renderer2, private vr: ViewContainerRef) {}

	ngOnInit(): void {
		if (this.changeValues) {
			const change = this.round2Dec(this.changeValues.change);
			const changesPercentage = this.round2Dec(this.changeValues.changesPercentage);
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
	private createElement(change: number, changesPercentage: number): void {
		// create elements
		const wrapper = this.vr.element.nativeElement;
		const changeSpan = this.rederer2.createElement('span');
		const sign = this.useCurrencySign ? '$' : '';
		const changeText = this.rederer2.createText(`(${sign} ${GeneralFuntionUtl.formatLargeNumber(change)})`);

		// percentage
		const changesPercentageSpan = this.rederer2.createElement('span');
		const changesPercentageText = this.rederer2.createText(`${String(changesPercentage)}%`);

		// mat-icon
		const matIcon = this.rederer2.createElement('mat-icon');
		const matIconText =
			change > 0 ? this.rederer2.createText('trending_up') : this.rederer2.createText('trending_down');

		// add scss classes
		const color = change > 0 ? 'g-color-success' : 'g-color-danger';
		if (this.addDefaultClasses) {
			this.rederer2.addClass(wrapper, 'flex');
			this.rederer2.addClass(wrapper, 'items-center');
			this.rederer2.addClass(wrapper, 'gap-1');
		}
		this.rederer2.addClass(changeSpan, 'text-gray-500');
		this.rederer2.addClass(changesPercentageSpan, color);
		this.rederer2.addClass(matIcon, color);

		// attach to each other
		this.rederer2.appendChild(changeSpan, changeText);
		this.rederer2.appendChild(changesPercentageSpan, changesPercentageText);

		// attach mat-icon
		this.rederer2.addClass(matIcon, 'mat-icon');
		this.rederer2.addClass(matIcon, 'material-icons');
		this.rederer2.appendChild(matIcon, matIconText);

		// shwow on DOM
		this.rederer2.appendChild(wrapper, changesPercentageSpan);
		this.rederer2.appendChild(wrapper, matIcon);
		this.rederer2.appendChild(wrapper, changeSpan);
	}

	private round2Dec(value: number): number {
		return Math.round(value * 100) / 100;
	}
}
