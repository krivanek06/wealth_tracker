import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { filter, map } from 'rxjs';
import { PersonalAccountTagFragment } from '../../../../../core/graphql';
import { Confirmable } from '../../../../../shared/decorators';
import {
	InputTypeSlider,
	maxLengthValidator,
	minLengthValidator,
	requiredValidator,
} from '../../../../../shared/models';
import { TagSelectorComponent } from '../tag-selector/tag-selector.component';

@Component({
	selector: 'app-tag-item',
	templateUrl: './tag-item.component.html',
	styleUrls: ['./tag-item.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagItemComponent implements OnInit {
	@Input() set tag(data: PersonalAccountTagFragment) {
		this.tagItemGroup.controls.tagName.patchValue(data.name);
		this.tagItemGroup.controls.color.patchValue(data.color);
		this.tagItemGroup.controls.icon.patchValue(data.imageUrl);
		this.tagItemGroup.controls.budget.patchValue(data.budgetMonthly ?? 0);
	}

	tagItemGroup = new FormGroup({
		color: new FormControl<string>('#9c1c1c', { validators: [requiredValidator], nonNullable: true }),
		icon: new FormControl<string>('', { validators: [requiredValidator], nonNullable: true }),
		tagName: new FormControl<string>('', {
			validators: [requiredValidator, minLengthValidator(4), maxLengthValidator(15)],
			nonNullable: true,
		}),
		budget: new FormControl<number>(0, { nonNullable: true }),
	});

	sliderConfig: InputTypeSlider = {
		min: 0,
		max: 1200,
		step: 1,
	};

	constructor(private dialog: MatDialog) {}

	ngOnInit(): void {
		this.tagItemGroup.valueChanges.subscribe(console.log);
	}

	onSubmit(): void {
		console.log('submit');
	}

	@Confirmable('Please confirm remove the selected tag')
	onRemove(): void {
		console.log('remove');
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
}
