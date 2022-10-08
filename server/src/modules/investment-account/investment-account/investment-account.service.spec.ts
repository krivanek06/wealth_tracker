import { Test, TestingModule } from '@nestjs/testing';
import { InvestmentAccountService } from './investment-account.service';

describe('InvestmentAccountService', () => {
  let service: InvestmentAccountService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InvestmentAccountService],
    }).compile();

    service = module.get<InvestmentAccountService>(InvestmentAccountService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
