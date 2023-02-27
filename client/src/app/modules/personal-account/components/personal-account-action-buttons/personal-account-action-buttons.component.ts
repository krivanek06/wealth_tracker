import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { PersonalAccountActionButtonType } from '../../models';

@Component({
	selector: 'app-personal-account-action-buttons',
	standalone: true,
	imports: [CommonModule, MatIconModule, MatButtonModule, MatMenuModule],
	templateUrl: './personal-account-action-buttons.component.html',
	styleUrls: ['./personal-account-action-buttons.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonalAccountActionButtonsComponent {
	@Input() displayType: 'buttons' | 'menu' = 'buttons';

	@Output() buttonClickEmitter = new EventEmitter<PersonalAccountActionButtonType>();

	onActionButtonClick(type: PersonalAccountActionButtonType): void {
		this.buttonClickEmitter.emit(type);
	}
}
