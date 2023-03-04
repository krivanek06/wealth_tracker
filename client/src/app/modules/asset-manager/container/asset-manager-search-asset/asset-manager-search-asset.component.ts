import { ChangeDetectionStrategy, Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Observable, of, switchMap, tap } from 'rxjs';
import { AssetApiService } from '../../../../core/api';
import { AssetGeneralFragment } from '../../../../core/graphql';
import { SearchableAssetEnum } from '../../models';

@Component({
	selector: 'app-asset-manager-search-asset',
	templateUrl: './asset-manager-search-asset.component.html',
	styleUrls: ['./asset-manager-search-asset.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => AssetManagerSearchAssetComponent),
			multi: true,
		},
	],
})
export class AssetManagerSearchAssetComponent implements OnInit, ControlValueAccessor {
	@Input() set searchableAsset(value: SearchableAssetEnum) {
		this.searchType = value;
		this.formControl.patchValue('');
		this.onChange(null);
	}

	@Input() isDisabled = false;

	formControl = new FormControl<string>('');

	// results showned on the UI
	searchedResults$!: Observable<AssetGeneralFragment[]>;

	// used to show loading spinner
	searching = false;

	private searchType: SearchableAssetEnum = SearchableAssetEnum.AseetByName;

	onChange: (value: AssetGeneralFragment | null) => void = () => {};
	onTouched = () => {};

	constructor(private assetApiService: AssetApiService) {}

	ngOnInit(): void {
		// load symbol data from API
		this.searchedResults$ = this.formControl.valueChanges.pipe(
			distinctUntilChanged(),
			debounceTime(400),
			tap((value) => (this.searching = true)),
			switchMap((value) => (!value ? of([]) : this.getSearchEndpoint(value).pipe(tap(() => (this.searching = false)))))
		);
	}

	onSelect(asset: AssetGeneralFragment): void {
		console.log('select', asset);
		this.onChange(asset);
		this.formControl.patchValue(asset.name, { emitEvent: false, onlySelf: true });
	}

	writeValue(asset?: AssetGeneralFragment): void {
		if (asset) {
			this.formControl.patchValue(asset.name, { emitEvent: false, onlySelf: true });
		}
	}

	/**
	 * Register Component's ControlValueAccessor onChange callback
	 */
	registerOnChange(fn: AssetManagerSearchAssetComponent['onChange']): void {
		this.onChange = fn;
	}

	/**
	 * Register Component's ControlValueAccessor onTouched callback
	 */
	registerOnTouched(fn: AssetManagerSearchAssetComponent['onTouched']): void {
		this.onTouched = fn;
	}

	private getSearchEndpoint(value: string): Observable<AssetGeneralFragment[]> {
		const val = value.toUpperCase();
		if (this.searchType === SearchableAssetEnum.AseetByName) {
			return this.assetApiService.searchAssetBySymbol(val);
		}
		if (this.searchType === SearchableAssetEnum.Crypto) {
			return this.assetApiService.searchAssetBySymbolTickerPrefix(val, true);
		}
		return this.assetApiService.searchAssetBySymbolTickerPrefix(val, false);
	}
}
