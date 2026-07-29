import { Module } from '@nestjs/common';
import { ComptesRendusService } from './comptes-rendus.service';
import { ComptesRendusController } from './comptes-rendus.controller';
import { ExtractionModule } from '../extraction/extraction.module';

@Module({
  imports: [ExtractionModule],
  controllers: [ComptesRendusController],
  providers: [ComptesRendusService],
})
export class ComptesRendusModule {}
