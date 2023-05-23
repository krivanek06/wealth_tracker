import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
	selector: 'app-dialog-close-header',
	standalone: true,
	imports: [CommonModule, MatIconModule, MatButtonModule],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="flex items-center justify-between p-4">
			<h2 class="text-lg text-wt-primary-dark mb-0">{{ title | titlecase }}</h2>

			<div>
				<button mat-icon-button color="warn" type="button" (click)="onDialogClose()">
					<mat-icon>close</mat-icon>
				</button>
			</div>
		</div>
	`,
})
export class DialogCloseHeaderComponent {
	@Output() dialogCloseEmitter = new EventEmitter<void>();
	@Input() title!: string;

	onDialogClose(): void {
		this.dialogCloseEmitter.emit();
	}
}
