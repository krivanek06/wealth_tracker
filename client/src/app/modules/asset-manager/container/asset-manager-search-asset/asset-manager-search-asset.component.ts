import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, FormControl, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Observable, of, switchMap, tap } from 'rxjs';
import { AssetApiService } from '../../../../core/api';
import { AssetGeneralFragment } from '../../../../core/graphql';

@Component({
	selector: 'app-asset-manager-search-asset',
	templateUrl: './asset-manager-search-asset.component.html',
	styleUrls: ['./asset-manager-search-asset.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssetManagerSearchAssetComponent implements OnInit, ControlValueAccessor {
	@Input() set searchForCrypto(value: boolean) {
		this.isCryptoSearch = value;
		this.formControl.patchValue('');
	}

	formControl = new FormControl<string>('', { validators: [Validators.required], nonNullable: true });

	// results showned on the UI
	searchedResults$!: Observable<AssetGeneralFragment[]>;

	// used to show loading spinner
	searching = false;

	private isCryptoSearch = false;

	onChange: (value: AssetGeneralFragment | null) => void = () => {};
	onTouched = () => {};

	constructor(private assetApiService: AssetApiService) {}

	ngOnInit(): void {
		// load symbol data from API
		this.searchedResults$ = this.formControl.valueChanges.pipe(
			distinctUntilChanged(),
			debounceTime(400),
			tap((value) => (this.searching = !!value)),
			switchMap((value) =>
				!value
					? of([]).pipe(tap(() => this.onChange(null))) // notify parent that serach was cleared
					: this.assetApiService
							.searchAssetBySymbol(value.toUpperCase(), this.isCryptoSearch)
							.pipe(tap(() => (this.searching = false)))
			)
		);
	}

	onSelect(asset: AssetGeneralFragment): void {
		console.log('select', asset);
		this.onChange(asset);
		this.formControl.patchValue(asset.name, { emitEvent: false, onlySelf: true });
	}

	writeValue(symbolName: string): void {
		this.formControl.patchValue(symbolName);
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
}
