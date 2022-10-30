import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
	selector: 'app-mat-card-wrapper',
	templateUrl: './mat-card-wrapper.component.html',
	styleUrls: ['./mat-card-wrapper.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MatCardWrapperComponent {
	@Input() title: string | null = null;
	@Input() titleImgUrl?: string;

	@Input() subtitle: string | null = null;
	@Input() additionalClasses = '';
}
