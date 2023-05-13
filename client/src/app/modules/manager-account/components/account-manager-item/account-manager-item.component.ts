import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AccountIdentificationFragment, AccountType } from '../../../../core/graphql';
import { FormMatInputWrapperModule } from '../../../../shared/components';
import { maxLengthValidator, minLengthValidator, requiredValidator } from '../../../../shared/models';
import { ACCOUNT_NAMES, AccountManagerEdit } from '../../models';

@Component({
	selector: 'app-account-manager-item',
	standalone: true,
	imports: [
		CommonModule,
		MatIconModule,
		MatButtonModule,
		ReactiveFormsModule,
		FormMatInputWrapperModule,
		MatTooltipModule,
	],
	templateUrl: './account-manager-item.component.html',
	styleUrls: ['./account-manager-item.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountManagerItemComponent implements OnInit {
	@Output() deleteEmitter = new EventEmitter<void>();
	@Output() editEmitter = new EventEmitter<AccountManagerEdit>();
	@Output() clickedEmitter = new EventEmitter<void>();
	@Output() createEmitter = new EventEmitter<void>();

	@Input() set accountData(data: AccountIdentificationFragment | null | undefined) {
		if (data) {
			this.account = data;
			this.accountForm.controls.accountName.patchValue(data.name);
			this.accountForm.controls.id.patchValue(data.id);
		}
	}

	@Input() accountType!: AccountType;

	accountForm = new FormGroup({
		id: new FormControl<string | null>(null),
		accountName: new FormControl<string>('', {
			validators: [requiredValidator, minLengthValidator(6), maxLengthValidator(40)],
			nonNullable: true,
		}),
	});

	account?: AccountIdentificationFragment;
	isEditing = false;

	ACCOUNT_NAMES = ACCOUNT_NAMES;

	ngOnInit(): void {}

	onAccountClick(): void {
		this.clickedEmitter.emit();
	}

	onAccountCreate(): void {
		this.createEmitter.emit();
	}

	onEditingToggle(): void {
		if (this.account) {
			this.accountForm.controls.accountName.patchValue(this.account.name);
		}
		this.isEditing = !this.isEditing;
	}

	onSubmit(): void {
		this.editEmitter.emit({
			id: this.accountForm.controls.id.value,
			name: this.accountForm.controls.accountName.value,
		});
		this.isEditing = false;
	}

	onDelete(): void {
		this.deleteEmitter.emit();
	}
}
