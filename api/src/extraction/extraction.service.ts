import { Inject, Injectable } from '@nestjs/common';
import { ActionBrouillon } from './domain/action-brouillon';
import { ACTION_EXTRACTOR } from './domain/extractor.port';
import type { ActionExtractor } from './domain/extractor.port';

@Injectable()
export class ExtractionService {
  constructor(
    @Inject(ACTION_EXTRACTOR) private readonly extractor: ActionExtractor,
  ) {}

  extraire(texte: string): Promise<ActionBrouillon[]> {
    return this.extractor.extract(texte);
  }
}
