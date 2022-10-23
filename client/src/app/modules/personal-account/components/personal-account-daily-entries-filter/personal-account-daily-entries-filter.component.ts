import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-personal-account-daily-entries-filter',
  templateUrl: './personal-account-daily-entries-filter.component.html',
  styleUrls: ['./personal-account-daily-entries-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PersonalAccountDailyEntriesFilterComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
