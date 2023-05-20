import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { filter, first, map, of, switchMap, tap } from 'rxjs';
import { PersonalAccountFacadeService } from '../../../../../core/api';
import { PersonalAccountTagFragment, TagDataType } from '../../../../../core/graphql';
import { Confirmable } from '../../../../../shared/decorators';
import {
	InputTypeSlider,
	maxLengthValidator,
	minLengthValidator,
	requiredValidator,
} from '../../../../../shared/models';
import { TagSelectorComponent } from '../tag-selector/tag-selector.component';
import { DialogServiceUtil } from './../../../../../shared/dialogs';

@Component({
	selector: 'app-tag-item',
	templateUrl: './tag-item.component.html',
	styleUrls: ['./tag-item.component.scss'],
})
export class TagItemComponent implements OnInit {
	@Output() removeNewTag = new EventEmitter<void>();
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
			validators: [requiredValidator, minLengthValidator(3), maxLengthValidator(20)],
			nonNullable: true,
		}),
		budget: new FormControl<number>(0, { nonNullable: true }),
	});

	sliderConfig: InputTypeSlider = {
		min: 0,
		max: 800,
		step: 1,
	};

	TagDataType = TagDataType;

	constructor(private personalAccountFacadeService: PersonalAccountFacadeService, private dialog: MatDialog) {}

	ngOnInit(): void {}

	onEdit(): void {
		this.editing = !this.editing;
	}

	onSubmit(): void {
		this.tagItemGroup.markAllAsTouched();

		// invalid
		if (this.tagItemGroup.invalid) {
			return;
		}

		// edit
		if (this.tagItemGroup.controls.tagId.value) {
			this.editExistingTag();
			return;
		}

		// create
		this.createTag();
	}

	@Confirmable('Please confirm to remove the selected tag')
	onRemove(): void {
		const removingTagId = this.tagItemGroup.controls.tagId.value;
		const removingTagName = this.tagItemGroup.controls.tagName.value;

		if (!removingTagId || !removingTagName) {
			DialogServiceUtil.showNotificationBar('Unable to perform removing operation on tag', 'error');
			return;
		}

		this.personalAccountFacadeService
			.getPersonalAccountDetailsByUser()
			.pipe(
				switchMap((account) => {
					// find in yearly aggregation the tag that is being removed
					const tagInfo = account.yearlyAggregation.find((d) => d.tag.id === removingTagId);

					// no daily data was created for a specific tag
					if (!tagInfo) {
						return of(true);
					}

					// ask for confirmation to remove the tag
					return DialogServiceUtil.showConfirmDialogObs(`You are about to remove ${tagInfo.entries} entries`);
				}),
				filter((result) => !!result),
				tap(() => DialogServiceUtil.showNotificationBar(`Removing tag ${removingTagName}`, 'notification')),
				switchMap(() =>
					this.personalAccountFacadeService.deletePersonalAccountTag(this._tag).pipe(
						tap((result) => {
							if (!result) {
								DialogServiceUtil.showNotificationBar('Unable to perform removing operation on tag', 'error');
								return;
							}
							DialogServiceUtil.showNotificationBar(`Tag ${removingTagName} has been removed`, 'success');
						})
					)
				),
				first()
			)
			.subscribe();
	}

	onTagImageChange(): void {
		this.dialog
			.open(TagSelectorComponent, {
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

	private createTag(): void {
		const controls = this.tagItemGroup.controls;
		DialogServiceUtil.showNotificationBar(`Creating new tag ${controls.tagName.value}`, 'notification');

		this.personalAccountFacadeService
			.createPersonalAccountTag({
				name: controls.tagName.value,
				color: controls.color.value,
				imageUrl: controls.icon.value,
				budgetMonthly: controls.budget.value,
				type: this.tagType,
			})
			.pipe(
				tap((result) => {
					if (!result) {
						DialogServiceUtil.showNotificationBar('Unable to create tag', 'error');
						return;
					}
					DialogServiceUtil.showNotificationBar(`Tag has been created`, 'success');
				}),
				first()
			)
			.subscribe(() => this.removeNewTag.emit());
	}

	private editExistingTag(): void {
		const controls = this.tagItemGroup.controls;

		if (!controls.tagId.value) {
			return;
		}

		this.editing = false;
		DialogServiceUtil.showNotificationBar(`Editing tag ${controls.tagName.value}`, 'notification');

		this.personalAccountFacadeService
			.editPersonalAccountTag({
				id: controls.tagId.value,
				name: controls.tagName.value,
				color: controls.color.value,
				imageUrl: controls.icon.value,
				budgetMonthly: controls.budget.value,
			})
			.pipe(
				tap((result) => {
					if (!result) {
						DialogServiceUtil.showNotificationBar('Unable to change tag', 'error');
						return;
					}
					DialogServiceUtil.showNotificationBar(`Tag has been changed`, 'success');
				})
			)
			.subscribe();
	}
}
