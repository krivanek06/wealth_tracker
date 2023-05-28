import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { filter, map } from 'rxjs';
import {
	PersonalAccountTagDataCreate,
	PersonalAccountTagDataEdit,
	PersonalAccountTagFragment,
	TagDataType,
} from '../../../../../core/graphql';
import {
	InputTypeSlider,
	maxLengthValidator,
	minLengthValidator,
	requiredValidator,
} from '../../../../../shared/models';
import { TagImageSelectorComponent } from '../tag-image-selector/tag-image-selector.component';
import { DialogServiceUtil } from './../../../../../shared/dialogs';

@Component({
	selector: 'app-tag-item',
	templateUrl: './tag-item.component.html',
	styleUrls: ['./tag-item.component.scss'],
})
export class TagItemComponent implements OnInit {
	@Output() createTagEmitter = new EventEmitter<PersonalAccountTagDataCreate>();
	@Output() editTagEmitter = new EventEmitter<PersonalAccountTagDataEdit>();
	@Output() removeTagEmitter = new EventEmitter<PersonalAccountTagFragment>();
	@Input() editing = false;

	/**
	 * created as input, because when creating new tag - parent has buttons to choose a type
	 */
	@Input() tagType!: TagDataType;

	private _tag!: PersonalAccountTagFragment;

	@Input() set tag(data: PersonalAccountTagFragment) {
		this.tagItemGroup.controls.tagId.patchValue(data.id);
		this.tagItemGroup.controls.tagName.patchValue(data.name);
		this.tagItemGroup.controls.color.patchValue(data.color);
		this.tagItemGroup.controls.icon.patchValue(data.imageUrl);
		this.tagItemGroup.controls.budget.patchValue(data.budgetMonthly ?? 0);
		this._tag = data;
	}

	tagItemGroup = new FormGroup({
		tagId: new FormControl<string | null>(null),
		color: new FormControl<string>('#9c1c1c', { validators: [requiredValidator], nonNullable: true }),
		icon: new FormControl<string>('', { validators: [requiredValidator], nonNullable: true }),
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

	TagDataType = TagDataType;

	constructor(private dialog: MatDialog) {}

	ngOnInit(): void {}

	onEdit(): void {
		this.editing = !this.editing;
	}

	onSubmit(): void {
		this.tagItemGroup.markAllAsTouched();
		const controls = this.tagItemGroup.controls;

		// invalid
		if (this.tagItemGroup.invalid) {
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
				imageUrl: controls.icon.value,
				budgetMonthly: controls.budget.value,
			});
			return;
		}

		// emit new tag
		this.createTagEmitter.emit({
			name: controls.tagName.value,
			color: controls.color.value,
			imageUrl: controls.icon.value,
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
				filter((res): res is { url: string } => !!res),
				map((res) => res.url)
			)
			.subscribe((imageUrl) => {
				console.log('chosen', imageUrl);
				this.tagItemGroup.controls.icon.patchValue(imageUrl);
			});
	}
}
