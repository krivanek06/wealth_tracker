import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HeaderContainerModule } from '../page-shared';
import { WelcomeComponent } from './welcome.component';

const routes: Routes = [
	{
		path: '',
		component: WelcomeComponent,
	},
];

@NgModule({
	declarations: [WelcomeComponent],
	imports: [CommonModule, HeaderContainerModule, RouterModule.forChild(routes)],
})
export class WelcomeModule {}
