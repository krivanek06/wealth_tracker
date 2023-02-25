import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Confirmable } from '../../../../../shared/decorators';
import {
	InputTypeSlider,
	maxLengthValidator,
	minLengthValidator,
	requiredValidator,
} from '../../../../../shared/models';

@Component({
	selector: 'app-tag-item',
	templateUrl: './tag-item.component.html',
	styleUrls: ['./tag-item.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagItemComponent implements OnInit {
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
		max: 300,
		step: 1,
	};

	icon = 'https://storage.googleapis.com/frequently_accessible_assets/personal-account-tags/job.svg';

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
}
