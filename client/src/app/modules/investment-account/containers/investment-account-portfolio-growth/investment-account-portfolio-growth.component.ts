import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { InvestmentAccountGrowth } from '../../../../core/graphql';
import {
	InvestmentAccountPortfolioGrowthActionComponent,
	InvestmentAccountPortfolioGrowthChartComponent,
} from '../../components';

@Component({
	selector: 'app-investment-account-portfolio-growth',
	standalone: true,
	imports: [
		CommonModule,
		InvestmentAccountPortfolioGrowthActionComponent,
		InvestmentAccountPortfolioGrowthChartComponent,
	],
	templateUrl: './investment-account-portfolio-growth.component.html',
	styleUrls: ['./investment-account-portfolio-growth.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvestmentAccountPortfolioGrowthComponent implements OnInit {
	@Input() investmentAccountGrowth!: InvestmentAccountGrowth[];
	displayedInvestmentAccountGrowth!: InvestmentAccountGrowth[];

	displayFullChart = false;

	private sliceStart = -300;
	constructor(private dialog: MatDialog) {}

	ngOnInit(): void {
		this.displayedInvestmentAccountGrowth = this.investmentAccountGrowth.slice(this.sliceStart);
	}

	onAssetShowClick(): void {
		// this.dialog.open(InvestmentAccountAssetComponent, {
		// 	data: {
		// 		investmentId: this.investmentId,
		// 	},
		// 	panelClass: ['g-mat-dialog-big'],
		// 	minHeight: '50vh',
		// });
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
