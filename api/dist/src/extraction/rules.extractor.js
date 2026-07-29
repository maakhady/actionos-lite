"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RulesExtractor = void 0;
const action_brouillon_1 = require("./domain/action-brouillon");
const PUCE = /^\s*(?:[-*•–—]|\d+[.)])\s+/;
const VERBES_ACTION = [
    'publier',
    'envoyer',
    'préparer',
    'corriger',
    'relancer',
    'vérifier',
    'contacter',
    'ajouter',
    'créer',
    'tester',
    'valider',
    'finaliser',
    'mettre',
    'faire',
    'organiser',
    'rédiger',
    'déployer',
    'partager',
];
const MOIS = {
    janvier: 0,
    février: 1,
    fevrier: 1,
    mars: 2,
    avril: 3,
    mai: 4,
    juin: 5,
    juillet: 6,
    août: 7,
    aout: 7,
    septembre: 8,
    octobre: 9,
    novembre: 10,
    décembre: 11,
    decembre: 11,
};
const RESPONSABLE = /(?:responsable|resp\.?|assigné(?:e)? à|pilote)[\s\u00A0\u202F]*:?[\s\u00A0\u202F]*([A-ZÀ-Ý][\p{L}-]+(?:\s+[A-ZÀ-Ý][\p{L}-]+)?)/iu;
const MENTION = /@([\p{L}][\p{L}-]+)/u;
const DATE_NUMERIQUE = /(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})/;
const DATE_TEXTUELLE = /(\d{1,2})\s+(janvier|février|fevrier|mars|avril|mai|juin|juillet|août|aout|septembre|octobre|novembre|décembre|decembre)(?:\s+(\d{4}))?/i;
const MARQUEURS_HAUTE = /\b(urgent|urgente|prioritaire|bloquant|critique|asap|impératif)\b/i;
const MARQUEURS_BASSE = /\b(si possible|plus tard|secondaire|optionnel|à terme|quand possible)\b/i;
class RulesExtractor {
    extract(texte) {
        const actions = this.decouperEnLignes(texte)
            .filter((ligne) => this.estUneAction(ligne))
            .map((ligne) => this.construireAction(ligne));
        return Promise.resolve(actions);
    }
    decouperEnLignes(texte) {
        return texte
            .split(/\r?\n/)
            .map((ligne) => ligne.trim())
            .filter((ligne) => ligne.length > 0);
    }
    estUneAction(ligne) {
        if (this.estUnTitre(ligne))
            return false;
        if (PUCE.test(ligne))
            return true;
        return this.commenceParUnVerbe(this.nettoyerPuce(ligne));
    }
    estUnTitre(ligne) {
        return ligne.endsWith(':') || ligne.endsWith(' :');
    }
    commenceParUnVerbe(ligne) {
        const premierMot = ligne.toLowerCase().split(/\s+/)[0] ?? '';
        return VERBES_ACTION.some((verbe) => premierMot.startsWith(verbe.slice(0, 5)));
    }
    nettoyerPuce(ligne) {
        return ligne.replace(PUCE, '').trim();
    }
    construireAction(ligne) {
        const contenu = this.nettoyerPuce(ligne);
        return {
            description: this.extraireDescription(contenu),
            responsable: this.extraireResponsable(contenu),
            echeance: this.extraireEcheance(contenu),
            priorite: this.extrairePriorite(contenu),
        };
    }
    extraireResponsable(ligne) {
        const explicite = RESPONSABLE.exec(ligne);
        if (explicite)
            return explicite[1].trim();
        const mention = MENTION.exec(ligne);
        return mention ? mention[1].trim() : null;
    }
    extraireEcheance(ligne) {
        const numerique = DATE_NUMERIQUE.exec(ligne);
        if (numerique) {
            const [, jour, mois, annee] = numerique;
            return new Date(Date.UTC(+annee, +mois - 1, +jour));
        }
        const textuelle = DATE_TEXTUELLE.exec(ligne);
        if (textuelle) {
            const [, jour, mois, annee] = textuelle;
            const indexMois = MOIS[mois.toLowerCase()];
            const anneeRetenue = annee ? +annee : new Date().getUTCFullYear();
            return new Date(Date.UTC(anneeRetenue, indexMois, +jour));
        }
        return null;
    }
    extrairePriorite(ligne) {
        if (MARQUEURS_HAUTE.test(ligne))
            return action_brouillon_1.Priorite.HAUTE;
        if (MARQUEURS_BASSE.test(ligne))
            return action_brouillon_1.Priorite.BASSE;
        return action_brouillon_1.Priorite.MOYENNE;
    }
    extraireDescription(ligne) {
        return ligne
            .replace(RESPONSABLE, '')
            .replace(/\s{2,}/g, ' ')
            .replace(/[\s,;–-]+$/, '')
            .trim();
    }
}
exports.RulesExtractor = RulesExtractor;
//# sourceMappingURL=rules.extractor.js.map