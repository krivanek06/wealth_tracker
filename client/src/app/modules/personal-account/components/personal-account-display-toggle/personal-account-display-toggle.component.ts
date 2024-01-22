import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { DefaultImgDirective } from '../../../../shared/directives';
import { PersonalAccountTag } from './../../../../core/api';

@Component({
	selector: 'app-personal-account-display-toggle',
	standalone: true,
	imports: [CommonModule, MatButtonModule, DefaultImgDirective],
	template: `
		<!-- aggregation & history button -->
		<button
			*ngIf="!selectedTag"
			class="min-w-[200px]"
			mat-stroked-button
			[color]="showHistoryFormControl ? 'warn' : 'primary'"
			(click)="onDisplayClick()"
		>
			{{ showHistoryFormControl ? 'History' : 'Aggregation' }}
		</button>

		<!-- selected tag button -->
		<button
			*ngIf="selectedTag"
			class="min-w-[200px]"
			style="border-color: {{ selectedTag.color }} !important"
			mat-stroked-button
			(click)="onDisplayClick()"
		>
			<div class="flex items-center gap-4 text-xl">
				<img appDefaultImg [src]="selectedTag.image" imageType="tagName" class="h-7 w-7" />
				<span style="color: {{ selectedTag.color }}"> {{ selectedTag.name }} </span>
			</div>
		</button>
	`,
	styles: [
		`
			:host {
				display: block;
			}
		`,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => PersonalAccountDisplayToggleComponent),
			multi: true,
		},
	],
})
export class PersonalAccountDisplayToggleComponent implements ControlValueAccessor {
	@Input() selectedTag?: PersonalAccountTag | null;

	showHistoryFormControl = false;

	onChange: (data: boolean) => void = () => {};
	onTouched = () => {};

	constructor() {}

	onDisplayClick() {
		this.showHistoryFormControl = !this.showHistoryFormControl;
		this.onChange(this.showHistoryFormControl);
	}

	writeValue(value: boolean): void {
		this.showHistoryFormControl = value;
	}
	/**
	 * Register Component's ControlValueAccessor onChange callback
	 */
	registerOnChange(fn: PersonalAccountDisplayToggleComponent['onChange']): void {
		this.onChange = fn;
	}

	/**
	 * Register Component's ControlValueAccessor onTouched callback
	 */
	registerOnTouched(fn: PersonalAccountDisplayToggleComponent['onTouched']): void {
		this.onTouched = fn;
	}
}
