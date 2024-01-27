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
	template: `
		<div class="flex items-center gap-4">
			<mat-icon>light_mode</mat-icon>
			<mat-slide-toggle [formControl]="sliderControl" color="primary"></mat-slide-toggle>
			<mat-icon>dark_mode</mat-icon>
		</div>
	`,
	styles: [
		`
			:host {
				display: block;
			}

			::ng-deep .mat-mdc-slide-toggle .mdc-switch {
				width: 120px !important;
			}
		`,
	],
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
