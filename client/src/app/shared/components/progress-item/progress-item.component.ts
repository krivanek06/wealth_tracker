import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

@Component({
	selector: 'app-progress-item',
	templateUrl: './progress-item.component.html',
	styleUrls: ['./progress-item.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressItemComponent implements OnInit {
	@Input() min!: number;
	@Input() max!: number;
	@Input() value?: number | null;

	constructor() {}

	ngOnInit(): void {}
}
