import { Module } from '@nestjs/common';
import { Exersice3Controller } from './exersice3.controller';
import { Exersice3Service } from './exersice3.service';

@Module({
  controllers: [Exersice3Controller],
  providers: [Exersice3Service]
})
export class Exersice3Module {}
