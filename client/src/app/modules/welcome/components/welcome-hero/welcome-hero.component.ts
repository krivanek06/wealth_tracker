import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { TOP_LEVEL_NAV } from '../../../../core/models';
import { LoginModalComponent } from '../../../user-settings/modals';

@Component({
	selector: 'app-welcome-hero',
	standalone: true,
	imports: [CommonModule, MatButtonModule],
	templateUrl: './welcome-hero.component.html',
	styleUrls: ['./welcome-hero.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WelcomeHeroComponent implements OnInit {
	description =
		'Helping people to gain better control of their finances by creating an oversight of their cash flow from one place';

	constructor(private dialog: MatDialog, private router: Router, private title: Title, private meta: Meta) {}

	ngOnInit(): void {
		// SEO metadata
		this.title.setTitle('Spend Mindful');
		this.meta.addTags([
			{ name: 'description', content: this.description },
			{ name: 'author', content: 'Eduard Krivanek' },
			{ name: 'keywords', content: 'Financial tracking application' },
		]);
	}

	onLogin() {
		this.dialog
			.open(LoginModalComponent, {
				panelClass: ['g-mat-dialog-small'],
			})
			.afterClosed()
			.subscribe((res: boolean) => {
				if (res) {
					this.router.navigate([TOP_LEVEL_NAV.dashboard]);
				}
			});
	}
}
