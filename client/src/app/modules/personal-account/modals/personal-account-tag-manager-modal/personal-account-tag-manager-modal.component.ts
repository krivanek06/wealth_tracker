import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PersonalAccountFacadeService } from '../../../../core/api';
import { PersonalAccountDataService } from '../../services';

@Component({
	selector: 'app-personal-account-tag-manager-modal',
	templateUrl: './personal-account-tag-manager-modal.component.html',
	styleUrls: ['./personal-account-tag-manager-modal.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonalAccountTagManagerModalComponent implements OnInit {
	enabledBudgetingControl = new FormControl<boolean>(false, { nonNullable: true });

	constructor(
		private personalAccountFacadeService: PersonalAccountFacadeService,
		private personalAccountDataService: PersonalAccountDataService,
		private dialogRef: MatDialogRef<PersonalAccountTagManagerModalComponent>,
		@Inject(MAT_DIALOG_DATA)
		public data: {
			personalAccountId: string;
			personalAccountName: string;
		}
	) {}
	ngOnInit(): void {
		this.enabledBudgetingControl.valueChanges.subscribe(console.log);
	}
}
