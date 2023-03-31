import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
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
	displayedInvestmentAccountGrowth!: InvestmentAccountGrowth[];

	displayFullChart = false;

	readonly sliceStart = 300;
	constructor(private dialog: MatDialog) {}

	ngOnInit(): void {
		this.displayedInvestmentAccountGrowth = this.investmentAccountGrowth.slice(-this.sliceStart);
	}

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
			this.displayedInvestmentAccountGrowth = this.investmentAccountGrowth.slice(this.sliceStart);
		}
	}
}
