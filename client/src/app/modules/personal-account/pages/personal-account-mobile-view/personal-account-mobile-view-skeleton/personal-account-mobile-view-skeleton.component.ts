import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { RangeDirective } from '../../../../../shared/directives';

@Component({
	selector: 'app-personal-account-mobile-view-skeleton',
	standalone: true,
	imports: [CommonModule, RangeDirective, MatDividerModule],
	template: `
		<!-- account state -->
		<div class="grid grid-cols-2 mb-10 gap-y-1 gap-x-2">
			<div *ngRange="4" class="g-skeleton h-[96px]"></div>
		</div>

		<!-- expense chart -->
		<div class="g-skeleton h-[328px] w-full mb-6"></div>

		<!-- settings button -->
		<div class="g-skeleton h-11 w-[120px] mb-4"></div>

		<!-- divider -->
		<div class="my-4">
			<mat-divider></mat-divider>
		</div>

		<!-- add daily entry button -->
		<div class="w-full mb-4 g-skeleton h-11"></div>

		<!-- divider -->
		<div class="my-4">
			<mat-divider></mat-divider>
		</div>

		<!-- date filter control -->
		<div class="w-full mb-8 g-skeleton h-14"></div>

		<!-- aggregation text and button -->
		<div class="flex justify-end mb-6">
			<div class="w-[200px] h-11 g-skeleton"></div>
		</div>

		<!-- tag aggregation -->
		<div class="grid gap-4">
			<div *ngRange="8" class="h-[95px] w-full g-skeleton"></div>
		</div>
	`,
	styles: [
		`
			:host {
				display: block;
			}
		`,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonalAccountMobileViewSkeletonComponent {}
