import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
	@Output() userAccountClick = new EventEmitter<void>();
	@Output() manageAccountClick = new EventEmitter<void>();

	onUserAccountClick(): void {
		this.userAccountClick.emit();
	}

	onManageAccountClick(): void {
		this.manageAccountClick.emit();
	}
}
