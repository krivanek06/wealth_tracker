import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
	selector: 'app-investment-account-portfolio-growth-action',
	standalone: true,
	imports: [CommonModule, MatButtonModule, MatIconModule],
	templateUrl: './investment-account-portfolio-growth-action.component.html',
	styleUrls: ['./investment-account-portfolio-growth-action.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvestmentAccountPortfolioGrowthActionComponent {
	@Output() assetShowClickEmitter = new EventEmitter<void>();
	@Output() fullChartShowClickEmitter = new EventEmitter<void>();

	@Input() startDate!: string;
	@Input() endDate!: string;

	onAssetShowClick() {
		this.assetShowClickEmitter.emit();
	}

	onFullChartShow() {
		this.fullChartShowClickEmitter.emit();
	}
}
