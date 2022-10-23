import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-personal-account-expense-allocation-chart',
  templateUrl: './personal-account-expense-allocation-chart.component.html',
  styleUrls: ['./personal-account-expense-allocation-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PersonalAccountExpenseAllocationChartComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
