import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
	selector: 'app-expander',
	standalone: true,
	imports: [CommonModule, MatButtonModule, MatIconModule],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="flex justify-end relative z-10" [ngClass]="classes">
			<button (click)="onExpendClick()" type="button" mat-stroked-button [color]="isExpanded ? 'warn' : 'primary'">
				<mat-icon class="mr-2">open_in_full</mat-icon>
				<span *ngIf="!isExpanded">Expand</span>
				<span *ngIf="isExpanded">Shrink</span>
			</button>
		</div>
	`,
})
export class ExpanderComponent {
	@Output() onExpendClickEmitter = new EventEmitter<void>();
	@Input() classes: string = '-mb-10 pr-2';
	@Input() isExpanded: boolean = false;

	onExpendClick(): void {
		this.onExpendClickEmitter.emit();
	}
}
