import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';

@Component({
	selector: 'app-mat-card-wrapper',
	templateUrl: './mat-card-wrapper.component.html',
	styleUrls: ['./mat-card-wrapper.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [CommonModule, MatCardModule, MatDividerModule],
})
export class MatCardWrapperComponent {
	@Input() title: string | null = null;
	@Input() titleImgUrl?: string;

	@Input() subtitle: string | null = null;
	@Input() additionalClasses = '';

	@Input() showDivider = false;

	@Input() showDataInCard = true;
}
