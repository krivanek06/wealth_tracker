import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AuthenticationFacadeService } from '../../core/auth';

@Component({
	selector: 'app-welcome',
	templateUrl: './welcome.component.html',
	styleUrls: ['./welcome.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WelcomeComponent implements OnInit {
	constructor(private authenticationFacadeService: AuthenticationFacadeService, private http: HttpClient) {}

	ngOnInit(): void {
		this.authenticationFacadeService.resetData();
		this.http.get(`${environment.backend_url}/public/start`).subscribe((data) => {
			console.log(`Application starting: ${data}`);
		});
	}
}
