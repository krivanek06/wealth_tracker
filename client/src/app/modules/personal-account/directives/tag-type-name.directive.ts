import { Directive, ElementRef, Input, OnChanges, Renderer2, SimpleChanges } from '@angular/core';
import { TagDataType } from '../../../core/graphql';
import { TagColors } from '../models';

@Directive({
	selector: '[appTagTypeName]',
	standalone: true,
})
export class TagTypeNameDirective implements OnChanges {
	@Input() appTagTypeName!: TagDataType;

	private INCOME = 'Income';
	private EXPENSE = 'Expense';

	constructor(private el: ElementRef, private ren: Renderer2) {}

	ngOnInit(): void {}

	ngOnChanges(changes: SimpleChanges): void {
		const displayName = this.appTagTypeName === TagDataType.Expense ? this.EXPENSE : this.INCOME;
		const color = this.appTagTypeName === TagDataType.Expense ? TagColors.expense : TagColors.income;

		const text = this.ren.createText(displayName);
		const dot = this.ren.createText('● ');

		// remove previous text
		this.ren.setProperty(this.el.nativeElement, 'innerText', '');

		// apply text and styling
		this.ren.setStyle(this.el.nativeElement, 'color', color);

		this.ren.appendChild(this.el.nativeElement, dot);
		this.ren.appendChild(this.el.nativeElement, text);
	}
}
