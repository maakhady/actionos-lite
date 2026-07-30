import { ActionBrouillon } from './domain/action-brouillon';
import { ActionExtractor } from './domain/extractor.port';

// Essaie l'extracteur principal (l'IA) ; si ça échoue pour n'importe quelle
// raison (clé absente, timeout, quota, JSON invalide), retombe sur les règles
// déterministes plutôt que de faire planter l'analyse.
export class FallbackExtractor implements ActionExtractor {
  constructor(
    private readonly principal: ActionExtractor,
    private readonly repli: ActionExtractor,
  ) {}

  async extract(texte: string, dateReunion: Date): Promise<ActionBrouillon[]> {
    try {
      return await this.principal.extract(texte, dateReunion);
    } catch {
      return this.repli.extract(texte, dateReunion);
    }
  }
}
