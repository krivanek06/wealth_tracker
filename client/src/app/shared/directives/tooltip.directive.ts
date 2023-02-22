import { AfterViewInit, Directive, Input, Renderer2, ViewContainerRef } from '@angular/core';

@Directive({
	selector: '[appTooltip]',
	standalone: true,
})
export class TooltipDirective implements AfterViewInit {
	@Input() appTooltip: string = '';

	private BODY_CLASS = 'g-tooltip-body';

	constructor(private vr: ViewContainerRef, private ren: Renderer2) {}

	ngAfterViewInit(): void {
		this.createTooltip();
	}

	createTooltip() {
		// create elements
		const div = this.ren.createElement('div');
		const text = this.ren.createText(this.appTooltip);
		const wrapper = this.vr.element.nativeElement;

		// add class
		this.ren.addClass(div, this.BODY_CLASS);
		this.ren.addClass(wrapper, 'group');

		// add text to div
		this.ren.appendChild(div, text);
		this.ren.appendChild(wrapper, div);
	}
}
