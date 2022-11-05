import {
	AfterViewInit,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	ElementRef,
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

	buttonHeightPx = 40;

	constructor(private cd: ChangeDetectorRef) {}

	ngOnInit(): void {}

	ngAfterViewInit(): void {
		this.buttonHeightPx = this.element.nativeElement.offsetHeight - 15;
		this.cd.detectChanges();
	}

	onScollChange(change: 'increment' | 'decement'): void {
		const addValue = change === 'increment' ? 200 : -200;
		this.element.nativeElement.scrollLeft += addValue;
	}
}
