import { ActionBrouillon } from './domain/action-brouillon';
import type { ActionExtractor } from './domain/extractor.port';
export declare class ExtractionService {
    private readonly extractor;
    constructor(extractor: ActionExtractor);
    extraire(texte: string): Promise<ActionBrouillon[]>;
}
