import { Test, TestingModule } from '@nestjs/testing';
import { Exersice3Controller } from './exersice3.controller';

describe('Exersice3Controller', () => {
  let controller: Exersice3Controller;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [Exersice3Controller],
    }).compile();

    controller = module.get<Exersice3Controller>(Exersice3Controller);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
