import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { DefaultImgDirective } from '../../../../shared/directives';
import { PersonalAccountTagAggregation } from '../../models';

@Component({
	selector: 'app-personal-account-expenses-by-tag',
	standalone: true,
	imports: [CommonModule, MatButtonModule, MatIconModule, DefaultImgDirective, MatProgressBarModule],
	templateUrl: './personal-account-expenses-by-tag.component.html',
	styleUrls: ['./personal-account-expenses-by-tag.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => PersonalAccountExpensesByTagComponent),
			multi: true,
		},
	],
})
export class PersonalAccountExpensesByTagComponent implements ControlValueAccessor {
	@Input() aggregations: PersonalAccountTagAggregation[] | null = null;
	@Input() multiple = true;

	private selectedAggregationIds: string[] = [];

	onChange: (data: string[]) => void = () => {};
	onTouched = () => {};

	onClick(aggregations: PersonalAccountTagAggregation) {
		if (!this.multiple) {
			this.selectedAggregationIds = [aggregations.id];
			this.onChange(this.selectedAggregationIds);
			return;
		}

		const inArray = this.selectedAggregationIds.find((d) => d === aggregations.id);
		if (inArray) {
			this.selectedAggregationIds = this.selectedAggregationIds.filter((d) => d !== aggregations.id);
		} else {
			this.selectedAggregationIds = [...this.selectedAggregationIds, aggregations.id];
		}

		// notify parent
		this.onChange(this.selectedAggregationIds);
	}

	writeValue(ids: string[]): void {
		this.selectedAggregationIds = [...ids];
	}

	/**
	 * Register Component's ControlValueAccessor onChange callback
	 */
	registerOnChange(fn: PersonalAccountExpensesByTagComponent['onChange']): void {
		this.onChange = fn;
	}

	/**
	 * Register Component's ControlValueAccessor onTouched callback
	 */
	registerOnTouched(fn: PersonalAccountExpensesByTagComponent['onTouched']): void {
		this.onTouched = fn;
	}
}
