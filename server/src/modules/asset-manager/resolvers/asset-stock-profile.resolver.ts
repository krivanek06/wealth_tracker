import { UseGuards } from '@nestjs/common';
import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { AuthorizationGuard } from 'src/auth';
import { AssetStockProfile } from '../entities';
import { AssetStockService } from '../services';

@UseGuards(AuthorizationGuard)
@Resolver(() => AssetStockProfile)
export class AssetStockProfileResolver {
	constructor(private assetStockService: AssetStockService) {}

	@ResolveField('imageUrl', () => String, {
		nullable: true,
	})
	getSectorImageUrl(@Parent() profile: AssetStockProfile): string | null {
		return this.assetStockService.getSectorImageUrl(profile);
	}
}
