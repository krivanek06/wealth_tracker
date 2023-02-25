import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map, Observable } from 'rxjs';
import { PersonalAccountFacadeService } from '../../../../core/api';
import { PersonalAccountTagFragment } from '../../../../core/graphql';

@Component({
	selector: 'app-personal-account-tag-manager-modal',
	templateUrl: './personal-account-tag-manager-modal.component.html',
	styleUrls: ['./personal-account-tag-manager-modal.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonalAccountTagManagerModalComponent implements OnInit {
	personalAccountTags$!: Observable<PersonalAccountTagFragment[]>;
	enabledBudgetingControl = new FormControl<boolean>(false, { nonNullable: true });

	constructor(
		private personalAccountFacadeService: PersonalAccountFacadeService,
		private dialogRef: MatDialogRef<PersonalAccountTagManagerModalComponent>,
		@Inject(MAT_DIALOG_DATA)
		public data: {
			personalAccountId: string;
			personalAccountName: string;
		}
	) {}
	ngOnInit(): void {
		this.personalAccountTags$ = this.personalAccountFacadeService
			.getPersonalAccountDetailsById(this.data.personalAccountId)
			.pipe(map((res) => res.personalAccountTag));

		this.enabledBudgetingControl.valueChanges.subscribe(console.log);
	}
}
