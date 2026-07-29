import { ActionBrouillon } from './action-brouillon';
export declare const ACTION_EXTRACTOR: unique symbol;
export interface ActionExtractor {
    extract(texte: string): Promise<ActionBrouillon[]>;
}
