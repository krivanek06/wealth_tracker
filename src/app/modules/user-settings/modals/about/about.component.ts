import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { URL_LINKED_IN, URL_PERSONAL_WEBSITE } from '../../../../core/models';
import { DialogCloseHeaderComponent } from '../../../../shared/components';

@Component({
	selector: 'app-about',
	standalone: true,
	imports: [
		CommonModule,
		MatDialogModule,
		MatButtonModule,
		MatIconModule,
		MatDividerModule,
		MatTooltipModule,
		DialogCloseHeaderComponent,
	],
	templateUrl: './about.component.html',
	styleUrls: ['./about.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutComponent {
	URL_LINKED_IN = URL_LINKED_IN;
	URL_PERSONAL_WEBSITE = URL_PERSONAL_WEBSITE;
	constructor(private dialogRef: MatDialogRef<AboutComponent>) {}

	onCancel(): void {
		this.dialogRef.close();
	}
}
