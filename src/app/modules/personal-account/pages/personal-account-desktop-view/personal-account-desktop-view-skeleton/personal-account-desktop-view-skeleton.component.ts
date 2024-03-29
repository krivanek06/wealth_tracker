import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RangeDirective } from '../../../../../shared/directives';

@Component({
	selector: 'app-personal-account-desktop-view-skeleton',
	standalone: true,
	imports: [CommonModule, RangeDirective],
	template: `
		<div class="flex flex-col justify-between mb-8 gap-x-8 gap-y-8 lg:flex-row">
			<!-- account state -->
			<div class="grid grid-cols-2 gap-1 md:basis-3/4 md:grid-cols-4 md:gap-4 lg:gap-8">
				<div *ngRange="4" class="g-skeleton h-[96px]"></div>
			</div>

			<!-- manage tag button -->
			<div class="flex flex-col gap-4 max-lg:justify-center">
				<div class="w-full sm:w-10/12 max-lg:m-auto g-button-size-lg h-11 g-skeleton"></div>
			</div>
		</div>

		<!-- tag expense legend -->
		<div class="flex items-center mb-8 gap-x-4">
			<!-- left arrow -->
			<div class="w-[70px] h-[70px] g-skeleton"></div>

			<!-- body -->
			<div class="flex items-center overflow-clip gap-x-2">
				<div *ngRange="6" class="min-w-[200px] h-16 g-skeleton"></div>
			</div>

			<!-- right arrow -->
			<div class="w-[70px] h-[70px] g-skeleton"></div>
		</div>

		<!-- account charts -->
		<div class="grid gap-4 mb-8 2xl:grid-cols-2">
			<div class="h-[525px] w-full g-skeleton"></div>
			<div class="h-[525px] w-full g-skeleton"></div>
		</div>

		<!-- settings -->
		<div class="flex justify-between mb-12 md:px-8">
			<div class="flex gap-x-4">
				<!-- filter by date -->
				<div class="g-skeleton w-[350px] h-14"></div>

				<!-- button: current month -->
				<div class="g-skeleton w-[120px] h-11"></div>
			</div>

			<!-- button: add daily entry -->
			<div class="g-skeleton g-button-size-lg h-11"></div>
		</div>

		<div class="grid items-center grid-cols-1 gap-4 mb-8 lg:grid-cols-4 md:px-8">
			<!-- table body -->
			<div class="h-full lg:col-span-2">
				<div *ngRange="12" class="g-skeleton h-[52px] w-full mb-2"></div>
			</div>

			<!-- spending allocation by tags -->
			<div class="lg:col-span-2 md:-mt-16 h-[250px] w-full lg:w-10/12 g-skeleton lg:mx-auto">
				<div></div>
			</div>
		</div>

		<!-- displayed expense by tag -->
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			<div class="w-full g-skeleton h-[95px] md:h-[110px]" *ngRange="12"></div>
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
export class PersonalAccountDesktopViewSkeletonComponent {}
