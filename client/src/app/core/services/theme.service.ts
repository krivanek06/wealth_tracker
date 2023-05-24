import { Injectable } from '@angular/core';
import { DarkTheme, LightTheme, STORAGE_THEME_PREFERENCE, ThemeType } from '../models';
import { StorageService } from './storage.service';

@Injectable({
	providedIn: 'root',
})
export class ThemeService extends StorageService<ThemeType> {
	constructor() {
		super(STORAGE_THEME_PREFERENCE);
	}

	toggleTheme(): void {
		const currentTheme = this.getData();
		if (currentTheme === 'light') {
			this.setTheme('dark');
			this.saveData('dark');
		} else {
			this.setTheme('light');
			this.saveData('light');
		}
	}

	setTheme(theme: ThemeType): void {
		if (theme === 'light') {
			this.initLightTheme();
		} else {
			this.initDarkTheme();
		}
	}

	private initDarkTheme(): void {
		document.documentElement.style.setProperty(DarkTheme.background.name, DarkTheme.background.value);
		document.documentElement.style.setProperty(DarkTheme.primary.name, DarkTheme.primary.value);
		document.documentElement.style.setProperty(DarkTheme.grayDark.name, DarkTheme.grayDark.value);
		document.documentElement.style.setProperty(DarkTheme.grayMedium.name, DarkTheme.grayMedium.value);
		document.documentElement.style.setProperty(DarkTheme.grayLight.name, DarkTheme.grayLight.value);
	}

	private initLightTheme(): void {
		document.documentElement.style.setProperty(LightTheme.background.name, LightTheme.background.value);
		document.documentElement.style.setProperty(LightTheme.primary.name, LightTheme.primary.value);
		document.documentElement.style.setProperty(LightTheme.grayDark.name, LightTheme.grayDark.value);
		document.documentElement.style.setProperty(LightTheme.grayMedium.name, LightTheme.grayMedium.value);
		document.documentElement.style.setProperty(LightTheme.grayLight.name, LightTheme.grayLight.value);
	}
}
