import { Test, TestingModule } from '@nestjs/testing';
import { Exersice3Service } from './exersice3.service';

describe('Exersice3Service', () => {
  let service: Exersice3Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Exersice3Service],
    }).compile();

    service = module.get<Exersice3Service>(Exersice3Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
