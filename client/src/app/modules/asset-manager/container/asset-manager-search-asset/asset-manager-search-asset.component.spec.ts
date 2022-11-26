import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetManagerSearchAssetComponent } from './asset-manager-search-asset.component';

describe('AssetManagerSearchAssetComponent', () => {
  let component: AssetManagerSearchAssetComponent;
  let fixture: ComponentFixture<AssetManagerSearchAssetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetManagerSearchAssetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetManagerSearchAssetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
