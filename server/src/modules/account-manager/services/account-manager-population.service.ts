import { Injectable } from '@nestjs/common';
import { InvestmentAccountHoldingHistoryType } from '@prisma/client';
import { MomentServiceUtil } from './../../../utils/date-functionts';
import { InvestmentAccounHoldingCreateInput } from './../../investment-account/inputs/investment-account-holding.input';
import { InvestmentAccountHoldingService } from './../../investment-account/services/investment-account-holding.service';
import { InvestmentAccountService } from './../../investment-account/services/investment-account.service';
import { PersonalAccountDailyDataCreate } from './../../personal-account/inputs/personal-account-daily-data-create.input';
import { PersonalAccountDailyService } from './../../personal-account/services/personal-account-daily-data.service';
import { PersonalAccountService } from './../../personal-account/services/personal-account.service';
import { UserService } from './../../user/user.service';

@Injectable()
export class AccountManagerPopulationService {
	constructor(
		private userService: UserService,
		private personalAccountService: PersonalAccountService,
		private personalAccountDailyService: PersonalAccountDailyService,
		private investmentAccountService: InvestmentAccountService,
		private investmentAccountHoldingService: InvestmentAccountHoldingService
	) {}

	/**
	 * Go back the past 4 months and populate the personal account with random data,
	 * for each day log between 8 to 12 entries.
	 *
	 * @param userId
	 */
	async initPersonalAccount(userId: string): Promise<void> {
		console.log(`[Personal account]: initPersonalAccount, userId: ${userId}`);

		// remove existing personal account
		const existingPersonalAccount = await this.personalAccountService.getPersonalAccountByUserId(userId);
		if (existingPersonalAccount) {
			await this.personalAccountService.deletePersonalAccount(userId);
			console.log('[Personal account]: removed existing account');
		}

		// create new personal account
		const newPersonalAccount = await this.personalAccountService.createPersonalAccount(userId);
		const newTags = newPersonalAccount.personalAccountTag;
		console.log('[Personal account]: created new account');

		// create a date range that goes back 4 months
		const [startDate, endDate] = MomentServiceUtil.getDateRangeByDayDiff(80);
		const dayDiffs = MomentServiceUtil.getDifference(startDate, endDate, 'days');
		console.log('[Personal account]: start entering data to DB');

		// loop through each day until endDate
		for (let i = 0; i < dayDiffs; i++) {
			console.log(`[Personal account]: entering: [${i}/${dayDiffs}]`);
			// increment starting date
			const date = MomentServiceUtil.addDays(startDate, i);

			// for each day have between 8 to 12 entries
			const numberOfEntries = Math.floor(Math.random() * 5) + 8;
			for (let j = 0; j < numberOfEntries; j++) {
				// get random tag
				const randomTag = newTags[Math.floor(Math.random() * newTags.length)];
				// have 10% change of creating a random description
				const description = Math.random() < 0.1 ? 'Random description' : '';

				// create daily entry
				const entry: PersonalAccountDailyDataCreate = {
					tagId: randomTag.id,
					value: Math.floor(Math.random() * 100),
					description,
					date: date.toString(),
				};

				// save daily entry to DB
				await this.personalAccountDailyService.createPersonalAccountDailyEntry(entry, userId);
			}
		}

		console.log('[Personal account]: finished entering data to DB');
	}

	async initInvestmentAccount(userId: string): Promise<void> {
		console.log(`[Investment account]: initInvestmentAccount, userId: ${userId}`);

		// remove existing investment account
		const existingInvestmentAccount = await this.investmentAccountService.getInvestmentAccountByUserId(userId);
		if (existingInvestmentAccount) {
			await this.investmentAccountService.deleteInvestmentAccount(userId);
			console.log('[Investment account]: removed existing account');
		}

		const newInvestmentAccount = await this.investmentAccountService.createInvestmentAccount(userId);
		const randomTickerSymbols = ['AAPL', 'TSLA', 'GOOG', 'AMZN', 'META', 'MSFT', 'NFLX', 'NVDA', 'PYPL', 'ADBE'];
		console.log('[Investment account]: created new account');

		console.log('[Investment account]: start entering data to DB');
		// for each symbol, create a random number of entries between 4 to 6
		for (const symbol of randomTickerSymbols) {
			console.log(`[Investment account]: entering: ${symbol}`);

			const numberOfEntries = Math.floor(Math.random() * 3) + 4;
			for (let i = 0; i < numberOfEntries; i++) {
				// random units between 8 to 20
				const randomUnits = Math.floor(Math.random() * 12) + 8;
				// random date that is not weekend or holiday maximum 1y back
				const randomDate = MomentServiceUtil.randomWorkingDayInPast();

				// create input data
				const input: InvestmentAccounHoldingCreateInput = {
					type: InvestmentAccountHoldingHistoryType.BUY,
					isCrypto: false,
					symbol,
					holdingInputData: {
						units: randomUnits,
						date: randomDate.toDateString(),
					},
				};

				// save to DB
				await this.investmentAccountHoldingService.createInvestmentAccountHolding(input, userId);
			}
		}
		console.log('[Investment account]: finished entering data to DB');
	}
}
