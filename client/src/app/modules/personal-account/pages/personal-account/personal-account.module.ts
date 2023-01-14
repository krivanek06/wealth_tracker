import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PersonalAccountDesktopViewComponent } from '../personal-account-desktop-view/personal-account-desktop-view.component';
import { PersonalAccountMobileViewComponent } from '../personal-account-mobile-view/personal-account-mobile-view.component';
import { PersonalAccountComponent } from './personal-account.component';

@NgModule({
	declarations: [PersonalAccountComponent],
	imports: [CommonModule, PersonalAccountDesktopViewComponent, PersonalAccountMobileViewComponent],
	exports: [PersonalAccountComponent],
})
export class PersonalAccountModule {}
