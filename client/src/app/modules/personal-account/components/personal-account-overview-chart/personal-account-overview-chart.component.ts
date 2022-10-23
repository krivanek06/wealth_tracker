import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-personal-account-overview-chart',
  templateUrl: './personal-account-overview-chart.component.html',
  styleUrls: ['./personal-account-overview-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PersonalAccountOverviewChartComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
