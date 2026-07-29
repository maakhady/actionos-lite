import { ActionBrouillon } from './action-brouillon';

export const ACTION_EXTRACTOR = Symbol('ACTION_EXTRACTOR');

export interface ActionExtractor {
  extract(texte: string): Promise<ActionBrouillon[]>;
}
