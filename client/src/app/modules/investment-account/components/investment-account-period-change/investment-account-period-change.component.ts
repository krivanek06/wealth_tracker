import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-investment-account-period-change',
  templateUrl: './investment-account-period-change.component.html',
  styleUrls: ['./investment-account-period-change.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvestmentAccountPeriodChangeComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
