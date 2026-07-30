import { ActionBrouillon, Priorite } from './domain/action-brouillon';
import { ActionExtractor } from './domain/extractor.port';

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

const MOIS: Record<string, number> = {
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

const RESPONSABLE =
  /(?:responsable|resp\.?|assigné(?:e)? à|pilote)[\s\u00A0\u202F]*:?[\s\u00A0\u202F]*([A-ZÀ-Ý][\p{L}-]+(?:\s+[A-ZÀ-Ý][\p{L}-]+)?)/iu;
const MENTION = /@([\p{L}][\p{L}-]+)/u;
const DATE_NUMERIQUE = /(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})/;
const DATE_TEXTUELLE =
  /(\d{1,2})\s+(janvier|février|fevrier|mars|avril|mai|juin|juillet|août|aout|septembre|octobre|novembre|décembre|decembre)(?:\s+(\d{4}))?/i;
const MARQUEURS_HAUTE =
  /\b(urgent|urgente|prioritaire|bloquant|critique|asap|impératif)\b/i;
const MARQUEURS_BASSE =
  /\b(si possible|plus tard|secondaire|optionnel|à terme|quand possible)\b/i;

export class RulesExtractor implements ActionExtractor {
  extract(texte: string, dateReunion: Date): Promise<ActionBrouillon[]> {
    const actions = this.decouperEnLignes(texte)
      .filter((ligne) => this.estUneAction(ligne))
      .map((ligne) => this.construireAction(ligne));

    return Promise.resolve(actions);
  }

  private decouperEnLignes(texte: string): string[] {
    return texte
      .split(/\r?\n/)
      .map((ligne) => ligne.trim())
      .filter((ligne) => ligne.length > 0);
  }

  private estUneAction(ligne: string): boolean {
    if (this.estUnTitre(ligne)) return false;
    if (PUCE.test(ligne)) return true;
    return this.commenceParUnVerbe(this.nettoyerPuce(ligne));
  }

  private estUnTitre(ligne: string): boolean {
    return ligne.endsWith(':') || ligne.endsWith(' :');
  }

  private commenceParUnVerbe(ligne: string): boolean {
    const premierMot = ligne.toLowerCase().split(/\s+/)[0] ?? '';
    return VERBES_ACTION.some((verbe) =>
      premierMot.startsWith(verbe.slice(0, 5)),
    );
  }

  private nettoyerPuce(ligne: string): string {
    return ligne.replace(PUCE, '').trim();
  }

  private construireAction(ligne: string): ActionBrouillon {
    const contenu = this.nettoyerPuce(ligne);
    return {
      description: this.extraireDescription(contenu),
      responsable: this.extraireResponsable(contenu),
      echeance: this.extraireEcheance(contenu),
      priorite: this.extrairePriorite(contenu),
    };
  }

  private extraireResponsable(ligne: string): string | null {
    const explicite = RESPONSABLE.exec(ligne);
    if (explicite) return explicite[1].trim();

    const mention = MENTION.exec(ligne);
    return mention ? mention[1].trim() : null;
  }

  private extraireEcheance(ligne: string): Date | null {
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

  private extrairePriorite(ligne: string): Priorite {
    if (MARQUEURS_HAUTE.test(ligne)) return Priorite.HAUTE;
    if (MARQUEURS_BASSE.test(ligne)) return Priorite.BASSE;
    return Priorite.MOYENNE;
  }

  private extraireDescription(ligne: string): string {
    return ligne
      .replace(RESPONSABLE, '')
      .replace(/\s{2,}/g, ' ')
      .replace(/[\s,;–-]+$/, '')
      .trim();
  }
}
