import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Exersice3Module } from './exersice3/exersice3.module';

@Module({
  imports: [Exersice3Module],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
