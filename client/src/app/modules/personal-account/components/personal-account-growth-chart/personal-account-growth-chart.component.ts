import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-personal-account-growth-chart',
  templateUrl: './personal-account-growth-chart.component.html',
  styleUrls: ['./personal-account-growth-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PersonalAccountGrowthChartComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
