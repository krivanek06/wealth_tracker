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
	@Input() set investmentAccountGrowth(data: InvestmentAccountGrowth[]) {
		this._investmentAccountGrowth = data;
		this.displayedInvestmentAccountGrowth = data.slice(-this.sliceStart);
	}
	displayedInvestmentAccountGrowth: InvestmentAccountGrowth[] = [];

	displayFullChart = false;

	private _investmentAccountGrowth: InvestmentAccountGrowth[] = [];
	readonly sliceStart = 300;
	constructor(private dialog: MatDialog) {}

	ngOnInit(): void {}

	onAssetShowClick(): void {
		this.dialog.open(InvestmentAccountGrowthAssetsComponent, {
			panelClass: ['g-mat-dialog-big'],
		});
	}

	onFullChartToggle(): void {
		this.displayFullChart = !this.displayFullChart;

		if (this.displayFullChart) {
			this.displayedInvestmentAccountGrowth = this._investmentAccountGrowth;
		} else {
			this.displayedInvestmentAccountGrowth = this._investmentAccountGrowth.slice(this.sliceStart);
		}
	}
}
