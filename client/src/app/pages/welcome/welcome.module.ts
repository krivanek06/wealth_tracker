import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HeaderContainerModule } from '../page-shared';
import {
	WelcomeAboutComponent,
	WelcomeHeroComponent,
	WelcomeInvestmentAccountComponent,
	WelcomePersonalAccountComponent,
} from './../../modules/welcome';
import { WelcomeComponent } from './welcome.component';

const routes: Routes = [
	{
		path: '',
		component: WelcomeComponent,
	},
];

@NgModule({
	declarations: [WelcomeComponent],
	imports: [
		CommonModule,
		HeaderContainerModule,
		RouterModule.forChild(routes),
		WelcomeHeroComponent,
		WelcomeAboutComponent,
		WelcomeInvestmentAccountComponent,
		WelcomePersonalAccountComponent,
	],
	exports: [WelcomeComponent],
})
export class WelcomeModule {}
