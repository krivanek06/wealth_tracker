import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { InvestmentAccountGrowth } from '../../../../core/graphql';
import {
	InvestmentAccountPortfolioGrowthActionComponent,
	InvestmentAccountPortfolioGrowthChartComponent,
} from '../../components';
import { InvestmentAccountGrowthAssetsComponent } from '../../modals';

@Component({
	selector: 'app-investment-account-portfolio-growth',
	standalone: true,
	imports: [
		CommonModule,
		InvestmentAccountPortfolioGrowthActionComponent,
		InvestmentAccountPortfolioGrowthChartComponent,
		InvestmentAccountGrowthAssetsComponent,
	],
	templateUrl: './investment-account-portfolio-growth.component.html',
	styleUrls: ['./investment-account-portfolio-growth.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvestmentAccountPortfolioGrowthComponent implements OnInit {
	@Input() investmentAccountGrowth!: InvestmentAccountGrowth[];
	displayedInvestmentAccountGrowth: InvestmentAccountGrowth[] = [];
	displayFullChart = false;

	readonly sliceStart = 250;
	constructor(private dialog: MatDialog) {}
	ngOnChanges(changes: SimpleChanges): void {
		if (changes?.['investmentAccountGrowth']?.currentValue) {
			this.displayedInvestmentAccountGrowth = this.investmentAccountGrowth.slice(-this.sliceStart);
		}
	}

	ngOnInit(): void {}

	onAssetShowClick(): void {
		this.dialog.open(InvestmentAccountGrowthAssetsComponent, {
			panelClass: ['g-mat-dialog-big'],
		});
	}

	onFullChartToggle(): void {
		this.displayFullChart = !this.displayFullChart;

		if (this.displayFullChart) {
			this.displayedInvestmentAccountGrowth = this.investmentAccountGrowth;
		} else {
			this.displayedInvestmentAccountGrowth = this.investmentAccountGrowth.slice(-this.sliceStart);
		}
	}
}
