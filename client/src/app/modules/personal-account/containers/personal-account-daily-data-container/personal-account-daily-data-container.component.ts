import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-personal-account-daily-data-container',
  templateUrl: './personal-account-daily-data-container.component.html',
  styleUrls: ['./personal-account-daily-data-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PersonalAccountDailyDataContainerComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
