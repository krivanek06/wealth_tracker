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
};

export enum Authentication_Providers {
  BasicAuth = 'BASIC_AUTH',
  Google = 'GOOGLE'
}

export type AssetStock = {
  __typename?: 'AssetStock';
  assetStockProfile: AssetStockProfile;
  assetStockQuote: AssetStockQuote;
  /** Last time the information was updated for this stock */
  infoUpdateTimestamp: Scalars['Float'];
  /** Last time the price was updated for this stock */
  priceUpdateTimestamp: Scalars['Float'];
  symbol: Scalars['String'];
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

export type AssetStockQuote = {
  __typename?: 'AssetStockQuote';
  avgVolume: Scalars['Float'];
  change: Scalars['Float'];
  changesPercentage: Scalars['Float'];
  dayHigh: Scalars['Float'];
  dayLow: Scalars['Float'];
  earningsAnnouncement?: Maybe<Scalars['String']>;
  eps?: Maybe<Scalars['Float']>;
  exchange: Scalars['String'];
  marketCap: Scalars['Float'];
  name: Scalars['String'];
  open: Scalars['Float'];
  pe?: Maybe<Scalars['Float']>;
  previousClose: Scalars['Float'];
  price: Scalars['Float'];
  priceAvg50: Scalars['Float'];
  priceAvg200: Scalars['Float'];
  sharesOutstanding: Scalars['Float'];
  symbol: Scalars['String'];
  timestamp: Scalars['Float'];
  volume: Scalars['Float'];
  yearHigh: Scalars['Float'];
  yearLow: Scalars['Float'];
};

export type AssetStockSearch = {
  __typename?: 'AssetStockSearch';
  currency: Scalars['String'];
  exchangeShortName: Scalars['String'];
  name: Scalars['String'];
  stockExchange: Scalars['String'];
  symbol: Scalars['String'];
};

export type InvestmentAccounHoldingCreateInput = {
  /** Amount the user invested into this symbol */
  investedAlready: Scalars['Float'];
  /** Investment account associated with the asset */
  investmentAccountId: Scalars['String'];
  /** Symbol ID */
  symbol: Scalars['String'];
  type: InvestmentAccountHoldingType;
  /** How many units of this symbol user has */
  units: Scalars['Float'];
};

export type InvestmentAccounHoldingDeleteInput = {
  /** Investment account from which we will remove the symbol */
  investmentAccountId: Scalars['String'];
  /** Symbol ID */
  symbol: Scalars['String'];
};

export type InvestmentAccounHoldingEditInput = {
  /** Amount the user invested into this symbol */
  investedAlready: Scalars['Float'];
  /** Investment account associated with the asset */
  investmentAccountId: Scalars['String'];
  /** Symbol ID */
  symbol: Scalars['String'];
  /** How many units of this symbol user has */
  units: Scalars['Float'];
};

export type InvestmentAccount = {
  __typename?: 'InvestmentAccount';
  accountHistory: InvestmentAccountHistory;
  /** How much cash on hand is on this investment account */
  cashCurrent: Scalars['Float'];
  holdingCrypto: Array<InvestmentAccountHoldingCrypto>;
  holdingStocks: Array<InvestmentAccountHoldingStock>;
  id: Scalars['String'];
  investedAlreadyTotal: Scalars['Float'];
  /** Last inserted data in InvestmentAccountHistory.portfolioSnapshots */
  lastPortfolioSnapshot?: Maybe<InvestmentAccountPortfolioSnapshot>;
  /** custom name for personal account */
  name: Scalars['String'];
  portfolioBalanceTotal: Scalars['Float'];
  /** Reference to User.ID who created this investment account */
  userId: Scalars['String'];
};

export type InvestmentAccountCreateInput = {
  name: Scalars['String'];
};

export type InvestmentAccountEditInput = {
  cashCurrent: Scalars['Int'];
  investmentAccountId: Scalars['String'];
  name: Scalars['String'];
};

export type InvestmentAccountHistory = {
  __typename?: 'InvestmentAccountHistory';
  id: Scalars['String'];
  /** Reference to InvestmentAccount.ID who for 1-o-1 relashion */
  investmentAccountId: Scalars['String'];
  /** Total portfolioSnapshot.length */
  portfolioSnapshotTotal: Scalars['Int'];
  /** Historical snapshots of portfolio change */
  portfolioSnapshots: Array<InvestmentAccountPortfolioSnapshot>;
};

export type InvestmentAccountHolding = {
  __typename?: 'InvestmentAccountHolding';
  /** Symbol ID -> AAPL, MSFT, BTC */
  id: Scalars['String'];
  /** Amount the user invested into this symbol */
  investedAlready: Scalars['Float'];
  /** Associated InvestmentAccount.id */
  investmentAccountId: Scalars['String'];
  type: InvestmentAccountHoldingType;
  /** How many units of this symbol user has */
  units: Scalars['Float'];
};

export type InvestmentAccountHoldingCrypto = {
  __typename?: 'InvestmentAccountHoldingCrypto';
  /** Symbol ID -> AAPL, MSFT, BTC */
  id: Scalars['String'];
  /** Amount the user invested into this symbol */
  investedAlready: Scalars['Float'];
  /** Associated InvestmentAccount.id */
  investmentAccountId: Scalars['String'];
  type: InvestmentAccountHoldingType;
  /** How many units of this symbol user has */
  units: Scalars['Float'];
};

export type InvestmentAccountHoldingStock = {
  __typename?: 'InvestmentAccountHoldingStock';
  assetInfo: AssetStock;
  breakEvenPrice: Scalars['Float'];
  /** Symbol ID -> AAPL, MSFT, BTC */
  id: Scalars['String'];
  /** Amount the user invested into this symbol */
  investedAlready: Scalars['Float'];
  /** Associated InvestmentAccount.id */
  investmentAccountId: Scalars['String'];
  type: InvestmentAccountHoldingType;
  /** How many units of this symbol user has */
  units: Scalars['Float'];
};

export enum InvestmentAccountHoldingType {
  Crypto = 'CRYPTO',
  Stock = 'STOCK'
}

export type InvestmentAccountPortfolioSnapshot = {
  __typename?: 'InvestmentAccountPortfolioSnapshot';
  /** how much cash user had on hands during this snapshot */
  cash: Scalars['Float'];
  date: Scalars['String'];
  id: Scalars['String'];
  /** current price of assets * units */
  investmentCurrent: Scalars['Float'];
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
  createInvestmentAccountHolding: InvestmentAccountHolding;
  createPersonalAccount: PersonalAccount;
  createPersonalAccountDailyEntry: PersonalAccountDailyData;
  /** Returns the ID of the removed investment account */
  deleteInvestmentAccount: InvestmentAccount;
  deleteInvestmentAccountHolding: InvestmentAccountHolding;
  deletePersonalAccount: PersonalAccount;
  deletePersonalAccountDailyEntry: PersonalAccountDailyData;
  editInvestmentAccount: InvestmentAccount;
  editInvestmentAccountHolding: InvestmentAccountHolding;
  editPersonalAccount: PersonalAccount;
  editPersonalAccountDailyEntry: PersonalAccountDailyDataEditOutput;
  loginBasic: LoggedUserOutput;
  loginSocial: LoggedUserOutput;
  registerBasic: LoggedUserOutput;
};


export type MutationCreateInvestmentAccountArgs = {
  input: InvestmentAccountCreateInput;
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


export type MutationDeleteInvestmentAccountHoldingArgs = {
  input: InvestmentAccounHoldingDeleteInput;
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


export type MutationEditInvestmentAccountHoldingArgs = {
  input: InvestmentAccounHoldingEditInput;
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
  /** Reference to PersonalAccountTag.id */
  tagId: Scalars['String'];
  /** Name of the tag */
  tagName: Scalars['String'];
  /** Type of the tag */
  tagType: PersonalAccountTagDataType;
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
  /** To which year is this account change associated. */
  year: Scalars['Int'];
};

export type PersonalAccountMonthlyDataSeach = {
  /** Monthly data Id */
  id: Scalars['String'];
  /** Personal account Id */
  personalAccountId: Scalars['String'];
};

export type PersonalAccountTag = {
  __typename?: 'PersonalAccountTag';
  createdAt: Scalars['String'];
  id: Scalars['ID'];
  /** True only for default Tags, shared accross every user */
  isDefault: Scalars['String'];
  modifiedAt: Scalars['String'];
  /** Name of the tag */
  name: Scalars['String'];
  /** Reference to PersonalAccount.id, if this tag is specific for some personal account. For detault tags this is null */
  personalAccountId?: Maybe<Scalars['String']>;
  type: PersonalAccountTagDataType;
  /** Reference to User.id, person who has created this personcal account tag. For detault tags this is null */
  userId?: Maybe<Scalars['String']>;
};

export enum PersonalAccountTagDataType {
  Expense = 'EXPENSE',
  Income = 'INCOME'
}

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
  /** Returns default tags that are shared cross every user */
  getDefaultTags: Array<PersonalAccountTag>;
  /** Returns all personal accounts for the requester */
  getInvestmentAccounts: Array<InvestmentAccount>;
  /** Returns monthly data by id */
  getPersonalAccountMonthlyDataById: PersonalAccountMonthlyData;
  /** Returns all personal accounts for the requester */
  getPersonalAccounts: Array<PersonalAccount>;
  healthCheck: Scalars['String'];
  /** Search stock based on ticker symbol */
  searchAssetStockSymbol: Array<AssetStockSearch>;
};


export type QueryGetPersonalAccountMonthlyDataByIdArgs = {
  input: PersonalAccountMonthlyDataSeach;
};


export type QuerySearchAssetStockSymbolArgs = {
  input: Scalars['String'];
};

export type RegisterUserInput = {
  email: Scalars['String'];
  password: Scalars['String'];
  passwordRepeat: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['String'];
  email: Scalars['String'];
  id: Scalars['String'];
  imageUrl?: Maybe<Scalars['String']>;
  lastSingInDate: Scalars['String'];
  username: Scalars['String'];
};

export type PersonalAccountTagFragment = { __typename?: 'PersonalAccountTag', id: string, createdAt: string, modifiedAt: string, name: string, type: PersonalAccountTagDataType, isDefault: string };

export type PersonalAccountDailyDataFragment = { __typename?: 'PersonalAccountDailyData', id: string, value: number, date: string, tagId: string, monthlyDataId: string, week: number };

export type PersonalAccountMonthlyDataOverviewFragment = { __typename?: 'PersonalAccountMonthlyData', id: string, month: number, year: number, dailyEntries: number, monthlyIncome: number, monthlyExpense: number };

export type PersonalAccountOverviewFragment = { __typename?: 'PersonalAccount', id: string, name: string, createdAt: string, userId: string, yearlyAggregaton: Array<{ __typename?: 'PersonalAccountAggregationDataOutput', value: number, entries: number, tagId: string, tagName: string, tagType: PersonalAccountTagDataType }>, weeklyAggregaton: Array<{ __typename?: 'PersonalAccountWeeklyAggregationOutput', id: string, year: number, month: number, week: number, data: Array<{ __typename?: 'PersonalAccountAggregationDataOutput', value: number, entries: number, tagId: string, tagName: string, tagType: PersonalAccountTagDataType }> }>, monthlyData: Array<{ __typename?: 'PersonalAccountMonthlyData', id: string, month: number, year: number, dailyEntries: number, monthlyIncome: number, monthlyExpense: number }> };

export type PersonalAccountAggregationDataFragment = { __typename?: 'PersonalAccountAggregationDataOutput', value: number, entries: number, tagId: string, tagName: string, tagType: PersonalAccountTagDataType };

export type PersonalAccountWeeklyAggregationFragment = { __typename?: 'PersonalAccountWeeklyAggregationOutput', id: string, year: number, month: number, week: number, data: Array<{ __typename?: 'PersonalAccountAggregationDataOutput', value: number, entries: number, tagId: string, tagName: string, tagType: PersonalAccountTagDataType }> };

export type GetPersonalAccountsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPersonalAccountsQuery = { __typename?: 'Query', getPersonalAccounts: Array<{ __typename?: 'PersonalAccount', id: string, name: string, createdAt: string, userId: string, yearlyAggregaton: Array<{ __typename?: 'PersonalAccountAggregationDataOutput', value: number, entries: number, tagId: string, tagName: string, tagType: PersonalAccountTagDataType }>, weeklyAggregaton: Array<{ __typename?: 'PersonalAccountWeeklyAggregationOutput', id: string, year: number, month: number, week: number, data: Array<{ __typename?: 'PersonalAccountAggregationDataOutput', value: number, entries: number, tagId: string, tagName: string, tagType: PersonalAccountTagDataType }> }>, monthlyData: Array<{ __typename?: 'PersonalAccountMonthlyData', id: string, month: number, year: number, dailyEntries: number, monthlyIncome: number, monthlyExpense: number }> }> };

export type CreatePersonalAccountMutationVariables = Exact<{
  name: Scalars['String'];
}>;


export type CreatePersonalAccountMutation = { __typename?: 'Mutation', createPersonalAccount: { __typename?: 'PersonalAccount', id: string, name: string, createdAt: string, userId: string, yearlyAggregaton: Array<{ __typename?: 'PersonalAccountAggregationDataOutput', value: number, entries: number, tagId: string, tagName: string, tagType: PersonalAccountTagDataType }>, weeklyAggregaton: Array<{ __typename?: 'PersonalAccountWeeklyAggregationOutput', id: string, year: number, month: number, week: number, data: Array<{ __typename?: 'PersonalAccountAggregationDataOutput', value: number, entries: number, tagId: string, tagName: string, tagType: PersonalAccountTagDataType }> }>, monthlyData: Array<{ __typename?: 'PersonalAccountMonthlyData', id: string, month: number, year: number, dailyEntries: number, monthlyIncome: number, monthlyExpense: number }> } };

export type EditPersonalAccountMutationVariables = Exact<{
  input: PersonalAccountEditInput;
}>;


export type EditPersonalAccountMutation = { __typename?: 'Mutation', editPersonalAccount: { __typename?: 'PersonalAccount', id: string, name: string, createdAt: string, userId: string, yearlyAggregaton: Array<{ __typename?: 'PersonalAccountAggregationDataOutput', value: number, entries: number, tagId: string, tagName: string, tagType: PersonalAccountTagDataType }>, weeklyAggregaton: Array<{ __typename?: 'PersonalAccountWeeklyAggregationOutput', id: string, year: number, month: number, week: number, data: Array<{ __typename?: 'PersonalAccountAggregationDataOutput', value: number, entries: number, tagId: string, tagName: string, tagType: PersonalAccountTagDataType }> }>, monthlyData: Array<{ __typename?: 'PersonalAccountMonthlyData', id: string, month: number, year: number, dailyEntries: number, monthlyIncome: number, monthlyExpense: number }> } };

export type DeletePersonalAccountMutationVariables = Exact<{
  accountId: Scalars['String'];
}>;


export type DeletePersonalAccountMutation = { __typename?: 'Mutation', deletePersonalAccount: { __typename?: 'PersonalAccount', id: string, name: string, createdAt: string, userId: string, yearlyAggregaton: Array<{ __typename?: 'PersonalAccountAggregationDataOutput', value: number, entries: number, tagId: string, tagName: string, tagType: PersonalAccountTagDataType }>, weeklyAggregaton: Array<{ __typename?: 'PersonalAccountWeeklyAggregationOutput', id: string, year: number, month: number, week: number, data: Array<{ __typename?: 'PersonalAccountAggregationDataOutput', value: number, entries: number, tagId: string, tagName: string, tagType: PersonalAccountTagDataType }> }>, monthlyData: Array<{ __typename?: 'PersonalAccountMonthlyData', id: string, month: number, year: number, dailyEntries: number, monthlyIncome: number, monthlyExpense: number }> } };

export type GetDefaultTagsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetDefaultTagsQuery = { __typename?: 'Query', getDefaultTags: Array<{ __typename?: 'PersonalAccountTag', id: string, createdAt: string, modifiedAt: string, name: string, type: PersonalAccountTagDataType, isDefault: string }> };

export type GetPersonalAccountMonthlyDataByIdQueryVariables = Exact<{
  input: PersonalAccountMonthlyDataSeach;
}>;


export type GetPersonalAccountMonthlyDataByIdQuery = { __typename?: 'Query', getPersonalAccountMonthlyDataById: { __typename?: 'PersonalAccountMonthlyData', id: string, month: number, year: number, dailyEntries: number, monthlyIncome: number, monthlyExpense: number, dailyData: Array<{ __typename?: 'PersonalAccountDailyData', id: string, value: number, date: string, tagId: string, monthlyDataId: string, week: number }> } };

export type CreatePersonalAccountDailyEntryMutationVariables = Exact<{
  input: PersonalAccountDailyDataCreate;
}>;


export type CreatePersonalAccountDailyEntryMutation = { __typename?: 'Mutation', createPersonalAccountDailyEntry: { __typename?: 'PersonalAccountDailyData', id: string, value: number, date: string, tagId: string, monthlyDataId: string, week: number } };

export type DeletePersonalAccountDailyEntryMutationVariables = Exact<{
  input: PersonalAccountDailyDataDelete;
}>;


export type DeletePersonalAccountDailyEntryMutation = { __typename?: 'Mutation', deletePersonalAccountDailyEntry: { __typename?: 'PersonalAccountDailyData', id: string, value: number, date: string, tagId: string, monthlyDataId: string, week: number } };

export type EditPersonalAccountDailyEntryMutationVariables = Exact<{
  input: PersonalAccountDailyDataEdit;
}>;


export type EditPersonalAccountDailyEntryMutation = { __typename?: 'Mutation', editPersonalAccountDailyEntry: { __typename?: 'PersonalAccountDailyDataEditOutput', originalDailyData: { __typename?: 'PersonalAccountDailyData', id: string, value: number, date: string, tagId: string, monthlyDataId: string, week: number }, modifiedDailyData: { __typename?: 'PersonalAccountDailyData', id: string, value: number, date: string, tagId: string, monthlyDataId: string, week: number } } };

export const PersonalAccountTagFragmentDoc = gql`
    fragment PersonalAccountTag on PersonalAccountTag {
  id
  createdAt
  modifiedAt
  name
  type
  isDefault
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
}
    `;
export const PersonalAccountAggregationDataFragmentDoc = gql`
    fragment PersonalAccountAggregationData on PersonalAccountAggregationDataOutput {
  value
  entries
  tagId
  tagName
  tagType
}
    `;
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
export const PersonalAccountMonthlyDataOverviewFragmentDoc = gql`
    fragment PersonalAccountMonthlyDataOverview on PersonalAccountMonthlyData {
  id
  month
  year
  dailyEntries
  monthlyIncome
  monthlyExpense
}
    `;
export const PersonalAccountOverviewFragmentDoc = gql`
    fragment PersonalAccountOverview on PersonalAccount {
  id
  name
  createdAt
  userId
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
    ${PersonalAccountAggregationDataFragmentDoc}
${PersonalAccountWeeklyAggregationFragmentDoc}
${PersonalAccountMonthlyDataOverviewFragmentDoc}`;
export const GetPersonalAccountsDocument = gql`
    query getPersonalAccounts {
  getPersonalAccounts {
    ...PersonalAccountOverview
  }
}
    ${PersonalAccountOverviewFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class GetPersonalAccountsGQL extends Apollo.Query<GetPersonalAccountsQuery, GetPersonalAccountsQueryVariables> {
    override document = GetPersonalAccountsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CreatePersonalAccountDocument = gql`
    mutation CreatePersonalAccount($name: String!) {
  createPersonalAccount(input: {name: $name}) {
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
    mutation DeletePersonalAccount($accountId: String!) {
  deletePersonalAccount(input: $accountId) {
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
    query getPersonalAccountMonthlyDataById($input: PersonalAccountMonthlyDataSeach!) {
  getPersonalAccountMonthlyDataById(input: $input) {
    ...PersonalAccountMonthlyDataOverview
    dailyData {
      ...PersonalAccountDailyData
    }
  }
}
    ${PersonalAccountMonthlyDataOverviewFragmentDoc}
${PersonalAccountDailyDataFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class GetPersonalAccountMonthlyDataByIdGQL extends Apollo.Query<GetPersonalAccountMonthlyDataByIdQuery, GetPersonalAccountMonthlyDataByIdQueryVariables> {
    override document = GetPersonalAccountMonthlyDataByIdDocument;
    
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