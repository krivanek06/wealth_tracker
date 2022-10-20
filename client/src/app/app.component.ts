import { Component, OnInit } from '@angular/core';
import { GetDefaultTagsGQL } from './core';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
	constructor(private getDefaultTagsGQL: GetDefaultTagsGQL) {}
	ngOnInit(): void {
		this.getDefaultTagsGQL.watch().valueChanges.subscribe(console.log);
	}
}
