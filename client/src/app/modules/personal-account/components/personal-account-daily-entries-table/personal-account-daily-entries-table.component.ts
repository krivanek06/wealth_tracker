import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-personal-account-daily-entries-table',
  templateUrl: './personal-account-daily-entries-table.component.html',
  styleUrls: ['./personal-account-daily-entries-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PersonalAccountDailyEntriesTableComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
