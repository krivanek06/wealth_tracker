import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationFacadeService } from '../auth';
import { LoggedUserOutputFragment } from '../graphql';
import { STORAGE_ACCESS_TOKEN, TOP_LEVEL_NAV } from '../models';

@Injectable({
	providedIn: 'root',
})
export class VerifyAuthentication implements CanActivate {
	constructor(private authenticationFacadeService: AuthenticationFacadeService, private router: Router) {}

	canActivate(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
		if (this.getTokenFromLocalStorage()) {
			this.router.navigate([TOP_LEVEL_NAV.welcome]);
			return false;
		}

		const accessToken = route.queryParamMap.get('accessToken');
		console.log('client got token', accessToken);

		if (!accessToken) {
			this.router.navigate([TOP_LEVEL_NAV.welcome]);
			return false;
		}

		// save token
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

		return true;
	}

	private getTokenFromLocalStorage(): boolean {
		const token = localStorage.getItem(STORAGE_ACCESS_TOKEN);
		if (token) {
			console.log('token inside local storage');
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
