import { ActionBrouillon, Origine, Priorite } from './domain/action-brouillon';
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
  // Ajoutés après test sur un compte rendu réel (vocabulaire technique/produit).
  'analyser',
  'reproduire',
  'revoir',
  'intègre', // radical change d'accent (intégrer → il intègre), ajouté tel quel
  'résoudre',
  'planifier',
  'livrer',
  'lancer',
  'identifier',
  'documenter',
  'installer',
  'configurer',
  'ouvrir',
  'transmettre',
  'présenter',
  'appeler',
  'rappeler',
  'signaler',
  'suivre',
];

// Mots capitalisés en tête de phrase qui ne sont jamais un prénom (sujet-verbe).
const DETERMINANTS = [
  'la',
  'le',
  'les',
  'une',
  'un',
  'des',
  'ce',
  'cette',
  'ces',
];

// Verbes modaux annonçant une obligation : « Abdou doit vérifier… ».
const MODAUX = ['doit', 'devra', 'doivent', 'devront'];

// Phrases signalant une information non tranchée, à ne surtout pas inventer.
const MARQUEURS_INCERTITUDE =
  /\b(pas encore|ne pourra|reste à|à confirmer|à déterminer)\b/i;

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

const JOURS: Record<string, number> = {
  dimanche: 0,
  lundi: 1,
  mardi: 2,
  mercredi: 3,
  jeudi: 4,
  vendredi: 5,
  samedi: 6,
};

const RESPONSABLE =
  /(?:responsable|resp\.?|assigné(?:e)? à|pilote)[\s\u00A0\u202F]*:?[\s\u00A0\u202F]*([A-ZÀ-Ý][\p{L}-]+(?:\s+[A-ZÀ-Ý][\p{L}-]+)?)/iu;
const MENTION = /@([\p{L}][\p{L}-]+)/u;
// Sujet capitalisé (prénom présumé) suivi d'un second mot : « Abdou doit… », « Mamadou préparera… ».
const SUJET_VERBE = /^([A-ZÀ-Ý][a-zà-öø-ÿ]+)\s+([a-zà-öø-ÿ]+)/u;
const DATE_NUMERIQUE = /(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})/;
const DATE_TEXTUELLE =
  /(\d{1,2})\s+(janvier|février|fevrier|mars|avril|mai|juin|juillet|août|aout|septembre|octobre|novembre|décembre|decembre)(?:\s+(\d{4}))?/i;
const JOUR_RELATIF =
  /\b(?:avant|d'ici|pour)\s+(lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche)(?:\s+(?:soir|matin|midi))?\b/i;
const MARQUEURS_HAUTE =
  /\b(urgent|urgente|prioritaire|bloquant|critique|asap|impératif)\b/i;
const MARQUEURS_BASSE =
  /\b(si possible|plus tard|secondaire|optionnel|à terme|quand possible)\b/i;

export class RulesExtractor implements ActionExtractor {
  extract(texte: string, dateReunion: Date): Promise<ActionBrouillon[]> {
    const actions = this.decouperEnSegments(texte)
      .filter((segment) => this.estUneAction(segment))
      .map((segment) => this.construireAction(segment, dateReunion));

    return Promise.resolve(actions);
  }

  private decouperEnSegments(texte: string): string[] {
    return this.decouperEnLignes(texte).flatMap((ligne) =>
      PUCE.test(ligne) ? [ligne] : this.decouperEnPhrases(ligne),
    );
  }

  private decouperEnLignes(texte: string): string[] {
    return texte
      .split(/\r?\n/)
      .map((ligne) => ligne.trim())
      .filter((ligne) => ligne.length > 0);
  }

  private decouperEnPhrases(ligne: string): string[] {
    return ligne
      .split(/(?<=\.)\s+/)
      .map((phrase) => phrase.trim())
      .filter((phrase) => phrase.length > 0);
  }

  private estUneAction(ligne: string): boolean {
    if (this.estUnTitre(ligne)) return false;
    if (PUCE.test(ligne)) return true;

    const contenu = this.nettoyerPuce(ligne);
    if (this.commenceParUnVerbe(contenu)) return true;
    if (this.extraireSujetActionnable(contenu)) return true;
    return MARQUEURS_INCERTITUDE.test(contenu);
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

  // Détecte « Prénom doit/verbe… » et retourne le prénom, sauf si le mot
  // capitalisé est en fait un déterminant (« La date… », « Une réunion… »).
  private extraireSujetActionnable(ligne: string): string | null {
    const correspondance = SUJET_VERBE.exec(ligne);
    if (!correspondance) return null;

    const [, sujet, verbe] = correspondance;
    if (DETERMINANTS.includes(sujet.toLowerCase())) return null;

    const verbeMinuscule = verbe.toLowerCase();
    const estModal = MODAUX.includes(verbeMinuscule);
    const estVerbeConnu = VERBES_ACTION.some((v) =>
      verbeMinuscule.startsWith(v.slice(0, 5)),
    );

    return estModal || estVerbeConnu ? sujet : null;
  }

  private nettoyerPuce(ligne: string): string {
    return ligne.replace(PUCE, '').trim();
  }

  private construireAction(ligne: string, dateReunion: Date): ActionBrouillon {
    const contenu = this.nettoyerPuce(ligne);
    return {
      description: this.extraireDescription(contenu),
      responsable: this.extraireResponsable(contenu),
      echeance: this.extraireEcheance(contenu, dateReunion),
      priorite: this.extrairePriorite(contenu),
      origine: Origine.REGLE,
    };
  }

  private extraireResponsable(ligne: string): string | null {
    // Une information encore incertaine ne doit jamais se voir attribuer
    // un responsable, même si un mot capitalisé traîne dans la phrase.
    if (MARQUEURS_INCERTITUDE.test(ligne)) return null;

    const explicite = RESPONSABLE.exec(ligne);
    if (explicite) return explicite[1].trim();

    const mention = MENTION.exec(ligne);
    if (mention) return mention[1].trim();

    return this.extraireSujetActionnable(ligne);
  }

  private extraireEcheance(ligne: string, dateReunion: Date): Date | null {
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

    const relatif = JOUR_RELATIF.exec(ligne);
    if (relatif) {
      return this.resoudreJourRelatif(relatif[1].toLowerCase(), dateReunion);
    }

    return null;
  }

  // Résout « avant jeudi » par rapport à la date de réunion (jamais new
  // Date()) : le prochain jour cible, à 7 jours près au maximum.
  private resoudreJourRelatif(nomJour: string, dateReunion: Date): Date {
    const jourReference = dateReunion.getUTCDay();
    const jourCible = JOURS[nomJour];
    const delta = (jourCible - jourReference + 7) % 7 || 7;

    const resultat = new Date(dateReunion);
    resultat.setUTCDate(resultat.getUTCDate() + delta);
    return resultat;
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
      .replace(/[\s.,;–-]+$/, '')
      .trim();
  }
}
