import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { PersonalAccountTagImageName, personalAccountTagImageName } from '../../../../../core/api';

@Component({
	selector: 'app-tag-image-selector',
	template: `
		<h2 class="text-xl text-center text-wt-primary-dark">Select Tag Image</h2>

		<mat-dialog-content class="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-4">
			<!-- images -->
			<button *ngFor="let data of availableTagImages" mat-stroked-button class="h-20" (click)="onImageClick(data)">
				<div>
					<img appDefaultImg imageType="tagName" [src]="data" alt="tag image" class="w-14 h-14" />
				</div>
			</button>
		</mat-dialog-content>

		<div class="mt-4 mb-2">
			<mat-divider></mat-divider>
		</div>

		<!-- action buttons -->
		<mat-dialog-actions>
			<div class="g-mat-dialog-actions-end">
				<button mat-stroked-button mat-dialog-close type="button" class="g-button-size-lg">Cancel</button>
			</div>
		</mat-dialog-actions>
	`,
	styles: [
		`
			:host {
				display: block;
			}
		`,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagImageSelectorComponent {
	private dialogRef = inject(MatDialogRef<TagImageSelectorComponent>);
	availableTagImages = personalAccountTagImageName;

	onImageClick(url: PersonalAccountTagImageName) {
		this.dialogRef.close({ url });
	}
}
