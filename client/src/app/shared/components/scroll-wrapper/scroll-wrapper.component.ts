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
	templateUrl: './scroll-wrapper.component.html',
	styleUrls: ['./scroll-wrapper.component.scss'],
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
