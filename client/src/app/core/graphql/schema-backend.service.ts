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

export enum Authentication_Providers {
  BasicAuth = 'BASIC_AUTH',
  Google = 'GOOGLE'
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
  isCrypto?: InputMaybe<Scalars['Boolean']>;
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

export enum Data_Modification {
  Created = 'CREATED',
  Removed = 'REMOVED'
}

export type HoldingInputData = {
  /** Date when we added this holding to our investment account */
  date: Scalars['String'];
  /** How many units of this symbol user has */
  units: Scalars['Int'];
};

export type InvestmentAccounHoldingCreateInput = {
  holdingInputData: HoldingInputData;
  /** Investment account associated with the asset */
  investmentAccountId: Scalars['String'];
  isCrypto: Scalars['Boolean'];
  /** Symbol ID */
  symbol: Scalars['String'];
  type: InvestmentAccountHoldingHistoryType;
};

export type InvestmentAccounHoldingHistoryDeleteInput = {
  /** Investment account associated with the asset */
  investmentAccountId: Scalars['String'];
  /** Id of the item the user wants to remove */
  itemId: Scalars['String'];
  /** Symbol ID */
  symbol: Scalars['String'];
};

export type InvestmentAccount = {
  __typename?: 'InvestmentAccount';
  /** Returns active holdings from an investment account, at least one unit is owned */
  activeHoldings: Array<InvestmentAccountActiveHoldingOutput>;
  /** History of changed cash value */
  cashChange: Array<InvestmentAccountCashChange>;
  /** Date time when account was created */
  createdAt: Scalars['String'];
  /** Holding history of this asset */
  holdings: Array<InvestmentAccountHolding>;
  id: Scalars['String'];
  /** custom name for personal account */
  name: Scalars['String'];
  /** Reference to User.ID who created this investment account */
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
  totalValue: Scalars['Float'];
  type: InvestmentAccountHoldingType;
  units: Scalars['Float'];
};

export type InvestmentAccountCashChange = {
  __typename?: 'InvestmentAccountCashChange';
  cashValue: Scalars['Float'];
  /** Format yyyy-MM-DD */
  date: Scalars['String'];
  itemId: Scalars['String'];
  type: InvestmentAccountCashChangeType;
};

export type InvestmentAccountCashChangeSubscription = {
  __typename?: 'InvestmentAccountCashChangeSubscription';
  accountId: Scalars['String'];
  data: InvestmentAccountCashChange;
  modification: Data_Modification;
};

export enum InvestmentAccountCashChangeType {
  AssetOperation = 'ASSET_OPERATION',
  Deposit = 'DEPOSIT',
  Withdrawal = 'WITHDRAWAL'
}

export type InvestmentAccountCashCreateInput = {
  cashValue: Scalars['Float'];
  /** What date to associate cash account change */
  date: Scalars['String'];
  investmentAccountId: Scalars['String'];
  type: InvestmentAccountCashChangeType;
};

export type InvestmentAccountCashDeleteInput = {
  investmentAccountId: Scalars['String'];
  /** If value is assigned, it will change existing cash value or create a new entry */
  itemId: Scalars['String'];
};

export type InvestmentAccountCashEditInput = {
  cashCurrent: Scalars['Float'];
  /** What date to associate cash account change */
  date: Scalars['String'];
  investmentAccountId: Scalars['String'];
  /** If value is assigned, it will change existing cash value or create a new entry */
  itemId: Scalars['String'];
};

export type InvestmentAccountCreateInput = {
  name: Scalars['String'];
};

export type InvestmentAccountEditInput = {
  investmentAccountId: Scalars['String'];
  name: Scalars['String'];
};

export type InvestmentAccountGrowth = {
  __typename?: 'InvestmentAccountGrowth';
  cash: Scalars['Float'];
  date: Scalars['String'];
  /** Accumulation of all invested assets in that specific date */
  invested: Scalars['Float'];
  ownedAssets: Scalars['Float'];
};

export type InvestmentAccountGrowthInput = {
  investmenAccountId: Scalars['String'];
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
  type: InvestmentAccountHoldingType;
};

export type InvestmentAccountHoldingHistory = {
  __typename?: 'InvestmentAccountHoldingHistory';
  /** Symbol ID -> AAPL, MSFT, BTC */
  assetId: Scalars['String'];
  /** InvestmentAccountCashChange.ID if holding history affected cash change */
  cashChangeId: Scalars['String'];
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
  accountId: Scalars['String'];
  /** Include symbols IDs for filtering, if empty, show all */
  filterSymbols?: InputMaybe<Array<Scalars['String']>>;
  /** Put false if only SELL operation to get */
  includeBuyOperation?: InputMaybe<Scalars['Boolean']>;
  offset?: InputMaybe<Scalars['Int']>;
  /** Put false to order DESC */
  orderAsc?: InputMaybe<Scalars['Boolean']>;
  orderType?: InputMaybe<InvestmentAccountTransactionInputOrderType>;
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
  /** InvestmentAccountCashChange.ID if holding history affected cash change */
  cashChangeId: Scalars['String'];
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
  bestValueChage: Array<InvestmentAccountTransactionOutput>;
  /** list of best transaction by value change */
  worstValue: Array<InvestmentAccountTransactionOutput>;
  /** list of worst transaction by value change (%) */
  worstValueChage: Array<InvestmentAccountTransactionOutput>;
};

export type LoggedUserOutput = {
  __typename?: 'LoggedUserOutput';
  /** Generated user's accessToken, encoded RequestUser */
  accessToken: Scalars['String'];
  /** Return the authenticated user object */
  user: User;
};

export type LoginSocialInput = {
  accessToken: Scalars['String'];
  provider: Authentication_Providers;
};

export type LoginUserInput = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createInvestmentAccount: InvestmentAccount;
  createInvestmentAccountCashe: InvestmentAccountCashChange;
  createInvestmentAccountHolding: InvestmentAccountActiveHoldingOutput;
  createPersonalAccount: PersonalAccount;
  createPersonalAccountDailyEntry: PersonalAccountDailyData;
  /** Returns the ID of the removed investment account */
  deleteInvestmentAccount: InvestmentAccount;
  deleteInvestmentAccountCashe: InvestmentAccountCashChange;
  deleteInvestmentAccountHolding: InvestmentAccountHoldingHistory;
  deletePersonalAccount: PersonalAccount;
  deletePersonalAccountDailyEntry: PersonalAccountDailyData;
  editInvestmentAccount: InvestmentAccount;
  editInvestmentAccountCashe: InvestmentAccountCashChange;
  editPersonalAccount: PersonalAccount;
  editPersonalAccountDailyEntry: PersonalAccountDailyDataEditOutput;
  loginBasic: LoggedUserOutput;
  loginSocial: LoggedUserOutput;
  registerBasic: LoggedUserOutput;
};


export type MutationCreateInvestmentAccountArgs = {
  input: InvestmentAccountCreateInput;
};


export type MutationCreateInvestmentAccountCasheArgs = {
  input: InvestmentAccountCashCreateInput;
};


export type MutationCreateInvestmentAccountHoldingArgs = {
  input: InvestmentAccounHoldingCreateInput;
};


export type MutationCreatePersonalAccountArgs = {
  input: PersonalAccountCreateInput;
};


export type MutationCreatePersonalAccountDailyEntryArgs = {
  input: PersonalAccountDailyDataCreate;
};


export type MutationDeleteInvestmentAccountArgs = {
  input: Scalars['String'];
};


export type MutationDeleteInvestmentAccountCasheArgs = {
  input: InvestmentAccountCashDeleteInput;
};


export type MutationDeleteInvestmentAccountHoldingArgs = {
  input: InvestmentAccounHoldingHistoryDeleteInput;
};


export type MutationDeletePersonalAccountArgs = {
  input: Scalars['String'];
};


export type MutationDeletePersonalAccountDailyEntryArgs = {
  input: PersonalAccountDailyDataDelete;
};


export type MutationEditInvestmentAccountArgs = {
  input: InvestmentAccountEditInput;
};


export type MutationEditInvestmentAccountCasheArgs = {
  input: InvestmentAccountCashEditInput;
};


export type MutationEditPersonalAccountArgs = {
  input: PersonalAccountEditInput;
};


export type MutationEditPersonalAccountDailyEntryArgs = {
  input: PersonalAccountDailyDataEdit;
};


export type MutationLoginBasicArgs = {
  input: LoginUserInput;
};


export type MutationLoginSocialArgs = {
  input: LoginSocialInput;
};


export type MutationRegisterBasicArgs = {
  input: RegisterUserInput;
};

export type PersonalAccount = {
  __typename?: 'PersonalAccount';
  createdAt: Scalars['String'];
  id: Scalars['String'];
  monthlyData: Array<PersonalAccountMonthlyData>;
  name: Scalars['String'];
  userId: Scalars['String'];
  weeklyAggregaton: Array<PersonalAccountWeeklyAggregationOutput>;
  yearlyAggregaton: Array<PersonalAccountAggregationDataOutput>;
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

export type PersonalAccountCreateInput = {
  name: Scalars['String'];
};

export type PersonalAccountDailyData = {
  __typename?: 'PersonalAccountDailyData';
  date: Scalars['String'];
  /** Random ID to identify the entity */
  id: Scalars['String'];
  /** Reference to PersonalAccountMonthlyData.id */
  monthlyDataId: Scalars['String'];
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

export type PersonalAccountDailyDataCreate = {
  /** Date (past, current, future) to which assign this entry. Timezone difference for current date */
  date: Scalars['String'];
  /** Id of personal account to which this entry will be added */
  personalAccountId: Scalars['String'];
  /** Which tag to associate this entry */
  tagId: Scalars['String'];
  /** How much value (amount) shall be added to the account */
  value: Scalars['Float'];
};

export type PersonalAccountDailyDataDelete = {
  dailyDataId: Scalars['String'];
  monthlyDataId: Scalars['String'];
  personalAccountId: Scalars['String'];
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
  modifiedDailyData: PersonalAccountDailyData;
  /** Original object before edit */
  originalDailyData: PersonalAccountDailyData;
};

export type PersonalAccountEditInput = {
  id: Scalars['String'];
  name: Scalars['String'];
};

export type PersonalAccountMonthlyData = {
  __typename?: 'PersonalAccountMonthlyData';
  /** List of daily expenses user has made during this month period */
  dailyData: Array<PersonalAccountDailyData>;
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
  /** Color of the tag */
  color: Scalars['String'];
  createdAt: Scalars['String'];
  id: Scalars['ID'];
  /** True only for default Tags, shared accross every user */
  isDefault: Scalars['String'];
  modifiedAt: Scalars['String'];
  /** Name of the tag */
  name: Scalars['String'];
  /** Reference to PersonalAccount.id, if this tag is specific for some personal account. For detault tags this is null */
  personalAccountId?: Maybe<Scalars['String']>;
  type: TagDataType;
  /** Reference to User.id, person who has created this personcal account tag. For detault tags this is null */
  userId?: Maybe<Scalars['String']>;
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
  getAssetGeneralForSymbol?: Maybe<AssetGeneral>;
  getAssetGeneralForSymbols: Array<AssetGeneral>;
  /** Historical price for an Asset */
  getAssetGeneralHistoricalPricesDataOnDate: AssetGeneralHistoricalPricesData;
  /** Historical prices for an Asset */
  getAssetHistoricalPricesStartToEnd: AssetGeneralHistoricalPrices;
  /** Returns default tags that are shared cross every user */
  getDefaultTags: Array<PersonalAccountTag>;
  /** Returns investment account by id */
  getInvestmentAccountById: InvestmentAccount;
  /** Returns the investment account history growth, based on the input values */
  getInvestmentAccountGrowth: Array<InvestmentAccountGrowth>;
  /** Returns all investment accounts for the requester */
  getInvestmentAccounts: Array<InvestmentAccount>;
  /** Returns personal accounts by Id */
  getPersonalAccountById: PersonalAccount;
  /** Returns monthly data by id */
  getPersonalAccountMonthlyDataById: PersonalAccountMonthlyData;
  /** Returns all personal accounts for the requester */
  getPersonalAccounts: Array<PersonalAccount>;
  /** Returns SOLD transaction in different orders */
  getTopTransactions: InvestmentAccountTransactionWrapperOutput;
  /** Return by added transaction by same date key */
  getTransactionHistory: Array<InvestmentAccountTransactionOutput>;
  /** All asset symbols that were ever inside holdings */
  getTransactionSymbols: Array<Scalars['String']>;
  healthCheck: Scalars['String'];
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


export type QueryGetInvestmentAccountByIdArgs = {
  input: Scalars['String'];
};


export type QueryGetInvestmentAccountGrowthArgs = {
  input: InvestmentAccountGrowthInput;
};


export type QueryGetPersonalAccountByIdArgs = {
  input: Scalars['String'];
};


export type QueryGetPersonalAccountMonthlyDataByIdArgs = {
  input: Scalars['String'];
};


export type QueryGetTopTransactionsArgs = {
  input: Scalars['String'];
};


export type QueryGetTransactionHistoryArgs = {
  input: InvestmentAccountTransactionInput;
};


export type QueryGetTransactionSymbolsArgs = {
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

export type Subscription = {
  __typename?: 'Subscription';
  cashModification: InvestmentAccountCashChangeSubscription;
  createdMonthlyData: PersonalAccountMonthlyData;
};

export enum TagDataType {
  Expense = 'EXPENSE',
  Income = 'INCOME'
}

export type User = {
  __typename?: 'User';
  createdAt: Scalars['String'];
  email: Scalars['String'];
  id: Scalars['String'];
  imageUrl?: Maybe<Scalars['String']>;
  lastSingInDate: Scalars['String'];
  username: Scalars['String'];
};

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

export type InvestmentAccountHoldingHistoryFragment = { __typename?: 'InvestmentAccountHoldingHistory', itemId: string, date: string, units: number, unitValue: number, type: InvestmentAccountHoldingHistoryType, return?: number | null, returnChange?: number | null, cashChangeId: string };

export type InvestmentAccountCashChangeFragment = { __typename?: 'InvestmentAccountCashChange', itemId: string, cashValue: number, type: InvestmentAccountCashChangeType, date: string };

export type InvestmentAccountHoldingFragment = { __typename?: 'InvestmentAccountHolding', id: string, assetId: string, investmentAccountId: string, type: InvestmentAccountHoldingType, sector: string, holdingHistory: Array<{ __typename?: 'InvestmentAccountHoldingHistory', itemId: string, date: string, units: number, unitValue: number, type: InvestmentAccountHoldingHistoryType, return?: number | null, returnChange?: number | null, cashChangeId: string }> };

export type InvestmentAccountOverviewFragment = { __typename?: 'InvestmentAccount', id: string, name: string, createdAt: string, userId: string };

export type InvestmentAccountActiveHoldingOutputFragment = { __typename?: 'InvestmentAccountActiveHoldingOutput', id: string, assetId: string, investmentAccountId: string, type: InvestmentAccountHoldingType, sector: string, units: number, totalValue: number, beakEvenPrice: number, assetGeneral: { __typename?: 'AssetGeneral', id: string, name: string, symbolImageURL?: string | null, assetIntoLastUpdate: any, assetQuote: { __typename?: 'AssetGeneralQuote', symbol: string, symbolImageURL?: string | null, name: string, price: number, changesPercentage: number, change: number, dayLow?: number | null, dayHigh?: number | null, volume: number, yearLow?: number | null, yearHigh?: number | null, marketCap: number, avgVolume?: number | null, sharesOutstanding?: number | null, timestamp: number, eps?: number | null, pe?: number | null, earningsAnnouncement?: string | null } } };

export type InvestmentAccountFragment = { __typename?: 'InvestmentAccount', id: string, name: string, createdAt: string, userId: string, cashChange: Array<{ __typename?: 'InvestmentAccountCashChange', itemId: string, cashValue: number, type: InvestmentAccountCashChangeType, date: string }>, activeHoldings: Array<{ __typename?: 'InvestmentAccountActiveHoldingOutput', id: string, assetId: string, investmentAccountId: string, type: InvestmentAccountHoldingType, sector: string, units: number, totalValue: number, beakEvenPrice: number, assetGeneral: { __typename?: 'AssetGeneral', id: string, name: string, symbolImageURL?: string | null, assetIntoLastUpdate: any, assetQuote: { __typename?: 'AssetGeneralQuote', symbol: string, symbolImageURL?: string | null, name: string, price: number, changesPercentage: number, change: number, dayLow?: number | null, dayHigh?: number | null, volume: number, yearLow?: number | null, yearHigh?: number | null, marketCap: number, avgVolume?: number | null, sharesOutstanding?: number | null, timestamp: number, eps?: number | null, pe?: number | null, earningsAnnouncement?: string | null } } }> };

export type InvestmentAccountGrowthFragment = { __typename?: 'InvestmentAccountGrowth', invested: number, cash: number, date: string, ownedAssets: number };

export type InvestmentAccountTransactionOutputFragment = { __typename?: 'InvestmentAccountTransactionOutput', itemId: string, assetId: string, cashChangeId: string, date: string, createdAt: any, units: number, unitValue: number, type: InvestmentAccountHoldingHistoryType, return?: number | null, returnChange?: number | null, holdingType: InvestmentAccountHoldingType, sector: string };

export type GetInvestmentAccountByIdQueryVariables = Exact<{
  input: Scalars['String'];
}>;


export type GetInvestmentAccountByIdQuery = { __typename?: 'Query', getInvestmentAccountById: { __typename?: 'InvestmentAccount', id: string, name: string, createdAt: string, userId: string, cashChange: Array<{ __typename?: 'InvestmentAccountCashChange', itemId: string, cashValue: number, type: InvestmentAccountCashChangeType, date: string }>, activeHoldings: Array<{ __typename?: 'InvestmentAccountActiveHoldingOutput', id: string, assetId: string, investmentAccountId: string, type: InvestmentAccountHoldingType, sector: string, units: number, totalValue: number, beakEvenPrice: number, assetGeneral: { __typename?: 'AssetGeneral', id: string, name: string, symbolImageURL?: string | null, assetIntoLastUpdate: any, assetQuote: { __typename?: 'AssetGeneralQuote', symbol: string, symbolImageURL?: string | null, name: string, price: number, changesPercentage: number, change: number, dayLow?: number | null, dayHigh?: number | null, volume: number, yearLow?: number | null, yearHigh?: number | null, marketCap: number, avgVolume?: number | null, sharesOutstanding?: number | null, timestamp: number, eps?: number | null, pe?: number | null, earningsAnnouncement?: string | null } } }> } };

export type GetInvestmentAccountsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetInvestmentAccountsQuery = { __typename?: 'Query', getInvestmentAccounts: Array<{ __typename?: 'InvestmentAccount', id: string, name: string, createdAt: string, userId: string }> };

export type GetInvestmentAccountGrowthQueryVariables = Exact<{
  input: InvestmentAccountGrowthInput;
}>;


export type GetInvestmentAccountGrowthQuery = { __typename?: 'Query', getInvestmentAccountGrowth: Array<{ __typename?: 'InvestmentAccountGrowth', invested: number, cash: number, date: string, ownedAssets: number }> };

export type CreateInvestmentAccountMutationVariables = Exact<{
  input: InvestmentAccountCreateInput;
}>;


export type CreateInvestmentAccountMutation = { __typename?: 'Mutation', createInvestmentAccount: { __typename?: 'InvestmentAccount', id: string, name: string, createdAt: string, userId: string } };

export type EditInvestmentAccountMutationVariables = Exact<{
  input: InvestmentAccountEditInput;
}>;


export type EditInvestmentAccountMutation = { __typename?: 'Mutation', editInvestmentAccount: { __typename?: 'InvestmentAccount', id: string, name: string, createdAt: string, userId: string } };

export type DeleteInvestmentAccountMutationVariables = Exact<{
  input: Scalars['String'];
}>;


export type DeleteInvestmentAccountMutation = { __typename?: 'Mutation', deleteInvestmentAccount: { __typename?: 'InvestmentAccount', id: string, name: string, createdAt: string, userId: string } };

export type CreateInvestmentAccountHoldingMutationVariables = Exact<{
  input: InvestmentAccounHoldingCreateInput;
}>;


export type CreateInvestmentAccountHoldingMutation = { __typename?: 'Mutation', createInvestmentAccountHolding: { __typename?: 'InvestmentAccountActiveHoldingOutput', id: string, assetId: string, investmentAccountId: string, type: InvestmentAccountHoldingType, sector: string, units: number, totalValue: number, beakEvenPrice: number, assetGeneral: { __typename?: 'AssetGeneral', id: string, name: string, symbolImageURL?: string | null, assetIntoLastUpdate: any, assetQuote: { __typename?: 'AssetGeneralQuote', symbol: string, symbolImageURL?: string | null, name: string, price: number, changesPercentage: number, change: number, dayLow?: number | null, dayHigh?: number | null, volume: number, yearLow?: number | null, yearHigh?: number | null, marketCap: number, avgVolume?: number | null, sharesOutstanding?: number | null, timestamp: number, eps?: number | null, pe?: number | null, earningsAnnouncement?: string | null } } } };

export type DeleteInvestmentAccountHoldingMutationVariables = Exact<{
  input: InvestmentAccounHoldingHistoryDeleteInput;
}>;


export type DeleteInvestmentAccountHoldingMutation = { __typename?: 'Mutation', deleteInvestmentAccountHolding: { __typename?: 'InvestmentAccountHoldingHistory', itemId: string, date: string, units: number, unitValue: number, type: InvestmentAccountHoldingHistoryType, return?: number | null, returnChange?: number | null, cashChangeId: string } };

export type CreateInvestmentAccountCasheMutationVariables = Exact<{
  input: InvestmentAccountCashCreateInput;
}>;


export type CreateInvestmentAccountCasheMutation = { __typename?: 'Mutation', createInvestmentAccountCashe: { __typename?: 'InvestmentAccountCashChange', itemId: string, cashValue: number, type: InvestmentAccountCashChangeType, date: string } };

export type EditInvestmentAccountCasheMutationVariables = Exact<{
  input: InvestmentAccountCashEditInput;
}>;


export type EditInvestmentAccountCasheMutation = { __typename?: 'Mutation', editInvestmentAccountCashe: { __typename?: 'InvestmentAccountCashChange', itemId: string, cashValue: number, type: InvestmentAccountCashChangeType, date: string } };

export type DeleteInvestmentAccountCasheMutationVariables = Exact<{
  input: InvestmentAccountCashDeleteInput;
}>;


export type DeleteInvestmentAccountCasheMutation = { __typename?: 'Mutation', deleteInvestmentAccountCashe: { __typename?: 'InvestmentAccountCashChange', itemId: string, cashValue: number, type: InvestmentAccountCashChangeType, date: string } };

export type CashModificationSubscriptionSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type CashModificationSubscriptionSubscription = { __typename?: 'Subscription', cashModification: { __typename?: 'InvestmentAccountCashChangeSubscription', modification: Data_Modification, accountId: string, data: { __typename?: 'InvestmentAccountCashChange', itemId: string, cashValue: number, type: InvestmentAccountCashChangeType, date: string } } };

export type GetTopTransactionsQueryVariables = Exact<{
  input: Scalars['String'];
}>;


export type GetTopTransactionsQuery = { __typename?: 'Query', getTopTransactions: { __typename?: 'InvestmentAccountTransactionWrapperOutput', bestValueChage: Array<{ __typename?: 'InvestmentAccountTransactionOutput', itemId: string, assetId: string, cashChangeId: string, date: string, createdAt: any, units: number, unitValue: number, type: InvestmentAccountHoldingHistoryType, return?: number | null, returnChange?: number | null, holdingType: InvestmentAccountHoldingType, sector: string }>, worstValueChage: Array<{ __typename?: 'InvestmentAccountTransactionOutput', itemId: string, assetId: string, cashChangeId: string, date: string, createdAt: any, units: number, unitValue: number, type: InvestmentAccountHoldingHistoryType, return?: number | null, returnChange?: number | null, holdingType: InvestmentAccountHoldingType, sector: string }>, bestValue: Array<{ __typename?: 'InvestmentAccountTransactionOutput', itemId: string, assetId: string, cashChangeId: string, date: string, createdAt: any, units: number, unitValue: number, type: InvestmentAccountHoldingHistoryType, return?: number | null, returnChange?: number | null, holdingType: InvestmentAccountHoldingType, sector: string }>, worstValue: Array<{ __typename?: 'InvestmentAccountTransactionOutput', itemId: string, assetId: string, cashChangeId: string, date: string, createdAt: any, units: number, unitValue: number, type: InvestmentAccountHoldingHistoryType, return?: number | null, returnChange?: number | null, holdingType: InvestmentAccountHoldingType, sector: string }> } };

export type GetTransactionHistoryQueryVariables = Exact<{
  input: InvestmentAccountTransactionInput;
}>;


export type GetTransactionHistoryQuery = { __typename?: 'Query', getTransactionHistory: Array<{ __typename?: 'InvestmentAccountTransactionOutput', itemId: string, assetId: string, cashChangeId: string, date: string, createdAt: any, units: number, unitValue: number, type: InvestmentAccountHoldingHistoryType, return?: number | null, returnChange?: number | null, holdingType: InvestmentAccountHoldingType, sector: string }> };

export type GetTransactionSymbolsQueryVariables = Exact<{
  input: Scalars['String'];
}>;


export type GetTransactionSymbolsQuery = { __typename?: 'Query', getTransactionSymbols: Array<string> };

export type PersonalAccountTagFragment = { __typename?: 'PersonalAccountTag', id: string, createdAt: string, modifiedAt: string, name: string, type: TagDataType, isDefault: string, color: string };

export type PersonalAccountDailyDataFragment = { __typename?: 'PersonalAccountDailyData', id: string, value: number, date: string, tagId: string, monthlyDataId: string, week: number, tag: { __typename?: 'PersonalAccountTag', id: string, createdAt: string, modifiedAt: string, name: string, type: TagDataType, isDefault: string, color: string } };

export type PersonalAccountMonthlyDataOverviewFragment = { __typename?: 'PersonalAccountMonthlyData', id: string, personalAccountId: string, month: number, year: number, dailyEntries: number, monthlyIncome: number, monthlyExpense: number };

export type PersonalAccountMonthlyDataDetailFragment = { __typename?: 'PersonalAccountMonthlyData', id: string, personalAccountId: string, month: number, year: number, dailyEntries: number, monthlyIncome: number, monthlyExpense: number, dailyData: Array<{ __typename?: 'PersonalAccountDailyData', id: string, value: number, date: string, tagId: string, monthlyDataId: string, week: number, tag: { __typename?: 'PersonalAccountTag', id: string, createdAt: string, modifiedAt: string, name: string, type: TagDataType, isDefault: string, color: string } }> };

export type PersonalAccountOverviewBasicFragment = { __typename?: 'PersonalAccount', id: string, name: string, createdAt: string, userId: string };

export type PersonalAccountOverviewFragment = { __typename?: 'PersonalAccount', id: string, name: string, createdAt: string, userId: string, yearlyAggregaton: Array<{ __typename?: 'PersonalAccountAggregationDataOutput', value: number, entries: number, tag: { __typename?: 'PersonalAccountTag', id: string, createdAt: string, modifiedAt: string, name: string, type: TagDataType, isDefault: string, color: string } }>, weeklyAggregaton: Array<{ __typename?: 'PersonalAccountWeeklyAggregationOutput', id: string, year: number, month: number, week: number, data: Array<{ __typename?: 'PersonalAccountAggregationDataOutput', value: number, entries: number, tag: { __typename?: 'PersonalAccountTag', id: string, createdAt: string, modifiedAt: string, name: string, type: TagDataType, isDefault: string, color: string } }> }>, monthlyData: Array<{ __typename?: 'PersonalAccountMonthlyData', id: string, personalAccountId: string, month: number, year: number, dailyEntries: number, monthlyIncome: number, monthlyExpense: number }> };

export type PersonalAccountAggregationDataFragment = { __typename?: 'PersonalAccountAggregationDataOutput', value: number, entries: number, tag: { __typename?: 'PersonalAccountTag', id: string, createdAt: string, modifiedAt: string, name: string, type: TagDataType, isDefault: string, color: string } };

export type PersonalAccountWeeklyAggregationFragment = { __typename?: 'PersonalAccountWeeklyAggregationOutput', id: string, year: number, month: number, week: number, data: Array<{ __typename?: 'PersonalAccountAggregationDataOutput', value: number, entries: number, tag: { __typename?: 'PersonalAccountTag', id: string, createdAt: string, modifiedAt: string, name: string, type: TagDataType, isDefault: string, color: string } }> };

export type GetPersonalAccountsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPersonalAccountsQuery = { __typename?: 'Query', getPersonalAccounts: Array<{ __typename?: 'PersonalAccount', id: string, name: string, createdAt: string, userId: string }> };

export type GetPersonalAccountByIdQueryVariables = Exact<{
  input: Scalars['String'];
}>;


export type GetPersonalAccountByIdQuery = { __typename?: 'Query', getPersonalAccountById: { __typename?: 'PersonalAccount', id: string, name: string, createdAt: string, userId: string, yearlyAggregaton: Array<{ __typename?: 'PersonalAccountAggregationDataOutput', value: number, entries: number, tag: { __typename?: 'PersonalAccountTag', id: string, createdAt: string, modifiedAt: string, name: string, type: TagDataType, isDefault: string, color: string } }>, weeklyAggregaton: Array<{ __typename?: 'PersonalAccountWeeklyAggregationOutput', id: string, year: number, month: number, week: number, data: Array<{ __typename?: 'PersonalAccountAggregationDataOutput', value: number, entries: number, tag: { __typename?: 'PersonalAccountTag', id: string, createdAt: string, modifiedAt: string, name: string, type: TagDataType, isDefault: string, color: string } }> }>, monthlyData: Array<{ __typename?: 'PersonalAccountMonthlyData', id: string, personalAccountId: string, month: number, year: number, dailyEntries: number, monthlyIncome: number, monthlyExpense: number }> } };

export type CreatePersonalAccountMutationVariables = Exact<{
  name: Scalars['String'];
}>;


export type CreatePersonalAccountMutation = { __typename?: 'Mutation', createPersonalAccount: { __typename?: 'PersonalAccount', id: string, name: string, createdAt: string, userId: string } };

export type EditPersonalAccountMutationVariables = Exact<{
  input: PersonalAccountEditInput;
}>;


export type EditPersonalAccountMutation = { __typename?: 'Mutation', editPersonalAccount: { __typename?: 'PersonalAccount', id: string, name: string, createdAt: string, userId: string } };

export type DeletePersonalAccountMutationVariables = Exact<{
  accountId: Scalars['String'];
}>;


export type DeletePersonalAccountMutation = { __typename?: 'Mutation', deletePersonalAccount: { __typename?: 'PersonalAccount', id: string, name: string, createdAt: string, userId: string } };

export type GetDefaultTagsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetDefaultTagsQuery = { __typename?: 'Query', getDefaultTags: Array<{ __typename?: 'PersonalAccountTag', id: string, createdAt: string, modifiedAt: string, name: string, type: TagDataType, isDefault: string, color: string }> };

export type GetPersonalAccountMonthlyDataByIdQueryVariables = Exact<{
  input: Scalars['String'];
}>;


export type GetPersonalAccountMonthlyDataByIdQuery = { __typename?: 'Query', getPersonalAccountMonthlyDataById: { __typename?: 'PersonalAccountMonthlyData', id: string, personalAccountId: string, month: number, year: number, dailyEntries: number, monthlyIncome: number, monthlyExpense: number, dailyData: Array<{ __typename?: 'PersonalAccountDailyData', id: string, value: number, date: string, tagId: string, monthlyDataId: string, week: number, tag: { __typename?: 'PersonalAccountTag', id: string, createdAt: string, modifiedAt: string, name: string, type: TagDataType, isDefault: string, color: string } }> } };

export type CreatedMonthlyDataSubscriptionSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type CreatedMonthlyDataSubscriptionSubscription = { __typename?: 'Subscription', createdMonthlyData: { __typename?: 'PersonalAccountMonthlyData', id: string, personalAccountId: string, month: number, year: number, dailyEntries: number, monthlyIncome: number, monthlyExpense: number } };

export type CreatePersonalAccountDailyEntryMutationVariables = Exact<{
  input: PersonalAccountDailyDataCreate;
}>;


export type CreatePersonalAccountDailyEntryMutation = { __typename?: 'Mutation', createPersonalAccountDailyEntry: { __typename?: 'PersonalAccountDailyData', id: string, value: number, date: string, tagId: string, monthlyDataId: string, week: number, tag: { __typename?: 'PersonalAccountTag', id: string, createdAt: string, modifiedAt: string, name: string, type: TagDataType, isDefault: string, color: string } } };

export type DeletePersonalAccountDailyEntryMutationVariables = Exact<{
  input: PersonalAccountDailyDataDelete;
}>;


export type DeletePersonalAccountDailyEntryMutation = { __typename?: 'Mutation', deletePersonalAccountDailyEntry: { __typename?: 'PersonalAccountDailyData', id: string, value: number, date: string, tagId: string, monthlyDataId: string, week: number, tag: { __typename?: 'PersonalAccountTag', id: string, createdAt: string, modifiedAt: string, name: string, type: TagDataType, isDefault: string, color: string } } };

export type EditPersonalAccountDailyEntryMutationVariables = Exact<{
  input: PersonalAccountDailyDataEdit;
}>;


export type EditPersonalAccountDailyEntryMutation = { __typename?: 'Mutation', editPersonalAccountDailyEntry: { __typename?: 'PersonalAccountDailyDataEditOutput', originalDailyData: { __typename?: 'PersonalAccountDailyData', id: string, value: number, date: string, tagId: string, monthlyDataId: string, week: number, tag: { __typename?: 'PersonalAccountTag', id: string, createdAt: string, modifiedAt: string, name: string, type: TagDataType, isDefault: string, color: string } }, modifiedDailyData: { __typename?: 'PersonalAccountDailyData', id: string, value: number, date: string, tagId: string, monthlyDataId: string, week: number, tag: { __typename?: 'PersonalAccountTag', id: string, createdAt: string, modifiedAt: string, name: string, type: TagDataType, isDefault: string, color: string } } } };

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
export const InvestmentAccountHoldingHistoryFragmentDoc = gql`
    fragment InvestmentAccountHoldingHistory on InvestmentAccountHoldingHistory {
  itemId
  date
  units
  unitValue
  type
  return
  returnChange
  cashChangeId
}
    `;
export const InvestmentAccountHoldingFragmentDoc = gql`
    fragment InvestmentAccountHolding on InvestmentAccountHolding {
  id
  assetId
  investmentAccountId
  type
  sector
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
}
    `;
export const InvestmentAccountCashChangeFragmentDoc = gql`
    fragment InvestmentAccountCashChange on InvestmentAccountCashChange {
  itemId
  cashValue
  type
  date
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
  units
  totalValue
  beakEvenPrice
  assetGeneral {
    ...AssetGeneral
  }
}
    ${AssetGeneralFragmentDoc}`;
export const InvestmentAccountFragmentDoc = gql`
    fragment InvestmentAccount on InvestmentAccount {
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
  cash
  date
  ownedAssets
}
    `;
export const InvestmentAccountTransactionOutputFragmentDoc = gql`
    fragment InvestmentAccountTransactionOutput on InvestmentAccountTransactionOutput {
  itemId
  assetId
  cashChangeId
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
export const PersonalAccountMonthlyDataOverviewFragmentDoc = gql`
    fragment PersonalAccountMonthlyDataOverview on PersonalAccountMonthlyData {
  id
  personalAccountId
  month
  year
  dailyEntries
  monthlyIncome
  monthlyExpense
}
    `;
export const PersonalAccountTagFragmentDoc = gql`
    fragment PersonalAccountTag on PersonalAccountTag {
  id
  createdAt
  modifiedAt
  name
  type
  isDefault
  color
}
    `;
export const PersonalAccountDailyDataFragmentDoc = gql`
    fragment PersonalAccountDailyData on PersonalAccountDailyData {
  id
  value
  date
  tagId
  monthlyDataId
  week
  tag {
    ...PersonalAccountTag
  }
}
    ${PersonalAccountTagFragmentDoc}`;
export const PersonalAccountMonthlyDataDetailFragmentDoc = gql`
    fragment PersonalAccountMonthlyDataDetail on PersonalAccountMonthlyData {
  ...PersonalAccountMonthlyDataOverview
  dailyData {
    ...PersonalAccountDailyData
  }
}
    ${PersonalAccountMonthlyDataOverviewFragmentDoc}
${PersonalAccountDailyDataFragmentDoc}`;
export const PersonalAccountOverviewBasicFragmentDoc = gql`
    fragment PersonalAccountOverviewBasic on PersonalAccount {
  id
  name
  createdAt
  userId
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
export const PersonalAccountOverviewFragmentDoc = gql`
    fragment PersonalAccountOverview on PersonalAccount {
  ...PersonalAccountOverviewBasic
  yearlyAggregaton {
    ...PersonalAccountAggregationData
  }
  weeklyAggregaton {
    ...PersonalAccountWeeklyAggregation
  }
  monthlyData {
    ...PersonalAccountMonthlyDataOverview
  }
}
    ${PersonalAccountOverviewBasicFragmentDoc}
${PersonalAccountAggregationDataFragmentDoc}
${PersonalAccountWeeklyAggregationFragmentDoc}
${PersonalAccountMonthlyDataOverviewFragmentDoc}`;
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
export const GetInvestmentAccountByIdDocument = gql`
    query GetInvestmentAccountById($input: String!) {
  getInvestmentAccountById(input: $input) {
    ...InvestmentAccount
  }
}
    ${InvestmentAccountFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class GetInvestmentAccountByIdGQL extends Apollo.Query<GetInvestmentAccountByIdQuery, GetInvestmentAccountByIdQueryVariables> {
    override document = GetInvestmentAccountByIdDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetInvestmentAccountsDocument = gql`
    query GetInvestmentAccounts {
  getInvestmentAccounts {
    ...InvestmentAccountOverview
  }
}
    ${InvestmentAccountOverviewFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class GetInvestmentAccountsGQL extends Apollo.Query<GetInvestmentAccountsQuery, GetInvestmentAccountsQueryVariables> {
    override document = GetInvestmentAccountsDocument;
    
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
export const CreateInvestmentAccountDocument = gql`
    mutation CreateInvestmentAccount($input: InvestmentAccountCreateInput!) {
  createInvestmentAccount(input: $input) {
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
    mutation DeleteInvestmentAccount($input: String!) {
  deleteInvestmentAccount(input: $input) {
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
    ...InvestmentAccountActiveHoldingOutput
  }
}
    ${InvestmentAccountActiveHoldingOutputFragmentDoc}`;

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
export const CreateInvestmentAccountCasheDocument = gql`
    mutation CreateInvestmentAccountCashe($input: InvestmentAccountCashCreateInput!) {
  createInvestmentAccountCashe(input: $input) {
    ...InvestmentAccountCashChange
  }
}
    ${InvestmentAccountCashChangeFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class CreateInvestmentAccountCasheGQL extends Apollo.Mutation<CreateInvestmentAccountCasheMutation, CreateInvestmentAccountCasheMutationVariables> {
    override document = CreateInvestmentAccountCasheDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const EditInvestmentAccountCasheDocument = gql`
    mutation EditInvestmentAccountCashe($input: InvestmentAccountCashEditInput!) {
  editInvestmentAccountCashe(input: $input) {
    ...InvestmentAccountCashChange
  }
}
    ${InvestmentAccountCashChangeFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class EditInvestmentAccountCasheGQL extends Apollo.Mutation<EditInvestmentAccountCasheMutation, EditInvestmentAccountCasheMutationVariables> {
    override document = EditInvestmentAccountCasheDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DeleteInvestmentAccountCasheDocument = gql`
    mutation DeleteInvestmentAccountCashe($input: InvestmentAccountCashDeleteInput!) {
  deleteInvestmentAccountCashe(input: $input) {
    ...InvestmentAccountCashChange
  }
}
    ${InvestmentAccountCashChangeFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class DeleteInvestmentAccountCasheGQL extends Apollo.Mutation<DeleteInvestmentAccountCasheMutation, DeleteInvestmentAccountCasheMutationVariables> {
    override document = DeleteInvestmentAccountCasheDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CashModificationSubscriptionDocument = gql`
    subscription CashModificationSubscription {
  cashModification {
    modification
    accountId
    data {
      ...InvestmentAccountCashChange
    }
  }
}
    ${InvestmentAccountCashChangeFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class CashModificationSubscriptionGQL extends Apollo.Subscription<CashModificationSubscriptionSubscription, CashModificationSubscriptionSubscriptionVariables> {
    override document = CashModificationSubscriptionDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetTopTransactionsDocument = gql`
    query GetTopTransactions($input: String!) {
  getTopTransactions(input: $input) {
    bestValueChage {
      ...InvestmentAccountTransactionOutput
    }
    worstValueChage {
      ...InvestmentAccountTransactionOutput
    }
    bestValue {
      ...InvestmentAccountTransactionOutput
    }
    worstValue {
      ...InvestmentAccountTransactionOutput
    }
  }
}
    ${InvestmentAccountTransactionOutputFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class GetTopTransactionsGQL extends Apollo.Query<GetTopTransactionsQuery, GetTopTransactionsQueryVariables> {
    override document = GetTopTransactionsDocument;
    
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
    query GetTransactionSymbols($input: String!) {
  getTransactionSymbols(input: $input)
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
export const GetPersonalAccountsDocument = gql`
    query getPersonalAccounts {
  getPersonalAccounts {
    ...PersonalAccountOverviewBasic
  }
}
    ${PersonalAccountOverviewBasicFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class GetPersonalAccountsGQL extends Apollo.Query<GetPersonalAccountsQuery, GetPersonalAccountsQueryVariables> {
    override document = GetPersonalAccountsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetPersonalAccountByIdDocument = gql`
    query getPersonalAccountById($input: String!) {
  getPersonalAccountById(input: $input) {
    ...PersonalAccountOverview
  }
}
    ${PersonalAccountOverviewFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class GetPersonalAccountByIdGQL extends Apollo.Query<GetPersonalAccountByIdQuery, GetPersonalAccountByIdQueryVariables> {
    override document = GetPersonalAccountByIdDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CreatePersonalAccountDocument = gql`
    mutation CreatePersonalAccount($name: String!) {
  createPersonalAccount(input: {name: $name}) {
    ...PersonalAccountOverviewBasic
  }
}
    ${PersonalAccountOverviewBasicFragmentDoc}`;

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
    ...PersonalAccountOverviewBasic
  }
}
    ${PersonalAccountOverviewBasicFragmentDoc}`;

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
    mutation DeletePersonalAccount($accountId: String!) {
  deletePersonalAccount(input: $accountId) {
    ...PersonalAccountOverviewBasic
  }
}
    ${PersonalAccountOverviewBasicFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class DeletePersonalAccountGQL extends Apollo.Mutation<DeletePersonalAccountMutation, DeletePersonalAccountMutationVariables> {
    override document = DeletePersonalAccountDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetDefaultTagsDocument = gql`
    query getDefaultTags {
  getDefaultTags {
    ...PersonalAccountTag
  }
}
    ${PersonalAccountTagFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class GetDefaultTagsGQL extends Apollo.Query<GetDefaultTagsQuery, GetDefaultTagsQueryVariables> {
    override document = GetDefaultTagsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetPersonalAccountMonthlyDataByIdDocument = gql`
    query getPersonalAccountMonthlyDataById($input: String!) {
  getPersonalAccountMonthlyDataById(input: $input) {
    ...PersonalAccountMonthlyDataDetail
  }
}
    ${PersonalAccountMonthlyDataDetailFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class GetPersonalAccountMonthlyDataByIdGQL extends Apollo.Query<GetPersonalAccountMonthlyDataByIdQuery, GetPersonalAccountMonthlyDataByIdQueryVariables> {
    override document = GetPersonalAccountMonthlyDataByIdDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CreatedMonthlyDataSubscriptionDocument = gql`
    subscription createdMonthlyDataSubscription {
  createdMonthlyData {
    ...PersonalAccountMonthlyDataOverview
  }
}
    ${PersonalAccountMonthlyDataOverviewFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class CreatedMonthlyDataSubscriptionGQL extends Apollo.Subscription<CreatedMonthlyDataSubscriptionSubscription, CreatedMonthlyDataSubscriptionSubscriptionVariables> {
    override document = CreatedMonthlyDataSubscriptionDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CreatePersonalAccountDailyEntryDocument = gql`
    mutation CreatePersonalAccountDailyEntry($input: PersonalAccountDailyDataCreate!) {
  createPersonalAccountDailyEntry(input: $input) {
    ...PersonalAccountDailyData
  }
}
    ${PersonalAccountDailyDataFragmentDoc}`;

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
    ...PersonalAccountDailyData
  }
}
    ${PersonalAccountDailyDataFragmentDoc}`;

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
      ...PersonalAccountDailyData
    }
    modifiedDailyData {
      ...PersonalAccountDailyData
    }
  }
}
    ${PersonalAccountDailyDataFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class EditPersonalAccountDailyEntryGQL extends Apollo.Mutation<EditPersonalAccountDailyEntryMutation, EditPersonalAccountDailyEntryMutationVariables> {
    override document = EditPersonalAccountDailyEntryDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }