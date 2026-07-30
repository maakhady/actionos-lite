import Anthropic from '@anthropic-ai/sdk';
import { Module } from '@nestjs/common';
import { ACTION_EXTRACTOR, ActionExtractor } from './domain/extractor.port';
import { ExtractionService } from './extraction.service';
import { RulesExtractor } from './rules.extractor';
import { AiExtractor } from './ai.extractor';
import { FallbackExtractor } from './fallback.extractor';

// Sans clé API, l'extraction reste 100% déterministe (le MVP fonctionne
// sans dépendre d'une IA). Avec une clé, l'IA est essayée en premier et
// retombe automatiquement sur les règles en cas d'échec.
function creerExtracteur(): ActionExtractor {
  const cleApi = process.env.ANTHROPIC_API_KEY;
  const regles = new RulesExtractor();

  if (!cleApi) return regles;

  const client = new Anthropic({ apiKey: cleApi, timeout: 15000 });
  return new FallbackExtractor(new AiExtractor(client), regles);
}

@Module({
  providers: [
    ExtractionService,
    { provide: ACTION_EXTRACTOR, useFactory: creerExtracteur },
  ],
  exports: [ExtractionService],
})
export class ExtractionModule {}
