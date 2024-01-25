import {
	AfterViewInit,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	ElementRef,
	Input,
	OnInit,
	ViewChild,
} from '@angular/core';

@Component({
	selector: 'app-scroll-wrapper',
	template: `
		<div
			class="flex items-center gap-3 m-auto"
			[ngClass]="{ 'flex-col': !isFlexRow }"
			[style.max-height.px]="flexColHeightPx"
		>
			<!-- left / top arrow -->
			<button
				mat-stroked-button
				[disabled]="isLeftScrollDisabled"
				(click)="onScollChange('decement')"
				[style.height.px]="isFlexRow ? buttonHeightPx : buttonHeightPx - 30"
				[ngClass]="{
					'w-full': !isFlexRow,
					'min-w-0 w-[75px]': isFlexRow
				}"
			>
				<mat-icon *ngIf="isFlexRow">arrow_back_ios</mat-icon>
				<mat-icon *ngIf="!isFlexRow">keyboard_arrow_up</mat-icon>
			</button>

			<!-- content projection -->
			<div #contentWrapper class="c-content-wrapper" [ngClass]="{ 'flex-col': !isFlexRow }">
				<ng-content></ng-content>
			</div>

			<!-- right / bottom arrow -->
			<button
				[disabled]="isRightScrollDisabled"
				mat-stroked-button
				(click)="onScollChange('increment')"
				[style.height.px]="isFlexRow ? buttonHeightPx : buttonHeightPx - 30"
				[ngClass]="{
					'w-full': !isFlexRow,
					'min-w-0 w-[75px]': isFlexRow
				}"
			>
				<mat-icon *ngIf="isFlexRow">arrow_forward_ios</mat-icon>
				<mat-icon *ngIf="!isFlexRow">keyboard_arrow_down</mat-icon>
			</button>
		</div>
	`,
	styles: `
  :host {
	display: block;

	button {
		@apply w-4 hidden sm:block;
		border: 1px solid #9292926e !important;
	}

	.c-content-wrapper {
		overflow-x: scroll;
		overflow-y: hidden;
		white-space: nowrap;
		display: flex;
		width: 100%;
		scroll-behavior: smooth;
		gap: 8px;

		-ms-overflow-style: none; /* Internet Explorer 10+ */
		scrollbar-width: none; /* Firefox */

		&::-webkit-scrollbar {
			display: none; /* Safari and Chrome */
		}
	}
}
`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScrollWrapperComponent implements OnInit, AfterViewInit {
	@ViewChild('contentWrapper') element!: ElementRef;
	@Input() isFlexRow = true;
	@Input() flexColHeightPx: number = 300;

	buttonHeightPx = 70;

	isLeftScrollDisabled = true;
	isRightScrollDisabled = false;

	constructor(private cd: ChangeDetectorRef) {}

	ngOnInit(): void {}

	ngAfterViewInit(): void {
		this.cd.detectChanges();
	}

	onScollChange(change: 'increment' | 'decement'): void {
		const addValue = change === 'increment' ? 200 : -200;
		if (this.isFlexRow) {
			const newValue = this.element.nativeElement.scrollLeft + addValue;

			// increase scroll
			this.element.nativeElement.scrollLeft += addValue;

			// disable buttons if needed
			const maxScrollLeft = this.element.nativeElement.scrollWidth - this.element.nativeElement.clientWidth - 5;
			this.isLeftScrollDisabled = newValue === 0;
			this.isRightScrollDisabled = newValue >= maxScrollLeft;
		} else {
			const newValue = this.element.nativeElement.scrollTop + addValue;

			// increase scroll
			this.element.nativeElement.scrollTop += addValue;

			// disable buttons if needed
			const maxScrollLeft = this.element.nativeElement.scrollWidth - this.element.nativeElement.clientWidth - 5;
			this.isLeftScrollDisabled = newValue <= 0;
			this.isRightScrollDisabled = newValue >= maxScrollLeft;
		}
	}
}
