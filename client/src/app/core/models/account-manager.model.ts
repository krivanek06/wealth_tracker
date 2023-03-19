import { AccountIdentificationFragment } from '../graphql';
import { DASHBOARD_ROUTES } from './navigation.model';

export interface AccountManagerRoutes {
	route: DASHBOARD_ROUTES;
	data: AccountIdentificationFragment;
}
