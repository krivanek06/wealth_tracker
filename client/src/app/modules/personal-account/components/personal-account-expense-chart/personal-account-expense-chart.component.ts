import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-personal-account-expense-chart',
  templateUrl: './personal-account-expense-chart.component.html',
  styleUrls: ['./personal-account-expense-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PersonalAccountExpenseChartComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
