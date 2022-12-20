import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationFacadeService } from '../auth';
import { LoggedUserOutputFragment } from '../graphql';
import { STORAGE_ACCESS_TOKEN } from '../models';

@Injectable({
	providedIn: 'root',
})
export class ResolveTokenGuard implements Resolve<void> {
	constructor(private authenticationFacadeService: AuthenticationFacadeService, private router: Router) {}

	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<void> | Promise<void> | void {
		if (this.getTokenFromLocalStorage()) {
			return;
		}

		const accessToken = route.queryParamMap.get('accessToken');
		console.log('client got token', accessToken);

		if (!accessToken) {
			return;
		}

		//save token
		this.authenticationFacadeService.setAccessToken({
			__typename: 'LoggedUserOutput',
			accessToken,
		});

		// Remove query params
		this.router.navigate([], {
			queryParams: {
				accessToken: null,
			},
			queryParamsHandling: 'merge',
		});
	}

	private getTokenFromLocalStorage(): boolean {
		const token = localStorage.getItem(STORAGE_ACCESS_TOKEN);
		if (token) {
			console.log('token inside localstorage');
			try {
				const parsed = JSON.parse(token) as LoggedUserOutputFragment;
				this.authenticationFacadeService.setAccessToken(parsed);
				return true;
			} catch (err) {
				return false;
			}
		}

		return false;
	}
}
