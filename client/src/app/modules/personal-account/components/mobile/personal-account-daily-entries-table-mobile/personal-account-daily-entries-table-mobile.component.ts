import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { PersonalAccountDailyData, PersonalAccountDailyDataAggregation } from './../../../../../core/api';
import { DefaultImgDirective } from './../../../../../shared/directives';

@Component({
	selector: 'app-personal-account-daily-entries-table-mobile',
	standalone: true,
	imports: [CommonModule, ScrollingModule, MatListModule, MatDividerModule, DefaultImgDirective],
	template: `
		<mat-list>
			<ng-container *ngFor="let item of personalAccountDailyData; let last = last">
				<div mat-subheader>{{ item.date | date: 'EEEE, MMM. d.' }}</div>
				<mat-selection-list [multiple]="false" [hideSingleSelectionIndicator]="true">
					<mat-list-option
						*ngFor="let data of item.data"
						class="min-h-[45px] h-auto mb-2"
						(selectedChange)="onEditDailyEntryClick(data)"
					>
						<div class="flex items-start justify-between">
							<div class="flex items-start gap-x-5">
								<!-- tag svg -->
								<!--
              		style="border-color: {{data.tag.color}}"
							  class="px-2 rounded-md border-x-4 h-7"
             -->
								<img class="h-8 -mt-1" appDefaultImg imageType="tagName" [src]="data.tag.image" />

								<!-- tag data -->
								<div class="flex flex-col">
									<span
										class="pr-2 border-b-2 border-solid text-wt-gray-light"
										style="border-color: {{ data.tag.color }}"
									>
										<span style="color: {{ data.tag.color }}">●</span>
										{{ data.tag.name }}
									</span>
								</div>
							</div>

							<div
								[ngClass]="{
									'text-wt-danger-medium': data.tag.type === 'EXPENSE',
									'text-wt-success-medium': data.tag.type === 'INCOME'
								}"
							>
								{{ data.value | currency }}
							</div>
						</div>
					</mat-list-option>
				</mat-selection-list>

				<div *ngIf="!last" class="my-3">
					<mat-divider></mat-divider>
				</div>
			</ng-container>
		</mat-list>
	`,
	styles: [
		`
			:host {
				display: block;
			}
			.c-viewport {
				height: 500px;
				width: 100%;
				border: 1px solid red;
			}

			.c-item {
				height: 52px;
			}
		`,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonalAccountDailyEntriesTableMobileComponent {
	@Output() editDailyEntryClickEmitter = new EventEmitter<PersonalAccountDailyData>();
	@Input() personalAccountDailyData?: PersonalAccountDailyDataAggregation[] | null;

	onEditDailyEntryClick(data: PersonalAccountDailyData): void {
		this.editDailyEntryClickEmitter.emit(data);
	}
}
