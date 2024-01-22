import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { PersonalAccountFacadeService } from '../../../../../core/api';

@Component({
	selector: 'app-tag-image-selector',
	template: `
		<h2 class="text-xl text-center text-wt-primary-dark">Select Tag Image</h2>

		<mat-dialog-content class="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-4">
			<!-- images -->
			<ng-container *ngIf="availableTagImages$ | async as availableTagImages; else showLoader">
				<button *ngFor="let data of availableTagImages" mat-stroked-button class="h-20" (click)="onImageClick(data)">
					<div>
						<img [src]="data" alt="tag image" class="w-14 h-14" />
					</div>
				</button>
			</ng-container>

			<!-- loader -->
			<ng-template #showLoader>
				<div *ngRange="25" class="w-20 h-20 g-skeleton"></div>
			</ng-template>
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
export class TagImageSelectorComponent implements OnInit {
	availableTagImages$!: Observable<string[]>;
	constructor(
		private dialogRef: MatDialogRef<TagImageSelectorComponent>,
		private personalAccountFacadeService: PersonalAccountFacadeService
	) {}
	ngOnInit(): void {
		this.availableTagImages$ = this.personalAccountFacadeService.getPersonalAccountAvailableTagImages();
	}

	onImageClick(url: string) {
		this.dialogRef.close({ url });
	}
}
