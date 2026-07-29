import { Module } from '@nestjs/common';
import { ACTION_EXTRACTOR } from './domain/extractor.port';
import { ExtractionService } from './extraction.service';
import { RulesExtractor } from './rules.extractor';

@Module({
  providers: [
    ExtractionService,
    { provide: ACTION_EXTRACTOR, useClass: RulesExtractor },
  ],
  exports: [ExtractionService],
})
export class ExtractionModule {}
