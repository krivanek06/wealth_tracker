import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RangeDirective } from '../../../../../shared/directives';

@Component({
	selector: 'app-personal-account-desktop-view-skeleton',
	standalone: true,
	imports: [CommonModule, RangeDirective],
	templateUrl: './personal-account-desktop-view-skeleton.component.html',
	styleUrls: ['./personal-account-desktop-view-skeleton.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonalAccountDesktopViewSkeletonComponent {}
