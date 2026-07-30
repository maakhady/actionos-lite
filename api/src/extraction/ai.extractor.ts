import Anthropic from '@anthropic-ai/sdk';
import { ActionBrouillon, Origine, Priorite } from './domain/action-brouillon';
import { ActionExtractor } from './domain/extractor.port';

const MODELE = 'claude-haiku-4-5';

const SCHEMA_SORTIE = {
  type: 'object',
  properties: {
    actions: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          description: { type: 'string' },
          responsable: { type: ['string', 'null'] },
          echeance: { type: ['string', 'null'] },
          priorite: { type: 'string', enum: ['BASSE', 'MOYENNE', 'HAUTE'] },
        },
        required: ['description', 'responsable', 'echeance', 'priorite'],
        additionalProperties: false,
      },
    },
  },
  required: ['actions'],
  additionalProperties: false,
};

const promptSysteme = (
  dateReunion: string,
) => `Tu extrais les actions d'un compte rendu de réunion, en prose ou en liste à puces.

Règles strictes, à respecter sans exception :
- N'invente jamais un responsable ou une échéance absents du texte. Si l'information n'y est pas, retourne null (jamais une chaîne vide, jamais une supposition).
- Une phrase qui décrit un simple fait ou événement à venir (« une réunion est prévue vendredi ») n'est pas une action si elle n'assigne personne à faire quelque chose.
- Une information encore en attente de décision (« le budget n'a pas encore été validé ») doit remonter comme action, mais sans responsable ni échéance inventés.
- Résous les échéances relatives (« avant jeudi », « avant vendredi soir ») par rapport à la date de la réunion : ${dateReunion}. Réponds avec une date ISO (AAAA-MM-JJ), ou null si aucune échéance n'est donnée.
- Priorité par défaut : MOYENNE. HAUTE si le texte indique une urgence (« urgent », « bloquant »...). BASSE si le texte indique une priorité secondaire (« si possible », « plus tard »...).`;

export class AiExtractor implements ActionExtractor {
  constructor(private readonly client: Anthropic) {}

  async extract(texte: string, dateReunion: Date): Promise<ActionBrouillon[]> {
    const dateISO = dateReunion.toISOString().slice(0, 10);

    const reponse = await this.client.messages.create({
      model: MODELE,
      max_tokens: 2048,
      system: promptSysteme(dateISO),
      messages: [{ role: 'user', content: texte }],
      output_config: { format: { type: 'json_schema', schema: SCHEMA_SORTIE } },
    });

    const bloc = reponse.content.find((b) => b.type === 'text');
    if (!bloc || bloc.type !== 'text') {
      throw new Error('Réponse IA sans contenu texte');
    }

    const donnees = JSON.parse(bloc.text) as { actions: unknown[] };
    return donnees.actions.map(validerAction);
  }
}

function validerAction(brut: unknown): ActionBrouillon {
  const a = brut as Record<string, unknown>;

  if (typeof a.description !== 'string') {
    throw new Error('Action IA sans description');
  }
  if (!Object.values(Priorite).includes(a.priorite as Priorite)) {
    throw new Error(`Priorité IA invalide : ${String(a.priorite)}`);
  }

  return {
    description: a.description,
    responsable: typeof a.responsable === 'string' ? a.responsable : null,
    echeance: typeof a.echeance === 'string' ? new Date(a.echeance) : null,
    priorite: a.priorite as Priorite,
    origine: Origine.IA,
  };
}
