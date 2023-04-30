import {
	AfterViewInit,
	Directive,
	EventEmitter,
	Host,
	Input,
	OnChanges,
	OnInit,
	Optional,
	Output,
	Renderer2,
	Self,
	SimpleChanges,
	ViewContainerRef,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';

@Directive({
	selector: '[appStylePaginator]',
	standalone: true,
})
export class StylePaginatorDirective implements OnInit, OnChanges, AfterViewInit {
	@Output() pageIndexChangeEmitter: EventEmitter<number> = new EventEmitter<number>();
	// remember rendered buttons on UI that we can remove them when page index change
	private _buttons: any[] = [];

	@Input() showTotalPages: number = 4;
	@Input() appCustomLength?: number | null;
	@Input() appCustomPageIndex?: number | null;

	constructor(
		@Host() @Self() @Optional() private readonly matPag: MatPaginator,
		private vr: ViewContainerRef,
		private ren: Renderer2
	) {}

	ngAfterViewInit(): void {
		this.buildPageNumbers();
	}

	ngOnChanges(changes: SimpleChanges): void {
		// no data returned, remove buttons
		if (changes?.['appCustomLength']?.currentValue === null || changes?.['appCustomLength']?.currentValue === 0) {
			this.removeButtons();
		}
		if (changes?.['appCustomLength']?.currentValue) {
			const index = this.matPag.pageIndex ?? 0;
			this.switchPage(index);
			this.buildButtons();
		}
		if (changes?.['appCustomPageIndex']?.currentValue !== changes?.['appCustomPageIndex']?.previousValue) {
			const index = this.appCustomPageIndex ?? 0;
			this.switchPage(index);
			this.buildButtons();
		}
	}

	ngOnInit(): void {
		// when pagination change -> rerender buttons
		this.matPag.page.subscribe((e) => {
			this.buildButtons();
		});
	}

	/*
    Removes or change styling of some html elements
  */
	private buildPageNumbers() {
		// remove 'items per page'
		const itemsPerPage = this.vr.element.nativeElement.querySelector('.mat-mdc-paginator-page-size');
		if (itemsPerPage) {
			this.ren.setStyle(itemsPerPage, 'display', 'none');
		}

		// remove text '1 of N'
		const howManyDisplayedEl = this.vr.element.nativeElement.querySelector('.mat-mdc-paginator-range-label');
		if (howManyDisplayedEl) {
			this.ren.setStyle(howManyDisplayedEl, 'display', 'none');
		}

		// remove those arrows from html
		const navigationButtons = (this.vr.element.nativeElement.querySelectorAll('.mat-mdc-focus-indicator') ??
			[]) as HTMLElement[];
		navigationButtons.forEach((el) => {
			this.ren.setStyle(el, 'display', 'none');
		});
	}

	private buildButtons(): void {
		if (!this.appCustomLength) {
			this.appCustomLength = 0;
			// throw new Error('StylePaginatorDirective: this.appCustomLength is undefined');
		}
		const actionContainer = this.vr.element.nativeElement.querySelector('div.mat-mdc-paginator-range-actions');
		const nextPageNode = this.vr.element.nativeElement.querySelector('button.mat-mdc-paginator-navigation-next');

		// remove buttons before creating new ones
		this.removeButtons();

		// we want to render one button before (as previous)
		const currentIndex = this.matPag.pageIndex < 2 ? 0 : this.matPag.pageIndex - 2;
		const maxPages = Math.ceil(this.appCustomLength / this.matPag.pageSize);

		// display buttons
		for (let index = currentIndex; index <= currentIndex + this.showTotalPages; index++) {
			// do not render more than max page buttons
			if (maxPages > 1 && index < maxPages) {
				this.ren.insertBefore(actionContainer, this.createButton(index, this.matPag.pageIndex), nextPageNode);
			}
		}

		// determine whether to show last bubble button that will navigate to the end
		// there used to be a bug when  maxPages === this.showTotalPage -> last bubble was showed twice
		if (this.matPag.pageIndex + 3 < maxPages && maxPages !== this.showTotalPages) {
			const lastIndex = maxPages - 1;
			const element = this.createDotsElement();
			this.ren.insertBefore(actionContainer, element, nextPageNode);
			this.ren.insertBefore(actionContainer, this.createButton(lastIndex, this.matPag.pageIndex), nextPageNode);
		}
	}

	private removeButtons(): void {
		const actionContainer = this.vr.element.nativeElement.querySelector('div.mat-mdc-paginator-range-actions');

		if (this._buttons.length > 0) {
			this._buttons.forEach((button) => {
				this.ren.removeChild(actionContainer, button);
			});
			//Empty state array
			this._buttons.length = 0;
		}
	}

	private createButton(i: number, currentPageIndex: number): any {
		const bubbleButton = this.ren.createElement('div');
		const text = this.ren.createText(String(i + 1));

		// add class & text
		this.ren.addClass(bubbleButton, 'g-bubble');
		this.ren.addClass(bubbleButton, 'mr-2');
		this.ren.appendChild(bubbleButton, text);

		// active button
		if (currentPageIndex === i) {
			this.ren.addClass(bubbleButton, 'g-bubble__active');
		}

		// react on click
		this.ren.listen(bubbleButton, 'click', () => {
			this.switchPage(i);
		});

		this._buttons.push(bubbleButton);
		return bubbleButton;
	}

	private createDotsElement(): any {
		const dotsEl = this.ren.createElement('span');
		const dotsText = this.ren.createText('...');

		// add class
		this.ren.addClass(dotsEl, 'text-lg');
		this.ren.addClass(dotsEl, 'mr-1');
		this.ren.addClass(dotsEl, 'ml-1');
		this.ren.addClass(dotsEl, 'text-gray-400');

		// append text to element
		this.ren.appendChild(dotsEl, dotsText);

		// remember element
		this._buttons.push(dotsEl);

		return dotsEl;
	}

	// Helper function to switch page on non first, last, next and previous buttons only.
	private switchPage(i: number): void {
		const previousPageIndex = this.matPag.pageIndex;
		this.matPag.pageIndex = i;
		this.matPag['_emitPageEvent'](previousPageIndex);

		this.pageIndexChangeEmitter.emit(i);
	}
}
