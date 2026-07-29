import { ActionBrouillon } from './domain/action-brouillon';
import { ActionExtractor } from './domain/extractor.port';
export declare class RulesExtractor implements ActionExtractor {
    extract(texte: string): Promise<ActionBrouillon[]>;
    private decouperEnLignes;
    private estUneAction;
    private estUnTitre;
    private commenceParUnVerbe;
    private nettoyerPuce;
    private construireAction;
    private extraireResponsable;
    private extraireEcheance;
    private extrairePriorite;
    private extraireDescription;
}
