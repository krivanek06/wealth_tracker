import { InvestmentAccountOverviewFragment, PersonalAccountOverviewFragment } from './schema-backend.service';

export type AccountIdentification = PersonalAccountOverviewFragment | InvestmentAccountOverviewFragment;

export const ACCOUNT_KEY = 'account';
