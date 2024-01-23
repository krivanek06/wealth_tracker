import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { filter, map } from 'rxjs';
import {
	InputTypeSlider,
	maxLengthValidator,
	minLengthValidator,
	requiredValidator,
} from '../../../../../shared/models';
import { TagImageSelectorComponent } from '../tag-image-selector/tag-image-selector.component';
import {
	PersonalAccountTag,
	PersonalAccountTagCreate,
	PersonalAccountTagImageName,
	PersonalAccountTagTypeNew,
} from './../../../../../core/api';
import { DialogServiceUtil } from './../../../../../shared/dialogs';

@Component({
	selector: 'app-tag-item',
	template: `
		<form [formGroup]="tagItemGroup" (ngSubmit)="onSubmit()">
			<!-- color -->
			<app-color-picker formControlName="color" [componentDisabled]="!editing"></app-color-picker>

			<!-- icon -->
			<button type="button" (click)="onTagImageChange()" [disabled]="!editing">
				<img
					appDefaultImg
					[src]="tagItemGroup.controls.icon.value"
					class="w-8 h-8"
					[matTooltip]="editing ? 'Change image' : ''"
					alt="Icon image"
				/>
			</button>

			<!-- name -->
			<div>
				<app-form-mat-input-wrapper
					[disabled]="!editing"
					controlName="tagName"
					inputCaption="Enter name for a tag"
				></app-form-mat-input-wrapper>
			</div>

			<!-- budget -->
			<div *ngIf="tagType === 'EXPENSE'" class="flex-1 col-span-2 sm:col-span-6">
				<app-slider [componentDisabled]="!editing" formControlName="budget" [config]="sliderConfig"></app-slider>
			</div>

			<!-- action buttons -->
			<div *ngIf="editing" class="flex items-center gap-x-5">
				<button mat-icon-button color="accent" type="submit" matTooltip="Save Tag Changes" class="border border-solid">
					<mat-icon>done</mat-icon>
				</button>
				<button
					*ngIf="tagItemGroup.controls.tagId.value"
					mat-icon-button
					color="warn"
					type="button"
					(click)="onRemove()"
					matTooltip="Remove Tag"
					class="border border-solid"
				>
					<mat-icon>delete</mat-icon>
				</button>
			</div>

			<div *ngIf="!editing">
				<button mat-stroked-button color="primary" type="button" (click)="onEdit()" class="w-full min-w-[120px]">
					<mat-icon>edit</mat-icon>
					Edit
				</button>
			</div>
		</form>

		<!-- error for image -->
		<div *ngIf="tagItemGroup.controls.icon.touched && tagItemGroup.controls.icon.invalid" class="g-error-banner">
			Please select an image for your tag
		</div>
	`,
	styles: [
		`
			:host {
				display: block;

				form {
					@apply grid grid-cols-2 sm:grid-cols-6 lg:flex items-center gap-x-8;

					:nth-child(-n + 2) {
						@apply m-auto col-span-1;
					}

					:nth-child(3) {
						@apply pt-2 col-span-2 sm:col-span-4 lg:flex-1;
					}

					:last-child {
						@apply col-span-2 sm:col-span-6;

						button {
							flex: 1;
						}
					}
				}
			}
		`,
	],
})
export class TagItemComponent implements OnInit {
	@Output() createTagEmitter = new EventEmitter<PersonalAccountTagCreate>();
	@Output() editTagEmitter = new EventEmitter<PersonalAccountTag>();
	@Output() removeTagEmitter = new EventEmitter<PersonalAccountTag>();
	@Input() editing = false;

	/**
	 * created as input, because when creating new tag - parent has buttons to choose a type
	 */
	@Input() tagType!: PersonalAccountTagTypeNew;

	private _tag!: PersonalAccountTag;

	@Input() set tag(data: PersonalAccountTag) {
		this.tagItemGroup.controls.tagId.patchValue(data.id);
		this.tagItemGroup.controls.tagName.patchValue(data.name);
		this.tagItemGroup.controls.color.patchValue(data.color);
		this.tagItemGroup.controls.icon.patchValue(data.image);
		this.tagItemGroup.controls.budget.patchValue(data.budgetMonthly ?? 0);
		this._tag = data;
	}

	tagItemGroup = new FormGroup({
		tagId: new FormControl<string | null>(null),
		color: new FormControl<string>('#9c1c1c', { validators: [requiredValidator], nonNullable: true }),
		icon: new FormControl<PersonalAccountTagImageName | null>(null, {
			validators: [requiredValidator],
			nonNullable: true,
		}),
		tagName: new FormControl<string>('', {
			validators: [requiredValidator, minLengthValidator(3), maxLengthValidator(15)],
			nonNullable: true,
		}),
		budget: new FormControl<number>(0, { nonNullable: true }),
	});

	sliderConfig: InputTypeSlider = {
		min: 0,
		max: 600,
		step: 1,
	};

	constructor(private dialog: MatDialog) {}

	ngOnInit(): void {}

	onEdit(): void {
		this.editing = !this.editing;
	}

	onSubmit(): void {
		this.tagItemGroup.markAllAsTouched();
		const controls = this.tagItemGroup.controls;

		// invalid
		if (this.tagItemGroup.invalid || !controls.icon.value) {
			DialogServiceUtil.showNotificationBar('Form is invalid', 'error');
			return;
		}

		// edit edited values
		if (controls.tagId.value) {
			this.editing = false;
			this.editTagEmitter.emit({
				id: controls.tagId.value,
				name: controls.tagName.value,
				color: controls.color.value,
				image: controls.icon.value,
				budgetMonthly: controls.budget.value,
				type: this.tagType,
			});
			return;
		}

		// emit new tag
		this.createTagEmitter.emit({
			name: controls.tagName.value,
			color: controls.color.value,
			image: controls.icon.value,
			budgetMonthly: controls.budget.value,
			type: this.tagType,
		});
	}

	onRemove(): void {
		const removingTagId = this.tagItemGroup.controls.tagId.value;
		const removingTagName = this.tagItemGroup.controls.tagName.value;

		if (!removingTagId || !removingTagName) {
			DialogServiceUtil.showNotificationBar('Unable to perform removing operation on tag', 'error');
			return;
		}

		this.removeTagEmitter.emit(this._tag);
	}

	onTagImageChange(): void {
		this.dialog
			.open(TagImageSelectorComponent, {
				panelClass: ['g-mat-dialog-small'],
			})
			.afterClosed()
			.pipe(
				filter((res): res is { url: PersonalAccountTagImageName } => !!res),
				map((res) => res.url)
			)
			.subscribe((imageUrl) => {
				console.log('chosen', imageUrl);
				this.tagItemGroup.controls.icon.patchValue(imageUrl);
			});
	}
}
