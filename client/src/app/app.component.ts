import { Component, OnInit } from '@angular/core';
import { PreloadDataService } from './core/services';
import { DialogServiceUtil } from './shared/dialogs';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
	constructor(dialogServiceUtil: DialogServiceUtil, preloadDataService: PreloadDataService) {}
	ngOnInit(): void {}
}
