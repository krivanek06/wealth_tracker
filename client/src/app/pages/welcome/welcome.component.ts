import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AuthenticationFacadeService } from '../../core/auth';

@Component({
	selector: 'app-welcome',
	templateUrl: './welcome.component.html',
	styleUrls: ['./welcome.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WelcomeComponent implements OnInit {
	constructor(private authenticationFacadeService: AuthenticationFacadeService) {}

	ngOnInit(): void {
		console.log('Welcome page ngOnInit');
		this.authenticationFacadeService.resetData();
	}
}
