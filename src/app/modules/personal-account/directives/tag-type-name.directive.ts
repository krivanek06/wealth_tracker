import { Directive, ElementRef, Input, OnChanges, Renderer2, SimpleChanges } from '@angular/core';
import { PersonalAccountTagTypeNew, TagColors } from '../../../core/api';

@Directive({
	selector: '[appTagTypeName]',
	standalone: true,
})
export class TagTypeNameDirective implements OnChanges {
	@Input() appTagTypeName!: PersonalAccountTagTypeNew;

	constructor(private el: ElementRef, private ren: Renderer2) {}

	ngOnInit(): void {}

	ngOnChanges(changes: SimpleChanges): void {
		const displayName = this.appTagTypeName === 'EXPENSE' ? 'Expense' : 'Income';
		const color = this.appTagTypeName === 'EXPENSE' ? TagColors.expense : TagColors.income;

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
