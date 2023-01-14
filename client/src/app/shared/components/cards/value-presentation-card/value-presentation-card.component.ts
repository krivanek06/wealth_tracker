import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
	selector: 'app-value-presentation-card',
	standalone: true,
	imports: [CommonModule, MatCardModule],
	templateUrl: './value-presentation-card.component.html',
	styleUrls: ['./value-presentation-card.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ValuePresentationCardComponent {
	@Input() title: string | null = null;
	@Input() titleImgUrl?: string;
	@Input() showDataInCard = true;
}
