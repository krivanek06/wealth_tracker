import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { DefaultImgDirective } from '../../../../shared/directives';
import { PersonalAccountTagAggregation } from '../../models';

@Component({
	selector: 'app-personal-account-expenses-by-tag',
	standalone: true,
	imports: [CommonModule, MatButtonModule, MatIconModule, DefaultImgDirective, MatProgressBarModule],
	templateUrl: './personal-account-expenses-by-tag.component.html',
	styleUrls: ['./personal-account-expenses-by-tag.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonalAccountExpensesByTagComponent {
	@Output() onClickEmitter = new EventEmitter<PersonalAccountTagAggregation>();
	@Input() aggregation!: PersonalAccountTagAggregation;

	onClick() {
		this.onClickEmitter.emit(this.aggregation);
	}
}
