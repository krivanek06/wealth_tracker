import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PersonalAccountActionButtonType } from '../../models';

@Component({
	selector: 'app-personal-account-action-buttons',
	standalone: true,
	imports: [CommonModule, MatIconModule, MatButtonModule],
	templateUrl: './personal-account-action-buttons.component.html',
	styleUrls: ['./personal-account-action-buttons.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonalAccountActionButtonsComponent {
	@Output() buttonClickEmitter = new EventEmitter<PersonalAccountActionButtonType>();

	onActionButtonClick(type: PersonalAccountActionButtonType): void {
		this.buttonClickEmitter.emit(type);
	}
}
