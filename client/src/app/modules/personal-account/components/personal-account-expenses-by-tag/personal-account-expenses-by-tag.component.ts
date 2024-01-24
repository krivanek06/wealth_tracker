import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ProgressItemComponent } from '../../../../shared/components';
import { DefaultImgDirective, RangeDirective } from '../../../../shared/directives';
import { InArrayPipe } from '../../../../shared/pipes';
import { PersonalAccountTagAggregation } from '../../models';

@Component({
	selector: 'app-personal-account-expenses-by-tag',
	standalone: true,
	imports: [
		CommonModule,
		MatButtonModule,
		MatIconModule,
		DefaultImgDirective,
		ProgressItemComponent,
		InArrayPipe,
		RangeDirective,
		MatTooltipModule,
	],
	template: `
		<!-- income -->
		<div *ngIf="incomes && incomes.length > 0" class="mb-4">
			<h2 class="text-wt-success-medium">Income</h2>
			<ng-container
				[ngTemplateOutlet]="aggregationBody"
				[ngTemplateOutletContext]="{ aggregations: incomes }"
			></ng-container>
		</div>

		<!-- expense -->
		<h2 *ngIf="incomes && incomes.length > 0" class="text-wt-danger-medium">Expense</h2>
		<ng-container
			[ngTemplateOutlet]="aggregationBody"
			[ngTemplateOutletContext]="{ aggregations: expenses }"
		></ng-container>

		<ng-template #aggregationBody let-aggregations="aggregations">
			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
				<button
					*ngFor="let aggregation of aggregations"
					mat-button
					(click)="onClick(aggregation)"
					[disableRipple]="disabledClick"
					[ngClass]="{
						'cursor-default': disabledClick,
						'c-selected-button': selectedAggregationIds | inArray: aggregation.id,
						'bg-wt-background-dark': !(selectedAggregationIds | inArray: aggregation.id)
					}"
					class="w-full max-sm:p-0 shadow-lg md:py-4 h-[95px] md:h-[110px] overflow-hidden"
				>
					<div class="flex items-center gap-2 -ml-1">
						<!-- tag image -->
						<div
							class="p-2 rounded-l-xl w-14 md:w-16 h-[95px] md:h-[110px] grid min-w-[60px]"
							style="background-color: {{ aggregation.color }};"
						>
							<img appDefaultImg [src]="aggregation.imageUrl" imageType="tagName" alt="tag image" class="m-auto h-9" />
						</div>

						<div class="flex flex-col flex-1">
							<!-- body -->
							<ng-container [ngTemplateOutlet]="buttonBody" [ngTemplateOutletContext]="{ aggregation: aggregation }">
							</ng-container>

							<!-- progress bar -->
							<div *ngIf="!aggregation.isWeeklyView && !hideBudgeting" class="-mt-1">
								<app-progress-item
									[currentValue]="aggregation.budgetToTimePeriod ? aggregation.totalValue : 0"
									[totalThresholdValue]="aggregation.budgetToTimePeriod ?? 0"
								></app-progress-item>
							</div>
						</div>
					</div>
				</button>
			</div>
		</ng-template>

		<!-- button body -->
		<ng-template #buttonBody let-aggregation="aggregation">
			<div
				class="flex justify-between flex-1 px-4 pb-4 pl-1"
				[ngClass]="{ 'items-start': !!aggregation.lastDataEntryDate, 'items-center': !aggregation.lastDataEntryDate }"
			>
				<!-- tag name & entries -->
				<div class="text-start">
					<div
						class="space-x-1"
						[ngClass]="{
							'text-base': !!aggregation.lastDataEntryDate && !hideBudgeting,
							'text-lg': !aggregation.lastDataEntryDate || hideBudgeting
						}"
					>
						<span style="color: {{ aggregation.color }}" class="text-lg">{{ aggregation.name }}</span>
					</div>
					<span class="text-base text-wt-gray-medium">Entries: {{ aggregation.totalEntries }} </span>
				</div>

				<div
					class="text-end min-w-[100px]"
					[ngClass]="{ 'mt-3': !aggregation.budgetToTimePeriod || hideBudgeting || aggregation.isWeeklyView }"
				>
					<!-- total spending and budget -->
					<div class="flex flex-col">
						<span class="text-xl text-white"> {{ aggregation.totalValue | currency }} </span>
						<div
							*ngIf="aggregation.budgetToTimePeriod && !aggregation.isWeeklyView && !hideBudgeting"
							class="flex items-center gap-1 text-wt-gray-medium"
						>
							<span>({{ aggregation.totalValue / aggregation.budgetToTimePeriod | percent }})</span>
							<span>/</span>
							<span> {{ aggregation.budgetToTimePeriod | currency }} </span>
						</div>
					</div>
				</div>
			</div>
		</ng-template>
	`,
	styles: [
		`
			:host {
				display: block;

				.c-selected-button {
					@apply bg-wt-background-light;
					border: 2px solid black;
				}
			}
		`,
	],
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
	@Input() expenses!: PersonalAccountTagAggregation[];
	@Input() incomes?: PersonalAccountTagAggregation[] | null = null;

	/**
	 * @description if true, then user can select multiple tags
	 */
	@Input() multiple = true;

	/**
	 * @description if true, then user can't click on tag
	 */
	@Input() disabledClick = false;

	/**
	 * @description if true, budgeting won't be displayed
	 */
	@Input() hideBudgeting = false;

	selectedAggregationIds: string[] = [];

	onChange: (data: string[]) => void = () => {};
	onTouched = () => {};

	onClick(aggregations: PersonalAccountTagAggregation) {
		if (this.disabledClick) {
			return;
		}

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
