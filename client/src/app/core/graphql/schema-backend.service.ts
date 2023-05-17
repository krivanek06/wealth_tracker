import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: any;
};

export type AccountIdentification = {
  __typename?: 'AccountIdentification';
  /** What account types it is */
  accountType: AccountType;
  /** Date time when account was created */
  createdAt: Scalars['String'];
  id: Scalars['ID'];
  /** custom name for account */
  name: Scalars['String'];
  /** Reference to User.ID who created this account */
  userId: Scalars['String'];
};

export enum AccountType {
  Investment = 'INVESTMENT',
  Personal = 'PERSONAL'
}

export type AssetGeneral = {
  __typename?: 'AssetGeneral';
  assetIntoLastUpdate: Scalars['DateTime'];
  assetQuote: AssetGeneralQuote;
  id: Scalars['String'];
  name: Scalars['String'];
  symbolImageURL?: Maybe<Scalars['String']>;
};

export type AssetGeneralHistoricalPrices = {
  __typename?: 'AssetGeneralHistoricalPrices';
  /** Historical prices to create charts for portoflio */
  assetHistoricalPricesData: Array<AssetGeneralHistoricalPricesData>;
  dateEnd: Scalars['String'];
  dateStart: Scalars['String'];
  /** Symbol Id - AAPL, MSFT, BTCUSD */
  id: Scalars['String'];
};

export type AssetGeneralHistoricalPricesData = {
  __typename?: 'AssetGeneralHistoricalPricesData';
  close: Scalars['Float'];
  /** Format YYYY-MM-DD, i.e: 2022-03-12 */
  date: Scalars['String'];
};

export type AssetGeneralHistoricalPricesInput = {
  end: Scalars['String'];
  start: Scalars['String'];
  symbol: Scalars['String'];
};

export type AssetGeneralHistoricalPricesInputOnDate = {
  date: Scalars['String'];
  symbol: Scalars['String'];
};

export type AssetGeneralQuote = {
  __typename?: 'AssetGeneralQuote';
  /** Null very rarely when picking uncommon stock, like American Campus Communities */
  avgVolume?: Maybe<Scalars['Float']>;
  change: Scalars['Float'];
  changesPercentage: Scalars['Float'];
  /** Null value of information was received during weekend */
  dayHigh?: Maybe<Scalars['Float']>;
  /** Null value of information was received during weekend */
  dayLow?: Maybe<Scalars['Float']>;
  /** Only present for stocks */
  earningsAnnouncement?: Maybe<Scalars['String']>;
  /** Only present for stocks */
  eps?: Maybe<Scalars['Float']>;
  exchange: Scalars['String'];
  marketCap: Scalars['Float'];
  name: Scalars['String'];
  /** Only present for stocks */
  pe?: Maybe<Scalars['Float']>;
  price: Scalars['Float'];
  /** Null very rarely when picking uncommon stock, like American Campus Communities */
  priceAvg50?: Maybe<Scalars['Float']>;
  /** Null very rarely when picking uncommon stock, like American Campus Communities */
  priceAvg200?: Maybe<Scalars['Float']>;
  /** For crypto it is current supply, null should be rarely */
  sharesOutstanding?: Maybe<Scalars['Float']>;
  symbol: Scalars['String'];
  symbolImageURL?: Maybe<Scalars['String']>;
  timestamp: Scalars['Float'];
  volume: Scalars['Float'];
  /** Null very rarely when picking uncommon stock, like American Campus Communities */
  yearHigh?: Maybe<Scalars['Float']>;
  /** Null very rarely when picking uncommon stock, like American Campus Communities */
  yearLow?: Maybe<Scalars['Float']>;
};

export type AssetGeneralSearchInput = {
  isCrypto?: Scalars['Boolean'];
  symbolPrefix: Scalars['String'];
};

export type AssetStockProfile = {
  __typename?: 'AssetStockProfile';
  address: Scalars['String'];
  ceo: Scalars['String'];
  cik: Scalars['String'];
  city: Scalars['String'];
  companyName: Scalars['String'];
  country: Scalars['String'];
  currency: Scalars['String'];
  cusip: Scalars['String'];
  defaultImage: Scalars['Boolean'];
  description: Scalars['String'];
  exchange: Scalars['String'];
  exchangeShortName: Scalars['String'];
  fullTimeEmployees: Scalars['String'];
  image: Scalars['String'];
  imageUrl?: Maybe<Scalars['String']>;
  industry: Scalars['String'];
  ipoDate: Scalars['String'];
  isActivelyTrading: Scalars['Boolean'];
  isAdr: Scalars['Boolean'];
  isEtf: Scalars['Boolean'];
  isFund: Scalars['Boolean'];
  isin: Scalars['String'];
  phone: Scalars['String'];
  sector: Scalars['String'];
  state: Scalars['String'];
  website: Scalars['String'];
  zip: Scalars['String'];
};

export enum AuthenticationType {
  BasicAuth = 'BASIC_AUTH',
  Google = 'GOOGLE'
}

export type ChangePasswordInput = {
  password: Scalars['String'];
  passwordRepeat: Scalars['String'];
};

export type ChartSeries = {
  __typename?: 'ChartSeries';
  /** Chart Data */
  data: Array<Array<Scalars['Float']>>;
  /** Name of the series */
  name: Scalars['String'];
};

export type HoldingInputData = {
  /** Date when we added this holding to our investment account */
  date: Scalars['String'];
  /** How many units of this symbol user has */
  units: Scalars['Float'];
};

export type InvestmentAccounHoldingCreateInput = {
  /** User can add custom total value of this holding and not load from API */
  customTotalValue?: InputMaybe<Scalars['Float']>;
  holdingInputData: HoldingInputData;
  isCrypto: Scalars['Boolean'];
  /** Symbol ID */
  symbol: Scalars['String'];
  type: InvestmentAccountHoldingHistoryType;
};

export type InvestmentAccounHoldingHistoryDeleteInput = {
  /** Id of the item the user wants to remove */
  itemId: Scalars['String'];
  /** Symbol ID */
  symbol: Scalars['String'];
};

export type InvestmentAccount = {
  __typename?: 'InvestmentAccount';
  /** What account types it is */
  accountType: AccountType;
  /** Returns active holdings from an investment account, at least one unit is owned */
  activeHoldings: Array<InvestmentAccountActiveHoldingOutput>;
  /** History of changed cash value */
  cashChange: Array<InvestmentAccountCashChange>;
  /** Date time when account was created */
  createdAt: Scalars['String'];
  /** Returns current cash holding */
  currentCash: Scalars['Float'];
  /** Holding history of this asset */
  holdings: Array<InvestmentAccountHolding>;
  id: Scalars['ID'];
  /** custom name for account */
  name: Scalars['String'];
  /** Reference to User.ID who created this account */
  userId: Scalars['String'];
};

export type InvestmentAccountActiveHoldingOutput = {
  __typename?: 'InvestmentAccountActiveHoldingOutput';
  assetGeneral: AssetGeneral;
  /** Symbol ID -> AAPL, MSFT, BTC */
  assetId: Scalars['String'];
  beakEvenPrice: Scalars['Float'];
  /** Symbol ID -> AAPL, MSFT, BTC */
  id: Scalars['String'];
  /** Associated InvestmentAccount.id */
  investmentAccountId: Scalars['String'];
  sector: Scalars['String'];
  sectorImageUrl?: Maybe<Scalars['String']>;
  totalValue: Scalars['Float'];
  type: InvestmentAccountHoldingType;
  /** Total units for the active holding */
  units: Scalars['Float'];
};

export type InvestmentAccountActiveHoldingOutputWrapper = {
  __typename?: 'InvestmentAccountActiveHoldingOutputWrapper';
  /** Modified active holding current data */
  holdingOutput: InvestmentAccountActiveHoldingOutput;
  /** Transaction that was created */
  transaction: InvestmentAccountTransactionOutput;
};

export type InvestmentAccountCashChange = {
  __typename?: 'InvestmentAccountCashChange';
  cashValue: Scalars['Float'];
  /** Format yyyy-MM-DD */
  date: Scalars['String'];
  /** Returns corresponding image url for the Cash Type */
  imageUrl: Scalars['String'];
  itemId: Scalars['String'];
  type: InvestmentAccountCashChangeType;
};

export enum InvestmentAccountCashChangeType {
  AssetOperation = 'ASSET_OPERATION',
  Deposit = 'DEPOSIT',
  Withdrawal = 'WITHDRAWAL'
}

export type InvestmentAccountEditInput = {
  name: Scalars['String'];
};

export type InvestmentAccountGrowth = {
  __typename?: 'InvestmentAccountGrowth';
  date: Scalars['Float'];
  /** Accumulation of all invested assets in that specific date */
  invested: Scalars['Float'];
  ownedAssets: Scalars['Float'];
};

export type InvestmentAccountGrowthInput = {
  /** Sectors which to filter by. If empty, no filtering */
  sectors?: InputMaybe<Array<Scalars['String']>>;
};

export type InvestmentAccountHolding = {
  __typename?: 'InvestmentAccountHolding';
  /** Symbol ID -> AAPL, MSFT, BTC */
  assetId: Scalars['String'];
  /** How many units of this symbol user has */
  holdingHistory: Array<InvestmentAccountHoldingHistory>;
  /** Symbol ID -> AAPL, MSFT, BTC */
  id: Scalars['String'];
  /** Associated InvestmentAccount.id */
  investmentAccountId: Scalars['String'];
  sector: Scalars['String'];
  /** Returns corresponding image url for the Cash Type */
  sectorImageUrl: Scalars['String'];
  type: InvestmentAccountHoldingType;
};

export type InvestmentAccountHoldingHistory = {
  __typename?: 'InvestmentAccountHoldingHistory';
  /** Symbol ID -> AAPL, MSFT, BTC */
  assetId: Scalars['String'];
  /** Date when entry was created */
  createdAt: Scalars['DateTime'];
  date: Scalars['String'];
  itemId: Scalars['String'];
  return?: Maybe<Scalars['Float']>;
  returnChange?: Maybe<Scalars['Float']>;
  type: InvestmentAccountHoldingHistoryType;
  unitValue: Scalars['Float'];
  units: Scalars['Float'];
};

export enum InvestmentAccountHoldingHistoryType {
  Buy = 'BUY',
  Sell = 'SELL'
}

export enum InvestmentAccountHoldingType {
  Adr = 'ADR',
  Commodity = 'COMMODITY',
  Crypto = 'CRYPTO',
  Etf = 'ETF',
  MutualFund = 'MUTUAL_FUND',
  Stock = 'STOCK'
}

export type InvestmentAccountTransactionInput = {
  /** Include symbols IDs for filtering, if empty, show all */
  filterSymbols?: Array<Scalars['String']>;
  /** Put false if only SELL operation to get */
  includeBuyOperation?: Scalars['Boolean'];
  offset?: Scalars['Int'];
  /** Put false to order DESC */
  orderAsc?: Scalars['Boolean'];
  orderType?: InvestmentAccountTransactionInputOrderType;
};

export enum InvestmentAccountTransactionInputOrderType {
  OrderByCreatedAt = 'ORDER_BY_CREATED_AT',
  OrderByDate = 'ORDER_BY_DATE',
  OrderByValue = 'ORDER_BY_VALUE',
  OrderByValueChange = 'ORDER_BY_VALUE_CHANGE'
}

export type InvestmentAccountTransactionOutput = {
  __typename?: 'InvestmentAccountTransactionOutput';
  /** Symbol ID -> AAPL, MSFT, BTC */
  assetId: Scalars['String'];
  /** Date when entry was created */
  createdAt: Scalars['DateTime'];
  date: Scalars['String'];
  holdingType: InvestmentAccountHoldingType;
  itemId: Scalars['String'];
  return?: Maybe<Scalars['Float']>;
  returnChange?: Maybe<Scalars['Float']>;
  sector: Scalars['String'];
  type: InvestmentAccountHoldingHistoryType;
  unitValue: Scalars['Float'];
  units: Scalars['Float'];
};

export type InvestmentAccountTransactionWrapperOutput = {
  __typename?: 'InvestmentAccountTransactionWrapperOutput';
  /** list of best transaction by value */
  bestValue: Array<InvestmentAccountTransactionOutput>;
  /** list of best transaction by value change (%) */
  bestValueChange: Array<InvestmentAccountTransactionOutput>;
  /** list of best transaction by value change */
  worstValue: Array<InvestmentAccountTransactionOutput>;
  /** list of worst transaction by value change (%) */
  worstValueChange: Array<InvestmentAccountTransactionOutput>;
};

export type LoggedUserOutput = {
  __typename?: 'LoggedUserOutput';
  /** Generated user's accessToken, encoded RequestUser */
  accessToken: Scalars['String'];
};

export type LoginForgotPasswordInput = {
  email: Scalars['String'];
};

export type LoginUserInput = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  changePassword: Scalars['Boolean'];
  createInvestmentAccount: InvestmentAccount;
  createInvestmentAccountHolding: InvestmentAccountActiveHoldingOutputWrapper;
  createPersonalAccount: PersonalAccount;
  createPersonalAccountDailyEntry: PersonalAccountDailyDataOutput;
  createPersonalAccountTag: PersonalAccountTag;
  /** Returns the ID of the removed investment account */
  deleteInvestmentAccount: InvestmentAccount;
  deleteInvestmentAccountHolding: InvestmentAccountHoldingHistory;
  deletePersonalAccount: PersonalAccount;
  deletePersonalAccountDailyEntry: PersonalAccountDailyDataOutput;
  deletePersonalAccountTag: PersonalAccountTag;
  editInvestmentAccount: InvestmentAccount;
  editPersonalAccount: PersonalAccount;
  editPersonalAccountDailyEntry: PersonalAccountDailyDataEditOutput;
  editPersonalAccountTag: PersonalAccountTag;
  loginBasic: LoggedUserOutput;
  registerBasic: LoggedUserOutput;
  resetPassword: Scalars['Boolean'];
};


export type MutationChangePasswordArgs = {
  input: ChangePasswordInput;
};


export type MutationCreateInvestmentAccountHoldingArgs = {
  input: InvestmentAccounHoldingCreateInput;
};


export type MutationCreatePersonalAccountDailyEntryArgs = {
  input: PersonalAccountDailyDataCreate;
};


export type MutationCreatePersonalAccountTagArgs = {
  input: PersonalAccountTagDataCreate;
};


export type MutationDeleteInvestmentAccountHoldingArgs = {
  input: InvestmentAccounHoldingHistoryDeleteInput;
};


export type MutationDeletePersonalAccountDailyEntryArgs = {
  input: PersonalAccountDailyDataDelete;
};


export type MutationDeletePersonalAccountTagArgs = {
  input: PersonalAccountTagDataDelete;
};


export type MutationEditInvestmentAccountArgs = {
  input: InvestmentAccountEditInput;
};


export type MutationEditPersonalAccountArgs = {
  input: PersonalAccountEditInput;
};


export type MutationEditPersonalAccountDailyEntryArgs = {
  input: PersonalAccountDailyDataEdit;
};


export type MutationEditPersonalAccountTagArgs = {
  input: PersonalAccountTagDataEdit;
};


export type MutationLoginBasicArgs = {
  input: LoginUserInput;
};


export type MutationRegisterBasicArgs = {
  input: RegisterUserInput;
};


export type MutationResetPasswordArgs = {
  input: LoginForgotPasswordInput;
};

export type PersonalAccount = {
  __typename?: 'PersonalAccount';
  /** What account types it is */
  accountType: AccountType;
  /** Date time when account was created */
  createdAt: Scalars['String'];
  enabledBudgeting: Scalars['Boolean'];
  id: Scalars['ID'];
  monthlyData: Array<PersonalAccountMonthlyData>;
  /** custom name for account */
  name: Scalars['String'];
  personalAccountTag: Array<PersonalAccountTag>;
  /** Reference to User.ID who created this account */
  userId: Scalars['String'];
  weeklyAggregation: Array<PersonalAccountWeeklyAggregationOutput>;
  yearlyAggregation: Array<PersonalAccountAggregationDataOutput>;
};

export type PersonalAccountAggregationDataOutput = {
  __typename?: 'PersonalAccountAggregationDataOutput';
  /** How many entries per personalAccountTagId per week there were */
  entries: Scalars['Int'];
  /** Tag associated with entries */
  tag: PersonalAccountTag;
  /** Sum of values for a specific personalAccountTagId */
  value: Scalars['Float'];
};

export type PersonalAccountDailyDataCreate = {
  /** Date (past, current, future) to which assign this entry. Timezone difference for current date */
  date: Scalars['String'];
  /** Description to daily data */
  description?: Scalars['String'];
  /** Which tag to associate this entry */
  tagId: Scalars['String'];
  /** How much value (amount) shall be added to the account */
  value: Scalars['Float'];
};

export type PersonalAccountDailyDataDelete = {
  dailyDataId: Scalars['String'];
  monthlyDataId: Scalars['String'];
};

export type PersonalAccountDailyDataEdit = {
  /** New daily data we want to save */
  dailyDataCreate: PersonalAccountDailyDataCreate;
  /** Original daily data we want to edit */
  dailyDataDelete: PersonalAccountDailyDataDelete;
};

export type PersonalAccountDailyDataEditOutput = {
  __typename?: 'PersonalAccountDailyDataEditOutput';
  /** Edited object */
  modifiedDailyData: PersonalAccountDailyDataOutput;
  /** Original object before edit */
  originalDailyData: PersonalAccountDailyDataOutput;
};

export type PersonalAccountDailyDataOutput = {
  __typename?: 'PersonalAccountDailyDataOutput';
  date: Scalars['String'];
  /** Description to daily data */
  description?: Maybe<Scalars['String']>;
  /** Random ID to identify the entity */
  id: Scalars['String'];
  /** Reference to PersonalAccountMonthlyData.id */
  monthlyDataId: Scalars['String'];
  /** Reference to PersonalAccount.id */
  personalAccountId: Scalars['String'];
  /** Reference by PersonalAccountDailyData.tagId */
  tag: PersonalAccountTag;
  /** Reference to PersonalAccountTag.id */
  tagId: Scalars['String'];
  /** Reference to User.id, person who has created the entry */
  userId: Scalars['String'];
  /** Money amount change for a tagId */
  value: Scalars['Float'];
  /** To which week in a year is this account change associated. Like 37 for "Week 37" */
  week: Scalars['Int'];
};

export type PersonalAccountDailyDataQuery = {
  /** Which year to query daily data */
  month: Scalars['Int'];
  /** Which year to query daily data */
  year: Scalars['Int'];
};

export type PersonalAccountEditInput = {
  name: Scalars['String'];
};

export type PersonalAccountMonthlyData = {
  __typename?: 'PersonalAccountMonthlyData';
  dailyEntries: Scalars['Int'];
  id: Scalars['String'];
  /** To which month in a year is this account change associated. Like 8 for September */
  month: Scalars['Int'];
  monthlyExpense: Scalars['Float'];
  monthlyIncome: Scalars['Float'];
  /** Reference to PersonalAccount.id */
  personalAccountId: Scalars['String'];
  /** Id of user whose to belong this personal monthly data */
  userId: Scalars['String'];
  /** To which year is this account change associated. */
  year: Scalars['Int'];
};

export type PersonalAccountTag = {
  __typename?: 'PersonalAccountTag';
  /** Monthly budget for a tag */
  budgetMonthly?: Maybe<Scalars['Float']>;
  /** Color of the tag */
  color: Scalars['String'];
  createdAt: Scalars['String'];
  id: Scalars['ID'];
  /** URL to image */
  imageUrl: Scalars['String'];
  /** Name of the tag */
  name: Scalars['String'];
  type: TagDataType;
  /** Reference to User.id, person who has created this personcal account tag. For detault tags this is null */
  userId?: Maybe<Scalars['String']>;
};

export type PersonalAccountTagDataCreate = {
  budgetMonthly: Scalars['Float'];
  color: Scalars['String'];
  imageUrl: Scalars['String'];
  name: Scalars['String'];
  type: TagDataType;
};

export type PersonalAccountTagDataDelete = {
  /** tag id */
  id: Scalars['String'];
};

export type PersonalAccountTagDataEdit = {
  budgetMonthly: Scalars['Float'];
  color: Scalars['String'];
  id: Scalars['String'];
  imageUrl: Scalars['String'];
  name: Scalars['String'];
};

export type PersonalAccountWeeklyAggregationOutput = {
  __typename?: 'PersonalAccountWeeklyAggregationOutput';
  data: Array<PersonalAccountAggregationDataOutput>;
  /** Id = Year-Month-Week */
  id: Scalars['String'];
  /** To which month in a year is this account change associated. Like 8 for September */
  month: Scalars['Int'];
  /** To which week in a year is this account change associated. Like 37 for "Week 37" */
  week: Scalars['Int'];
  /** To which month in a year is this account change associated */
  year: Scalars['Int'];
};

export type Query = {
  __typename?: 'Query';
  /** Returns all available tag images */
  getAllAvailableTagImages: Array<Scalars['String']>;
  getAssetGeneralForSymbol?: Maybe<AssetGeneral>;
  getAssetGeneralForSymbols: Array<AssetGeneral>;
  /** Historical price for an Asset */
  getAssetGeneralHistoricalPricesDataOnDate: AssetGeneralHistoricalPricesData;
  /** Historical prices for an Asset */
  getAssetHistoricalPricesStartToEnd: AssetGeneralHistoricalPrices;
  /** Return authenticated user based on header information */
  getAuthenticatedUser: User;
  /** Returns available accounts for authenticated user */
  getAvailableAccounts: Array<AccountIdentification>;
  /** Returns investment account for authenticated user */
  getInvestmentAccountByUser?: Maybe<InvestmentAccount>;
  /** Returns the investment account history growth, based on the input values */
  getInvestmentAccountGrowth: Array<InvestmentAccountGrowth>;
  /** Returns the investment account history growth, based on the input values */
  getInvestmentAccountGrowthAssets: Array<ChartSeries>;
  /** Returns personal accounts for authenticated user */
  getPersonalAccountByUser?: Maybe<PersonalAccount>;
  /** Returns queried daily data */
  getPersonalAccountDailyData: Array<PersonalAccountDailyDataOutput>;
  /** Returns SOLD transaction in different orders */
  getTopTransactions: InvestmentAccountTransactionWrapperOutput;
  /** Return by added transaction by same date key */
  getTransactionHistory: Array<InvestmentAccountTransactionOutput>;
  /** All asset symbols that were ever inside holdings, some transaction were made by them */
  getTransactionSymbols: Array<Scalars['String']>;
  healthCheck: Scalars['String'];
  /** Init user account with dummy data for a specific user */
  initUserAccountWithDummyData: Scalars['Boolean'];
  /** Search asset based on symbol name */
  searchAssetBySymbol: Array<AssetGeneral>;
  /** Search asset based on symbol identification AAPL, BTC */
  searchAssetBySymbolTickerPrefix: Array<AssetGeneral>;
};


export type QueryGetAssetGeneralForSymbolArgs = {
  input: Scalars['String'];
};


export type QueryGetAssetGeneralForSymbolsArgs = {
  symbols: Array<Scalars['String']>;
};


export type QueryGetAssetGeneralHistoricalPricesDataOnDateArgs = {
  input: AssetGeneralHistoricalPricesInputOnDate;
};


export type QueryGetAssetHistoricalPricesStartToEndArgs = {
  input: AssetGeneralHistoricalPricesInput;
};


export type QueryGetInvestmentAccountGrowthArgs = {
  input: InvestmentAccountGrowthInput;
};


export type QueryGetInvestmentAccountGrowthAssetsArgs = {
  input: InvestmentAccountGrowthInput;
};


export type QueryGetPersonalAccountDailyDataArgs = {
  input: PersonalAccountDailyDataQuery;
};


export type QueryGetTransactionHistoryArgs = {
  input: InvestmentAccountTransactionInput;
};


export type QueryInitUserAccountWithDummyDataArgs = {
  input: Scalars['String'];
};


export type QuerySearchAssetBySymbolArgs = {
  input: Scalars['String'];
};


export type QuerySearchAssetBySymbolTickerPrefixArgs = {
  input: AssetGeneralSearchInput;
};

export type RegisterUserInput = {
  email: Scalars['String'];
  password: Scalars['String'];
  passwordRepeat: Scalars['String'];
};

export enum TagDataType {
  Expense = 'EXPENSE',
  Income = 'INCOME'
}

export type User = {
  __typename?: 'User';
  accountType: UserAccountType;
  authentication: UserAuthentication;
  createdAt: Scalars['String'];
  email: Scalars['String'];
  id: Scalars['String'];
  imageUrl?: Maybe<Scalars['String']>;
  investmentAccountId?: Maybe<Scalars['String']>;
  lastSingInDate: Scalars['String'];
  personalAccountId?: Maybe<Scalars['String']>;
  username: Scalars['String'];
};

export enum UserAccountType {
  Admin = 'ADMIN',
  Nomral = 'NOMRAL',
  Test = 'TEST'
}

export type UserAuthentication = {
  __typename?: 'UserAuthentication';
  authenticationType: AuthenticationType;
};

export type AccountIdentificationFragment = { __typename?: 'AccountIdentification', id: string, name: string, createdAt: string, userId: string, accountType: AccountType };

export type GetAvailableAccountsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAvailableAccountsQuery = { __typename?: 'Query', getAvailableAccounts: Array<{ __typename?: 'AccountIdentification', id: string, name: string, createdAt: string, userId: string, accountType: AccountType }> };

export type AssetGeneralHistoricalPricesDataFragment = { __typename?: 'AssetGeneralHistoricalPricesData', date: string, close: number };

export type AssetGeneralHistoricalPricesFragment = { __typename?: 'AssetGeneralHistoricalPrices', id: string, dateStart: string, dateEnd: string, assetHistoricalPricesData: Array<{ __typename?: 'AssetGeneralHistoricalPricesData', date: string, close: number }> };

export type AssetGeneralQuoteFragment = { __typename?: 'AssetGeneralQuote', symbol: string, symbolImageURL?: string | null, name: string, price: number, changesPercentage: number, change: number, dayLow?: number | null, dayHigh?: number | null, volume: number, yearLow?: number | null, yearHigh?: number | null, marketCap: number, avgVolume?: number | null, sharesOutstanding?: number | null, timestamp: number, eps?: number | null, pe?: number | null, earningsAnnouncement?: string | null };

export type AssetGeneralFragment = { __typename?: 'AssetGeneral', id: string, name: string, symbolImageURL?: string | null, assetIntoLastUpdate: any, assetQuote: { __typename?: 'AssetGeneralQuote', symbol: string, symbolImageURL?: string | null, name: string, price: number, changesPercentage: number, change: number, dayLow?: number | null, dayHigh?: number | null, volume: number, yearLow?: number | null, yearHigh?: number | null, marketCap: number, avgVolume?: number | null, sharesOutstanding?: number | null, timestamp: number, eps?: number | null, pe?: number | null, earningsAnnouncement?: string | null } };

export type GetAssetHistoricalPricesStartToEndQueryVariables = Exact<{
  input: AssetGeneralHistoricalPricesInput;
}>;


export type GetAssetHistoricalPricesStartToEndQuery = { __typename?: 'Query', getAssetHistoricalPricesStartToEnd: { __typename?: 'AssetGeneralHistoricalPrices', id: string, dateStart: string, dateEnd: string, assetHistoricalPricesData: Array<{ __typename?: 'AssetGeneralHistoricalPricesData', date: string, close: number }> } };

export type SearchAssetBySymbolQueryVariables = Exact<{
  input: Scalars['String'];
}>;


export type SearchAssetBySymbolQuery = { __typename?: 'Query', searchAssetBySymbol: Array<{ __typename?: 'AssetGeneral', id: string, name: string, symbolImageURL?: string | null, assetIntoLastUpdate: any, assetQuote: { __typename?: 'AssetGeneralQuote', symbol: string, symbolImageURL?: string | null, name: string, price: number, changesPercentage: number, change: number, dayLow?: number | null, dayHigh?: number | null, volume: number, yearLow?: number | null, yearHigh?: number | null, marketCap: number, avgVolume?: number | null, sharesOutstanding?: number | null, timestamp: number, eps?: number | null, pe?: number | null, earningsAnnouncement?: string | null } }> };

export type SearchAssetBySymbolTickerPrefixQueryVariables = Exact<{
  input: AssetGeneralSearchInput;
}>;


export type SearchAssetBySymbolTickerPrefixQuery = { __typename?: 'Query', searchAssetBySymbolTickerPrefix: Array<{ __typename?: 'AssetGeneral', id: string, name: string, symbolImageURL?: string | null, assetIntoLastUpdate: any, assetQuote: { __typename?: 'AssetGeneralQuote', symbol: string, symbolImageURL?: string | null, name: string, price: number, changesPercentage: number, change: number, dayLow?: number | null, dayHigh?: number | null, volume: number, yearLow?: number | null, yearHigh?: number | null, marketCap: number, avgVolume?: number | null, sharesOutstanding?: number | null, timestamp: number, eps?: number | null, pe?: number | null, earningsAnnouncement?: string | null } }> };

export type GetAssetGeneralForSymbolQueryVariables = Exact<{
  input: Scalars['String'];
}>;


export type GetAssetGeneralForSymbolQuery = { __typename?: 'Query', getAssetGeneralForSymbol?: { __typename?: 'AssetGeneral', id: string, name: string, symbolImageURL?: string | null, assetIntoLastUpdate: any, assetQuote: { __typename?: 'AssetGeneralQuote', symbol: string, symbolImageURL?: string | null, name: string, price: number, changesPercentage: number, change: number, dayLow?: number | null, dayHigh?: number | null, volume: number, yearLow?: number | null, yearHigh?: number | null, marketCap: number, avgVolume?: number | null, sharesOutstanding?: number | null, timestamp: number, eps?: number | null, pe?: number | null, earningsAnnouncement?: string | null } } | null };

export type GetAssetGeneralHistoricalPricesDataOnDateQueryVariables = Exact<{
  input: AssetGeneralHistoricalPricesInputOnDate;
}>;


export type GetAssetGeneralHistoricalPricesDataOnDateQuery = { __typename?: 'Query', getAssetGeneralHistoricalPricesDataOnDate: { __typename?: 'AssetGeneralHistoricalPricesData', date: string, close: number } };

export type ChartSeriesFragment = { __typename?: 'ChartSeries', name: string, data: Array<Array<number>> };

export type InvestmentAccountHoldingHistoryFragment = { __typename?: 'InvestmentAccountHoldingHistory', itemId: string, date: string, units: number, unitValue: number, type: InvestmentAccountHoldingHistoryType, return?: number | null, returnChange?: number | null };

export type InvestmentAccountCashChangeFragment = { __typename?: 'InvestmentAccountCashChange', itemId: string, cashValue: number, type: InvestmentAccountCashChangeType, date: string, imageUrl: string };

export type InvestmentAccountHoldingFragment = { __typename?: 'InvestmentAccountHolding', id: string, assetId: string, investmentAccountId: string, type: InvestmentAccountHoldingType, sector: string, sectorImageUrl: string, holdingHistory: Array<{ __typename?: 'InvestmentAccountHoldingHistory', itemId: string, date: string, units: number, unitValue: number, type: InvestmentAccountHoldingHistoryType, return?: number | null, returnChange?: number | null }> };

export type InvestmentAccountOverviewFragment = { __typename?: 'InvestmentAccount', id: string, name: string, createdAt: string, userId: string, accountType: AccountType };

export type InvestmentAccountActiveHoldingOutputFragment = { __typename?: 'InvestmentAccountActiveHoldingOutput', id: string, assetId: string, investmentAccountId: string, type: InvestmentAccountHoldingType, sector: string, sectorImageUrl?: string | null, units: number, totalValue: number, beakEvenPrice: number, assetGeneral: { __typename?: 'AssetGeneral', id: string, name: string, symbolImageURL?: string | null, assetIntoLastUpdate: any, assetQuote: { __typename?: 'AssetGeneralQuote', symbol: string, symbolImageURL?: string | null, name: string, price: number, changesPercentage: number, change: number, dayLow?: number | null, dayHigh?: number | null, volume: number, yearLow?: number | null, yearHigh?: number | null, marketCap: number, avgVolume?: number | null, sharesOutstanding?: number | null, timestamp: number, eps?: number | null, pe?: number | null, earningsAnnouncement?: string | null } } };

export type InvestmentAccountDetailsFragment = { __typename?: 'InvestmentAccount', id: string, name: string, createdAt: string, userId: string, accountType: AccountType, cashChange: Array<{ __typename?: 'InvestmentAccountCashChange', itemId: string, cashValue: number, type: InvestmentAccountCashChangeType, date: string, imageUrl: string }>, activeHoldings: Array<{ __typename?: 'InvestmentAccountActiveHoldingOutput', id: string, assetId: string, investmentAccountId: string, type: InvestmentAccountHoldingType, sector: string, sectorImageUrl?: string | null, units: number, totalValue: number, beakEvenPrice: number, assetGeneral: { __typename?: 'AssetGeneral', id: string, name: string, symbolImageURL?: string | null, assetIntoLastUpdate: any, assetQuote: { __typename?: 'AssetGeneralQuote', symbol: string, symbolImageURL?: string | null, name: string, price: number, changesPercentage: number, change: number, dayLow?: number | null, dayHigh?: number | null, volume: number, yearLow?: number | null, yearHigh?: number | null, marketCap: number, avgVolume?: number | null, sharesOutstanding?: number | null, timestamp: number, eps?: number | null, pe?: number | null, earningsAnnouncement?: string | null } } }> };

export type InvestmentAccountGrowthFragment = { __typename?: 'InvestmentAccountGrowth', invested: number, date: number, ownedAssets: number };

export type InvestmentAccountTransactionOutputFragment = { __typename?: 'InvestmentAccountTransactionOutput', itemId: string, assetId: string, date: string, createdAt: any, units: number, unitValue: number, type: InvestmentAccountHoldingHistoryType, return?: number | null, returnChange?: number | null, holdingType: InvestmentAccountHoldingType, sector: string };

export type GetInvestmentAccountByUserQueryVariables = Exact<{ [key: string]: never; }>;


export type GetInvestmentAccountByUserQuery = { __typename?: 'Query', getInvestmentAccountByUser?: { __typename?: 'InvestmentAccount', id: string, name: string, createdAt: string, userId: string, accountType: AccountType, cashChange: Array<{ __typename?: 'InvestmentAccountCashChange', itemId: string, cashValue: number, type: InvestmentAccountCashChangeType, date: string, imageUrl: string }>, activeHoldings: Array<{ __typename?: 'InvestmentAccountActiveHoldingOutput', id: string, assetId: string, investmentAccountId: string, type: InvestmentAccountHoldingType, sector: string, sectorImageUrl?: string | null, units: number, totalValue: number, beakEvenPrice: number, assetGeneral: { __typename?: 'AssetGeneral', id: string, name: string, symbolImageURL?: string | null, assetIntoLastUpdate: any, assetQuote: { __typename?: 'AssetGeneralQuote', symbol: string, symbolImageURL?: string | null, name: string, price: number, changesPercentage: number, change: number, dayLow?: number | null, dayHigh?: number | null, volume: number, yearLow?: number | null, yearHigh?: number | null, marketCap: number, avgVolume?: number | null, sharesOutstanding?: number | null, timestamp: number, eps?: number | null, pe?: number | null, earningsAnnouncement?: string | null } } }> } | null };

export type GetInvestmentAccountGrowthQueryVariables = Exact<{
  input: InvestmentAccountGrowthInput;
}>;


export type GetInvestmentAccountGrowthQuery = { __typename?: 'Query', getInvestmentAccountGrowth: Array<{ __typename?: 'InvestmentAccountGrowth', invested: number, date: number, ownedAssets: number }> };

export type GetInvestmentAccountGrowthAssetsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetInvestmentAccountGrowthAssetsQuery = { __typename?: 'Query', getInvestmentAccountGrowthAssets: Array<{ __typename?: 'ChartSeries', name: string, data: Array<Array<number>> }> };

export type CreateInvestmentAccountMutationVariables = Exact<{ [key: string]: never; }>;


export type CreateInvestmentAccountMutation = { __typename?: 'Mutation', createInvestmentAccount: { __typename?: 'InvestmentAccount', id: string, name: string, createdAt: string, userId: string, accountType: AccountType } };

export type EditInvestmentAccountMutationVariables = Exact<{
  input: InvestmentAccountEditInput;
}>;


export type EditInvestmentAccountMutation = { __typename?: 'Mutation', editInvestmentAccount: { __typename?: 'InvestmentAccount', id: string, name: string, createdAt: string, userId: string, accountType: AccountType } };

export type DeleteInvestmentAccountMutationVariables = Exact<{ [key: string]: never; }>;


export type DeleteInvestmentAccountMutation = { __typename?: 'Mutation', deleteInvestmentAccount: { __typename?: 'InvestmentAccount', id: string, name: string, createdAt: string, userId: string, accountType: AccountType } };

export type CreateInvestmentAccountHoldingMutationVariables = Exact<{
  input: InvestmentAccounHoldingCreateInput;
}>;


export type CreateInvestmentAccountHoldingMutation = { __typename?: 'Mutation', createInvestmentAccountHolding: { __typename?: 'InvestmentAccountActiveHoldingOutputWrapper', holdingOutput: { __typename?: 'InvestmentAccountActiveHoldingOutput', id: string, assetId: string, investmentAccountId: string, type: InvestmentAccountHoldingType, sector: string, sectorImageUrl?: string | null, units: number, totalValue: number, beakEvenPrice: number, assetGeneral: { __typename?: 'AssetGeneral', id: string, name: string, symbolImageURL?: string | null, assetIntoLastUpdate: any, assetQuote: { __typename?: 'AssetGeneralQuote', symbol: string, symbolImageURL?: string | null, name: string, price: number, changesPercentage: number, change: number, dayLow?: number | null, dayHigh?: number | null, volume: number, yearLow?: number | null, yearHigh?: number | null, marketCap: number, avgVolume?: number | null, sharesOutstanding?: number | null, timestamp: number, eps?: number | null, pe?: number | null, earningsAnnouncement?: string | null } } }, transaction: { __typename?: 'InvestmentAccountTransactionOutput', itemId: string, assetId: string, date: string, createdAt: any, units: number, unitValue: number, type: InvestmentAccountHoldingHistoryType, return?: number | null, returnChange?: number | null, holdingType: InvestmentAccountHoldingType, sector: string } } };

export type DeleteInvestmentAccountHoldingMutationVariables = Exact<{
  input: InvestmentAccounHoldingHistoryDeleteInput;
}>;


export type DeleteInvestmentAccountHoldingMutation = { __typename?: 'Mutation', deleteInvestmentAccountHolding: { __typename?: 'InvestmentAccountHoldingHistory', itemId: string, date: string, units: number, unitValue: number, type: InvestmentAccountHoldingHistoryType, return?: number | null, returnChange?: number | null } };

export type GetTransactionHistoryQueryVariables = Exact<{
  input: InvestmentAccountTransactionInput;
}>;


export type GetTransactionHistoryQuery = { __typename?: 'Query', getTransactionHistory: Array<{ __typename?: 'InvestmentAccountTransactionOutput', itemId: string, assetId: string, date: string, createdAt: any, units: number, unitValue: number, type: InvestmentAccountHoldingHistoryType, return?: number | null, returnChange?: number | null, holdingType: InvestmentAccountHoldingType, sector: string }> };

export type GetTransactionSymbolsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetTransactionSymbolsQuery = { __typename?: 'Query', getTransactionSymbols: Array<string> };

export type PersonalAccountTagFragment = { __typename?: 'PersonalAccountTag', id: string, createdAt: string, name: string, type: TagDataType, color: string, imageUrl: string, budgetMonthly?: number | null };

export type PersonalAccountDailyDataOutputFragment = { __typename?: 'PersonalAccountDailyDataOutput', id: string, value: number, date: string, tagId: string, description?: string | null, monthlyDataId: string, personalAccountId: string, week: number, tag: { __typename?: 'PersonalAccountTag', id: string, createdAt: string, name: string, type: TagDataType, color: string, imageUrl: string, budgetMonthly?: number | null } };

export type PersonalAccountOverviewFragment = { __typename?: 'PersonalAccount', id: string, name: string, createdAt: string, userId: string, accountType: AccountType };

export type PersonalAccountDetailsFragment = { __typename?: 'PersonalAccount', enabledBudgeting: boolean, id: string, name: string, createdAt: string, userId: string, accountType: AccountType, personalAccountTag: Array<{ __typename?: 'PersonalAccountTag', id: string, createdAt: string, name: string, type: TagDataType, color: string, imageUrl: string, budgetMonthly?: number | null }>, yearlyAggregation: Array<{ __typename?: 'PersonalAccountAggregationDataOutput', value: number, entries: number, tag: { __typename?: 'PersonalAccountTag', id: string, createdAt: string, name: string, type: TagDataType, color: string, imageUrl: string, budgetMonthly?: number | null } }>, weeklyAggregation: Array<{ __typename?: 'PersonalAccountWeeklyAggregationOutput', id: string, year: number, month: number, week: number, data: Array<{ __typename?: 'PersonalAccountAggregationDataOutput', value: number, entries: number, tag: { __typename?: 'PersonalAccountTag', id: string, createdAt: string, name: string, type: TagDataType, color: string, imageUrl: string, budgetMonthly?: number | null } }> }> };

export type PersonalAccountAggregationDataFragment = { __typename?: 'PersonalAccountAggregationDataOutput', value: number, entries: number, tag: { __typename?: 'PersonalAccountTag', id: string, createdAt: string, name: string, type: TagDataType, color: string, imageUrl: string, budgetMonthly?: number | null } };

export type PersonalAccountWeeklyAggregationFragment = { __typename?: 'PersonalAccountWeeklyAggregationOutput', id: string, year: number, month: number, week: number, data: Array<{ __typename?: 'PersonalAccountAggregationDataOutput', value: number, entries: number, tag: { __typename?: 'PersonalAccountTag', id: string, createdAt: string, name: string, type: TagDataType, color: string, imageUrl: string, budgetMonthly?: number | null } }> };

export type GetPersonalAccountAvailableTagImagesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPersonalAccountAvailableTagImagesQuery = { __typename?: 'Query', getAllAvailableTagImages: Array<string> };

export type GetPersonalAccountByUserQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPersonalAccountByUserQuery = { __typename?: 'Query', getPersonalAccountByUser?: { __typename?: 'PersonalAccount', enabledBudgeting: boolean, id: string, name: string, createdAt: string, userId: string, accountType: AccountType, personalAccountTag: Array<{ __typename?: 'PersonalAccountTag', id: string, createdAt: string, name: string, type: TagDataType, color: string, imageUrl: string, budgetMonthly?: number | null }>, yearlyAggregation: Array<{ __typename?: 'PersonalAccountAggregationDataOutput', value: number, entries: number, tag: { __typename?: 'PersonalAccountTag', id: string, createdAt: string, name: string, type: TagDataType, color: string, imageUrl: string, budgetMonthly?: number | null } }>, weeklyAggregation: Array<{ __typename?: 'PersonalAccountWeeklyAggregationOutput', id: string, year: number, month: number, week: number, data: Array<{ __typename?: 'PersonalAccountAggregationDataOutput', value: number, entries: number, tag: { __typename?: 'PersonalAccountTag', id: string, createdAt: string, name: string, type: TagDataType, color: string, imageUrl: string, budgetMonthly?: number | null } }> }> } | null };

export type CreatePersonalAccountMutationVariables = Exact<{ [key: string]: never; }>;


export type CreatePersonalAccountMutation = { __typename?: 'Mutation', createPersonalAccount: { __typename?: 'PersonalAccount', id: string, name: string, createdAt: string, userId: string, accountType: AccountType } };

export type EditPersonalAccountMutationVariables = Exact<{
  input: PersonalAccountEditInput;
}>;


export type EditPersonalAccountMutation = { __typename?: 'Mutation', editPersonalAccount: { __typename?: 'PersonalAccount', id: string, name: string, createdAt: string, userId: string, accountType: AccountType } };

export type DeletePersonalAccountMutationVariables = Exact<{ [key: string]: never; }>;


export type DeletePersonalAccountMutation = { __typename?: 'Mutation', deletePersonalAccount: { __typename?: 'PersonalAccount', id: string, name: string, createdAt: string, userId: string, accountType: AccountType } };

export type CreatePersonalAccountTagMutationVariables = Exact<{
  input: PersonalAccountTagDataCreate;
}>;


export type CreatePersonalAccountTagMutation = { __typename?: 'Mutation', createPersonalAccountTag: { __typename?: 'PersonalAccountTag', id: string, createdAt: string, name: string, type: TagDataType, color: string, imageUrl: string, budgetMonthly?: number | null } };

export type EditPersonalAccountTagMutationVariables = Exact<{
  input: PersonalAccountTagDataEdit;
}>;


export type EditPersonalAccountTagMutation = { __typename?: 'Mutation', editPersonalAccountTag: { __typename?: 'PersonalAccountTag', id: string, createdAt: string, name: string, type: TagDataType, color: string, imageUrl: string, budgetMonthly?: number | null } };

export type DeletePersonalAccountTagMutationVariables = Exact<{
  input: PersonalAccountTagDataDelete;
}>;


export type DeletePersonalAccountTagMutation = { __typename?: 'Mutation', deletePersonalAccountTag: { __typename?: 'PersonalAccountTag', id: string, createdAt: string, name: string, type: TagDataType, color: string, imageUrl: string, budgetMonthly?: number | null } };

export type GetPersonalAccountDailyDataQueryVariables = Exact<{
  input: PersonalAccountDailyDataQuery;
}>;


export type GetPersonalAccountDailyDataQuery = { __typename?: 'Query', getPersonalAccountDailyData: Array<{ __typename?: 'PersonalAccountDailyDataOutput', id: string, value: number, date: string, tagId: string, description?: string | null, monthlyDataId: string, personalAccountId: string, week: number, tag: { __typename?: 'PersonalAccountTag', id: string, createdAt: string, name: string, type: TagDataType, color: string, imageUrl: string, budgetMonthly?: number | null } }> };

export type CreatePersonalAccountDailyEntryMutationVariables = Exact<{
  input: PersonalAccountDailyDataCreate;
}>;


export type CreatePersonalAccountDailyEntryMutation = { __typename?: 'Mutation', createPersonalAccountDailyEntry: { __typename?: 'PersonalAccountDailyDataOutput', id: string, value: number, date: string, tagId: string, description?: string | null, monthlyDataId: string, personalAccountId: string, week: number, tag: { __typename?: 'PersonalAccountTag', id: string, createdAt: string, name: string, type: TagDataType, color: string, imageUrl: string, budgetMonthly?: number | null } } };

export type DeletePersonalAccountDailyEntryMutationVariables = Exact<{
  input: PersonalAccountDailyDataDelete;
}>;


export type DeletePersonalAccountDailyEntryMutation = { __typename?: 'Mutation', deletePersonalAccountDailyEntry: { __typename?: 'PersonalAccountDailyDataOutput', id: string, value: number, date: string, tagId: string, description?: string | null, monthlyDataId: string, personalAccountId: string, week: number, tag: { __typename?: 'PersonalAccountTag', id: string, createdAt: string, name: string, type: TagDataType, color: string, imageUrl: string, budgetMonthly?: number | null } } };

export type EditPersonalAccountDailyEntryMutationVariables = Exact<{
  input: PersonalAccountDailyDataEdit;
}>;


export type EditPersonalAccountDailyEntryMutation = { __typename?: 'Mutation', editPersonalAccountDailyEntry: { __typename?: 'PersonalAccountDailyDataEditOutput', originalDailyData: { __typename?: 'PersonalAccountDailyDataOutput', id: string, value: number, date: string, tagId: string, description?: string | null, monthlyDataId: string, personalAccountId: string, week: number, tag: { __typename?: 'PersonalAccountTag', id: string, createdAt: string, name: string, type: TagDataType, color: string, imageUrl: string, budgetMonthly?: number | null } }, modifiedDailyData: { __typename?: 'PersonalAccountDailyDataOutput', id: string, value: number, date: string, tagId: string, description?: string | null, monthlyDataId: string, personalAccountId: string, week: number, tag: { __typename?: 'PersonalAccountTag', id: string, createdAt: string, name: string, type: TagDataType, color: string, imageUrl: string, budgetMonthly?: number | null } } } };

export type UserFragment = { __typename?: 'User', id: string, createdAt: string, imageUrl?: string | null, username: string, email: string, lastSingInDate: string, accountType: UserAccountType, authentication: { __typename?: 'UserAuthentication', authenticationType: AuthenticationType } };

export type LoggedUserOutputFragment = { __typename?: 'LoggedUserOutput', accessToken: string };

export type LoginUserBasicMutationVariables = Exact<{
  input: LoginUserInput;
}>;


export type LoginUserBasicMutation = { __typename?: 'Mutation', loginBasic: { __typename?: 'LoggedUserOutput', accessToken: string } };

export type RegisterBasicMutationVariables = Exact<{
  input: RegisterUserInput;
}>;


export type RegisterBasicMutation = { __typename?: 'Mutation', registerBasic: { __typename?: 'LoggedUserOutput', accessToken: string } };

export type ResetPasswordMutationVariables = Exact<{
  input: LoginForgotPasswordInput;
}>;


export type ResetPasswordMutation = { __typename?: 'Mutation', resetPassword: boolean };

export type ChangePasswordMutationVariables = Exact<{
  input: ChangePasswordInput;
}>;


export type ChangePasswordMutation = { __typename?: 'Mutation', changePassword: boolean };

export type GetAuthenticatedUserQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAuthenticatedUserQuery = { __typename?: 'Query', getAuthenticatedUser: { __typename?: 'User', id: string, createdAt: string, imageUrl?: string | null, username: string, email: string, lastSingInDate: string, accountType: UserAccountType, authentication: { __typename?: 'UserAuthentication', authenticationType: AuthenticationType } } };

export const AccountIdentificationFragmentDoc = gql`
    fragment AccountIdentification on AccountIdentification {
  id
  name
  createdAt
  userId
  accountType
}
    `;
export const AssetGeneralHistoricalPricesDataFragmentDoc = gql`
    fragment AssetGeneralHistoricalPricesData on AssetGeneralHistoricalPricesData {
  date
  close
}
    `;
export const AssetGeneralHistoricalPricesFragmentDoc = gql`
    fragment AssetGeneralHistoricalPrices on AssetGeneralHistoricalPrices {
  id
  dateStart
  dateEnd
  assetHistoricalPricesData {
    ...AssetGeneralHistoricalPricesData
  }
}
    ${AssetGeneralHistoricalPricesDataFragmentDoc}`;
export const ChartSeriesFragmentDoc = gql`
    fragment ChartSeries on ChartSeries {
  name
  data
}
    `;
export const InvestmentAccountHoldingHistoryFragmentDoc = gql`
    fragment InvestmentAccountHoldingHistory on InvestmentAccountHoldingHistory {
  itemId
  date
  units
  unitValue
  type
  return
  returnChange
}
    `;
export const InvestmentAccountHoldingFragmentDoc = gql`
    fragment InvestmentAccountHolding on InvestmentAccountHolding {
  id
  assetId
  investmentAccountId
  type
  sector
  sectorImageUrl
  holdingHistory {
    ...InvestmentAccountHoldingHistory
  }
}
    ${InvestmentAccountHoldingHistoryFragmentDoc}`;
export const InvestmentAccountOverviewFragmentDoc = gql`
    fragment InvestmentAccountOverview on InvestmentAccount {
  id
  name
  createdAt
  userId
  accountType
}
    `;
export const InvestmentAccountCashChangeFragmentDoc = gql`
    fragment InvestmentAccountCashChange on InvestmentAccountCashChange {
  itemId
  cashValue
  type
  date
  imageUrl
}
    `;
export const AssetGeneralQuoteFragmentDoc = gql`
    fragment AssetGeneralQuote on AssetGeneralQuote {
  symbol
  symbolImageURL
  name
  price
  changesPercentage
  change
  dayLow
  dayHigh
  volume
  yearLow
  yearHigh
  marketCap
  avgVolume
  sharesOutstanding
  timestamp
  eps
  pe
  earningsAnnouncement
}
    `;
export const AssetGeneralFragmentDoc = gql`
    fragment AssetGeneral on AssetGeneral {
  id
  name
  symbolImageURL
  assetIntoLastUpdate
  assetQuote {
    ...AssetGeneralQuote
  }
}
    ${AssetGeneralQuoteFragmentDoc}`;
export const InvestmentAccountActiveHoldingOutputFragmentDoc = gql`
    fragment InvestmentAccountActiveHoldingOutput on InvestmentAccountActiveHoldingOutput {
  id
  assetId
  investmentAccountId
  type
  sector
  sectorImageUrl
  units
  totalValue
  beakEvenPrice
  assetGeneral {
    ...AssetGeneral
  }
}
    ${AssetGeneralFragmentDoc}`;
export const InvestmentAccountDetailsFragmentDoc = gql`
    fragment InvestmentAccountDetails on InvestmentAccount {
  ...InvestmentAccountOverview
  cashChange {
    ...InvestmentAccountCashChange
  }
  activeHoldings {
    ...InvestmentAccountActiveHoldingOutput
  }
}
    ${InvestmentAccountOverviewFragmentDoc}
${InvestmentAccountCashChangeFragmentDoc}
${InvestmentAccountActiveHoldingOutputFragmentDoc}`;
export const InvestmentAccountGrowthFragmentDoc = gql`
    fragment InvestmentAccountGrowth on InvestmentAccountGrowth {
  invested
  date
  ownedAssets
}
    `;
export const InvestmentAccountTransactionOutputFragmentDoc = gql`
    fragment InvestmentAccountTransactionOutput on InvestmentAccountTransactionOutput {
  itemId
  assetId
  date
  createdAt
  units
  unitValue
  type
  return
  returnChange
  holdingType
  sector
}
    `;
export const PersonalAccountTagFragmentDoc = gql`
    fragment PersonalAccountTag on PersonalAccountTag {
  id
  createdAt
  name
  type
  color
  imageUrl
  budgetMonthly
}
    `;
export const PersonalAccountDailyDataOutputFragmentDoc = gql`
    fragment PersonalAccountDailyDataOutput on PersonalAccountDailyDataOutput {
  id
  value
  date
  tagId
  description
  monthlyDataId
  personalAccountId
  week
  tagId
  tag {
    ...PersonalAccountTag
  }
}
    ${PersonalAccountTagFragmentDoc}`;
export const PersonalAccountOverviewFragmentDoc = gql`
    fragment PersonalAccountOverview on PersonalAccount {
  id
  name
  createdAt
  userId
  accountType
}
    `;
export const PersonalAccountAggregationDataFragmentDoc = gql`
    fragment PersonalAccountAggregationData on PersonalAccountAggregationDataOutput {
  value
  entries
  tag {
    ...PersonalAccountTag
  }
}
    ${PersonalAccountTagFragmentDoc}`;
export const PersonalAccountWeeklyAggregationFragmentDoc = gql`
    fragment PersonalAccountWeeklyAggregation on PersonalAccountWeeklyAggregationOutput {
  id
  year
  month
  week
  data {
    ...PersonalAccountAggregationData
  }
}
    ${PersonalAccountAggregationDataFragmentDoc}`;
export const PersonalAccountDetailsFragmentDoc = gql`
    fragment PersonalAccountDetails on PersonalAccount {
  ...PersonalAccountOverview
  enabledBudgeting
  personalAccountTag {
    ...PersonalAccountTag
  }
  yearlyAggregation {
    ...PersonalAccountAggregationData
  }
  weeklyAggregation {
    ...PersonalAccountWeeklyAggregation
  }
}
    ${PersonalAccountOverviewFragmentDoc}
${PersonalAccountTagFragmentDoc}
${PersonalAccountAggregationDataFragmentDoc}
${PersonalAccountWeeklyAggregationFragmentDoc}`;
export const UserFragmentDoc = gql`
    fragment User on User {
  id
  createdAt
  imageUrl
  username
  email
  lastSingInDate
  accountType
  authentication {
    authenticationType
  }
}
    `;
export const LoggedUserOutputFragmentDoc = gql`
    fragment LoggedUserOutput on LoggedUserOutput {
  accessToken
}
    `;
export const GetAvailableAccountsDocument = gql`
    query getAvailableAccounts {
  getAvailableAccounts {
    ...AccountIdentification
  }
}
    ${AccountIdentificationFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class GetAvailableAccountsGQL extends Apollo.Query<GetAvailableAccountsQuery, GetAvailableAccountsQueryVariables> {
    override document = GetAvailableAccountsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetAssetHistoricalPricesStartToEndDocument = gql`
    query GetAssetHistoricalPricesStartToEnd($input: AssetGeneralHistoricalPricesInput!) {
  getAssetHistoricalPricesStartToEnd(input: $input) {
    ...AssetGeneralHistoricalPrices
  }
}
    ${AssetGeneralHistoricalPricesFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class GetAssetHistoricalPricesStartToEndGQL extends Apollo.Query<GetAssetHistoricalPricesStartToEndQuery, GetAssetHistoricalPricesStartToEndQueryVariables> {
    override document = GetAssetHistoricalPricesStartToEndDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const SearchAssetBySymbolDocument = gql`
    query SearchAssetBySymbol($input: String!) {
  searchAssetBySymbol(input: $input) {
    ...AssetGeneral
  }
}
    ${AssetGeneralFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class SearchAssetBySymbolGQL extends Apollo.Query<SearchAssetBySymbolQuery, SearchAssetBySymbolQueryVariables> {
    override document = SearchAssetBySymbolDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const SearchAssetBySymbolTickerPrefixDocument = gql`
    query SearchAssetBySymbolTickerPrefix($input: AssetGeneralSearchInput!) {
  searchAssetBySymbolTickerPrefix(input: $input) {
    ...AssetGeneral
  }
}
    ${AssetGeneralFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class SearchAssetBySymbolTickerPrefixGQL extends Apollo.Query<SearchAssetBySymbolTickerPrefixQuery, SearchAssetBySymbolTickerPrefixQueryVariables> {
    override document = SearchAssetBySymbolTickerPrefixDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetAssetGeneralForSymbolDocument = gql`
    query GetAssetGeneralForSymbol($input: String!) {
  getAssetGeneralForSymbol(input: $input) {
    ...AssetGeneral
  }
}
    ${AssetGeneralFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class GetAssetGeneralForSymbolGQL extends Apollo.Query<GetAssetGeneralForSymbolQuery, GetAssetGeneralForSymbolQueryVariables> {
    override document = GetAssetGeneralForSymbolDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetAssetGeneralHistoricalPricesDataOnDateDocument = gql`
    query GetAssetGeneralHistoricalPricesDataOnDate($input: AssetGeneralHistoricalPricesInputOnDate!) {
  getAssetGeneralHistoricalPricesDataOnDate(input: $input) {
    ...AssetGeneralHistoricalPricesData
  }
}
    ${AssetGeneralHistoricalPricesDataFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class GetAssetGeneralHistoricalPricesDataOnDateGQL extends Apollo.Query<GetAssetGeneralHistoricalPricesDataOnDateQuery, GetAssetGeneralHistoricalPricesDataOnDateQueryVariables> {
    override document = GetAssetGeneralHistoricalPricesDataOnDateDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetInvestmentAccountByUserDocument = gql`
    query getInvestmentAccountByUser {
  getInvestmentAccountByUser {
    ...InvestmentAccountDetails
  }
}
    ${InvestmentAccountDetailsFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class GetInvestmentAccountByUserGQL extends Apollo.Query<GetInvestmentAccountByUserQuery, GetInvestmentAccountByUserQueryVariables> {
    override document = GetInvestmentAccountByUserDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetInvestmentAccountGrowthDocument = gql`
    query GetInvestmentAccountGrowth($input: InvestmentAccountGrowthInput!) {
  getInvestmentAccountGrowth(input: $input) {
    ...InvestmentAccountGrowth
  }
}
    ${InvestmentAccountGrowthFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class GetInvestmentAccountGrowthGQL extends Apollo.Query<GetInvestmentAccountGrowthQuery, GetInvestmentAccountGrowthQueryVariables> {
    override document = GetInvestmentAccountGrowthDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetInvestmentAccountGrowthAssetsDocument = gql`
    query getInvestmentAccountGrowthAssets {
  getInvestmentAccountGrowthAssets(input: {}) {
    ...ChartSeries
  }
}
    ${ChartSeriesFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class GetInvestmentAccountGrowthAssetsGQL extends Apollo.Query<GetInvestmentAccountGrowthAssetsQuery, GetInvestmentAccountGrowthAssetsQueryVariables> {
    override document = GetInvestmentAccountGrowthAssetsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CreateInvestmentAccountDocument = gql`
    mutation CreateInvestmentAccount {
  createInvestmentAccount {
    ...InvestmentAccountOverview
  }
}
    ${InvestmentAccountOverviewFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class CreateInvestmentAccountGQL extends Apollo.Mutation<CreateInvestmentAccountMutation, CreateInvestmentAccountMutationVariables> {
    override document = CreateInvestmentAccountDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const EditInvestmentAccountDocument = gql`
    mutation EditInvestmentAccount($input: InvestmentAccountEditInput!) {
  editInvestmentAccount(input: $input) {
    ...InvestmentAccountOverview
  }
}
    ${InvestmentAccountOverviewFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class EditInvestmentAccountGQL extends Apollo.Mutation<EditInvestmentAccountMutation, EditInvestmentAccountMutationVariables> {
    override document = EditInvestmentAccountDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DeleteInvestmentAccountDocument = gql`
    mutation DeleteInvestmentAccount {
  deleteInvestmentAccount {
    ...InvestmentAccountOverview
  }
}
    ${InvestmentAccountOverviewFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class DeleteInvestmentAccountGQL extends Apollo.Mutation<DeleteInvestmentAccountMutation, DeleteInvestmentAccountMutationVariables> {
    override document = DeleteInvestmentAccountDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CreateInvestmentAccountHoldingDocument = gql`
    mutation CreateInvestmentAccountHolding($input: InvestmentAccounHoldingCreateInput!) {
  createInvestmentAccountHolding(input: $input) {
    holdingOutput {
      ...InvestmentAccountActiveHoldingOutput
    }
    transaction {
      ...InvestmentAccountTransactionOutput
    }
  }
}
    ${InvestmentAccountActiveHoldingOutputFragmentDoc}
${InvestmentAccountTransactionOutputFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class CreateInvestmentAccountHoldingGQL extends Apollo.Mutation<CreateInvestmentAccountHoldingMutation, CreateInvestmentAccountHoldingMutationVariables> {
    override document = CreateInvestmentAccountHoldingDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DeleteInvestmentAccountHoldingDocument = gql`
    mutation DeleteInvestmentAccountHolding($input: InvestmentAccounHoldingHistoryDeleteInput!) {
  deleteInvestmentAccountHolding(input: $input) {
    ...InvestmentAccountHoldingHistory
  }
}
    ${InvestmentAccountHoldingHistoryFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class DeleteInvestmentAccountHoldingGQL extends Apollo.Mutation<DeleteInvestmentAccountHoldingMutation, DeleteInvestmentAccountHoldingMutationVariables> {
    override document = DeleteInvestmentAccountHoldingDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetTransactionHistoryDocument = gql`
    query GetTransactionHistory($input: InvestmentAccountTransactionInput!) {
  getTransactionHistory(input: $input) {
    ...InvestmentAccountTransactionOutput
  }
}
    ${InvestmentAccountTransactionOutputFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class GetTransactionHistoryGQL extends Apollo.Query<GetTransactionHistoryQuery, GetTransactionHistoryQueryVariables> {
    override document = GetTransactionHistoryDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetTransactionSymbolsDocument = gql`
    query GetTransactionSymbols {
  getTransactionSymbols
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GetTransactionSymbolsGQL extends Apollo.Query<GetTransactionSymbolsQuery, GetTransactionSymbolsQueryVariables> {
    override document = GetTransactionSymbolsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetPersonalAccountAvailableTagImagesDocument = gql`
    query getPersonalAccountAvailableTagImages {
  getAllAvailableTagImages
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GetPersonalAccountAvailableTagImagesGQL extends Apollo.Query<GetPersonalAccountAvailableTagImagesQuery, GetPersonalAccountAvailableTagImagesQueryVariables> {
    override document = GetPersonalAccountAvailableTagImagesDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetPersonalAccountByUserDocument = gql`
    query GetPersonalAccountByUser {
  getPersonalAccountByUser {
    ...PersonalAccountDetails
  }
}
    ${PersonalAccountDetailsFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class GetPersonalAccountByUserGQL extends Apollo.Query<GetPersonalAccountByUserQuery, GetPersonalAccountByUserQueryVariables> {
    override document = GetPersonalAccountByUserDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CreatePersonalAccountDocument = gql`
    mutation CreatePersonalAccount {
  createPersonalAccount {
    ...PersonalAccountOverview
  }
}
    ${PersonalAccountOverviewFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class CreatePersonalAccountGQL extends Apollo.Mutation<CreatePersonalAccountMutation, CreatePersonalAccountMutationVariables> {
    override document = CreatePersonalAccountDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const EditPersonalAccountDocument = gql`
    mutation EditPersonalAccount($input: PersonalAccountEditInput!) {
  editPersonalAccount(input: $input) {
    ...PersonalAccountOverview
  }
}
    ${PersonalAccountOverviewFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class EditPersonalAccountGQL extends Apollo.Mutation<EditPersonalAccountMutation, EditPersonalAccountMutationVariables> {
    override document = EditPersonalAccountDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DeletePersonalAccountDocument = gql`
    mutation DeletePersonalAccount {
  deletePersonalAccount {
    ...PersonalAccountOverview
  }
}
    ${PersonalAccountOverviewFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class DeletePersonalAccountGQL extends Apollo.Mutation<DeletePersonalAccountMutation, DeletePersonalAccountMutationVariables> {
    override document = DeletePersonalAccountDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CreatePersonalAccountTagDocument = gql`
    mutation CreatePersonalAccountTag($input: PersonalAccountTagDataCreate!) {
  createPersonalAccountTag(input: $input) {
    ...PersonalAccountTag
  }
}
    ${PersonalAccountTagFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class CreatePersonalAccountTagGQL extends Apollo.Mutation<CreatePersonalAccountTagMutation, CreatePersonalAccountTagMutationVariables> {
    override document = CreatePersonalAccountTagDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const EditPersonalAccountTagDocument = gql`
    mutation EditPersonalAccountTag($input: PersonalAccountTagDataEdit!) {
  editPersonalAccountTag(input: $input) {
    ...PersonalAccountTag
  }
}
    ${PersonalAccountTagFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class EditPersonalAccountTagGQL extends Apollo.Mutation<EditPersonalAccountTagMutation, EditPersonalAccountTagMutationVariables> {
    override document = EditPersonalAccountTagDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DeletePersonalAccountTagDocument = gql`
    mutation DeletePersonalAccountTag($input: PersonalAccountTagDataDelete!) {
  deletePersonalAccountTag(input: $input) {
    ...PersonalAccountTag
  }
}
    ${PersonalAccountTagFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class DeletePersonalAccountTagGQL extends Apollo.Mutation<DeletePersonalAccountTagMutation, DeletePersonalAccountTagMutationVariables> {
    override document = DeletePersonalAccountTagDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetPersonalAccountDailyDataDocument = gql`
    query GetPersonalAccountDailyData($input: PersonalAccountDailyDataQuery!) {
  getPersonalAccountDailyData(input: $input) {
    ...PersonalAccountDailyDataOutput
  }
}
    ${PersonalAccountDailyDataOutputFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class GetPersonalAccountDailyDataGQL extends Apollo.Query<GetPersonalAccountDailyDataQuery, GetPersonalAccountDailyDataQueryVariables> {
    override document = GetPersonalAccountDailyDataDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CreatePersonalAccountDailyEntryDocument = gql`
    mutation CreatePersonalAccountDailyEntry($input: PersonalAccountDailyDataCreate!) {
  createPersonalAccountDailyEntry(input: $input) {
    ...PersonalAccountDailyDataOutput
  }
}
    ${PersonalAccountDailyDataOutputFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class CreatePersonalAccountDailyEntryGQL extends Apollo.Mutation<CreatePersonalAccountDailyEntryMutation, CreatePersonalAccountDailyEntryMutationVariables> {
    override document = CreatePersonalAccountDailyEntryDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DeletePersonalAccountDailyEntryDocument = gql`
    mutation DeletePersonalAccountDailyEntry($input: PersonalAccountDailyDataDelete!) {
  deletePersonalAccountDailyEntry(input: $input) {
    ...PersonalAccountDailyDataOutput
  }
}
    ${PersonalAccountDailyDataOutputFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class DeletePersonalAccountDailyEntryGQL extends Apollo.Mutation<DeletePersonalAccountDailyEntryMutation, DeletePersonalAccountDailyEntryMutationVariables> {
    override document = DeletePersonalAccountDailyEntryDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const EditPersonalAccountDailyEntryDocument = gql`
    mutation EditPersonalAccountDailyEntry($input: PersonalAccountDailyDataEdit!) {
  editPersonalAccountDailyEntry(input: $input) {
    originalDailyData {
      ...PersonalAccountDailyDataOutput
    }
    modifiedDailyData {
      ...PersonalAccountDailyDataOutput
    }
  }
}
    ${PersonalAccountDailyDataOutputFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class EditPersonalAccountDailyEntryGQL extends Apollo.Mutation<EditPersonalAccountDailyEntryMutation, EditPersonalAccountDailyEntryMutationVariables> {
    override document = EditPersonalAccountDailyEntryDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const LoginUserBasicDocument = gql`
    mutation LoginUserBasic($input: LoginUserInput!) {
  loginBasic(input: $input) {
    ...LoggedUserOutput
  }
}
    ${LoggedUserOutputFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class LoginUserBasicGQL extends Apollo.Mutation<LoginUserBasicMutation, LoginUserBasicMutationVariables> {
    override document = LoginUserBasicDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const RegisterBasicDocument = gql`
    mutation RegisterBasic($input: RegisterUserInput!) {
  registerBasic(input: $input) {
    ...LoggedUserOutput
  }
}
    ${LoggedUserOutputFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class RegisterBasicGQL extends Apollo.Mutation<RegisterBasicMutation, RegisterBasicMutationVariables> {
    override document = RegisterBasicDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const ResetPasswordDocument = gql`
    mutation ResetPassword($input: LoginForgotPasswordInput!) {
  resetPassword(input: $input)
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class ResetPasswordGQL extends Apollo.Mutation<ResetPasswordMutation, ResetPasswordMutationVariables> {
    override document = ResetPasswordDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const ChangePasswordDocument = gql`
    mutation ChangePassword($input: ChangePasswordInput!) {
  changePassword(input: $input)
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class ChangePasswordGQL extends Apollo.Mutation<ChangePasswordMutation, ChangePasswordMutationVariables> {
    override document = ChangePasswordDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetAuthenticatedUserDocument = gql`
    query GetAuthenticatedUser {
  getAuthenticatedUser {
    ...User
  }
}
    ${UserFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class GetAuthenticatedUserGQL extends Apollo.Query<GetAuthenticatedUserQuery, GetAuthenticatedUserQueryVariables> {
    override document = GetAuthenticatedUserDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }