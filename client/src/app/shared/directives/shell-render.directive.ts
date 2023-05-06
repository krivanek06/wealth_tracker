import { isPlatformServer } from '@angular/common';
import { Directive, Inject, OnInit, PLATFORM_ID, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
	selector: '[appShellRender]',
	standalone: true,
})
export class AppShellRenderDirective implements OnInit {
	constructor(
		private viewContainer: ViewContainerRef,
		private templateRef: TemplateRef<any>,
		@Inject(PLATFORM_ID) private platformId: string
	) {}

	ngOnInit() {
		if (isPlatformServer(this.platformId)) {
			this.viewContainer.createEmbeddedView(this.templateRef);
		} else {
			this.viewContainer.clear();
		}
	}
}

@Directive({
	selector: '[appShellNoRender]',
	standalone: true,
})
export class AppShellNoRenderDirective implements OnInit {
	constructor(
		private viewContainer: ViewContainerRef,
		private templateRef: TemplateRef<any>,
		@Inject(PLATFORM_ID) private platformId: string
	) {}

	ngOnInit() {
		if (isPlatformServer(this.platformId)) {
			this.viewContainer.clear();
		} else {
			this.viewContainer.createEmbeddedView(this.templateRef);
		}
	}
}
