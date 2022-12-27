import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
	selector: 'app-user-profile-modal',
	templateUrl: './user-profile-modal.component.html',
	styleUrls: ['./user-profile-modal.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserProfileModalComponent implements OnInit {
	constructor(private dialogRef: MatDialogRef<UserProfileModalComponent>) {}

	ngOnInit(): void {}
}
