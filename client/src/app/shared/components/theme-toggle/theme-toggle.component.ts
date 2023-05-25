import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ThemeService } from '../../../core/services';

@Component({
	selector: 'app-theme-toggle',
	standalone: true,
	imports: [CommonModule, MatSlideToggleModule, MatIconModule, ReactiveFormsModule],
	templateUrl: './theme-toggle.component.html',
	styleUrls: ['./theme-toggle.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeToggleComponent implements OnInit {
	sliderControl = new FormControl<boolean>(false);
	constructor(private themeService: ThemeService) {
		this.sliderControl.patchValue(!this.themeService.isLightMode());
	}

	ngOnInit(): void {
		this.sliderControl.valueChanges.subscribe(() => {
			this.themeService.toggleTheme();
		});
	}
}
