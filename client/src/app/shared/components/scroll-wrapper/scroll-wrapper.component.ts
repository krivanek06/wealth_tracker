import { ChangeDetectionStrategy, Component, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
	selector: 'app-scroll-wrapper',
	templateUrl: './scroll-wrapper.component.html',
	styleUrls: ['./scroll-wrapper.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScrollWrapperComponent {
	/**
	 * maximum height of the component
	 */
	@Input() maxHeight!: number;

	/**
	 * height of each element we display
	 */
	@Input() elementHeight!: number;

	@ViewChild('contentWrapper') element!: ElementRef;

	get workingHeight(): number {
		const buttonHeights = 2 * 35; // 2x mat button up/down arrows
		const space = 40;
		return this.maxHeight - buttonHeights - space;
	}

	onScollChange(change: 'increment' | 'decement'): void {
		const addValue = change === 'increment' ? this.elementHeight : -this.elementHeight;
		this.element.nativeElement.scrollTop += addValue;
	}
}
