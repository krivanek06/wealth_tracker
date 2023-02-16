import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ACCOUNT_KEY } from 'src/app/core/graphql';
import { PersonalAccountResolverGuard } from '../../guards';
import { PersonalAccountDesktopViewComponent } from '../personal-account-desktop-view/personal-account-desktop-view.component';
import { PersonalAccountMobileViewComponent } from '../personal-account-mobile-view/personal-account-mobile-view.component';
import { PersonalAccountComponent } from './personal-account.component';

const routes: Routes = [
	{
		path: '',
		component: PersonalAccountComponent,
		resolve: { [ACCOUNT_KEY]: PersonalAccountResolverGuard },
	},
];

@NgModule({
	declarations: [PersonalAccountComponent],
	imports: [
		CommonModule,
		PersonalAccountDesktopViewComponent,
		PersonalAccountMobileViewComponent,
		RouterModule.forChild(routes),
	],
	exports: [PersonalAccountComponent],
})
export class PersonalAccountModule {}
