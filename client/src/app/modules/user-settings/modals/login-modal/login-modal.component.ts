import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
	selector: 'app-login-modal',
	templateUrl: './login-modal.component.html',
	styleUrls: ['./login-modal.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginModalComponent implements OnInit {
	constructor(private dialogRef: MatDialogRef<LoginModalComponent>) {}

	ngOnInit(): void {}
}
