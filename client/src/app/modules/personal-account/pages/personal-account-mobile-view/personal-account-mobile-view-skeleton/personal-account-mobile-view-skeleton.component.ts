import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { RangeDirective } from '../../../../../shared/directives';

@Component({
	selector: 'app-personal-account-mobile-view-skeleton',
	standalone: true,
	imports: [CommonModule, RangeDirective, MatDividerModule],
	templateUrl: './personal-account-mobile-view-skeleton.component.html',
	styleUrls: ['./personal-account-mobile-view-skeleton.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonalAccountMobileViewSkeletonComponent {}
