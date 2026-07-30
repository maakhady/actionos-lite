import { AiExtractor } from './ai.extractor';

// Client Anthropic minimal, mocké : aucun appel réseau réel dans ce test.
function clientMocke(reponseJson: unknown) {
  return {
    messages: {
      create: jest.fn().mockResolvedValue({
        content: [{ type: 'text', text: JSON.stringify(reponseJson) }],
      }),
    },
  } as any;
}

describe('AiExtractor', () => {
  const DATE_REF = new Date('2026-07-27');

  it('convertit la réponse IA en ActionBrouillon', async () => {
    const client = clientMocke({
      actions: [
        {
          description: 'Vérifier la configuration Play Store',
          responsable: 'Abdou',
          echeance: '2026-07-30',
          priorite: 'MOYENNE',
        },
      ],
    });

    const actions = await new AiExtractor(client).extract('texte', DATE_REF);

    expect(actions).toHaveLength(1);
    expect(actions[0].responsable).toBe('Abdou');
    expect(actions[0].echeance?.toISOString()).toContain('2026-07-30');
    expect(actions[0].origine).toBe('IA');
  });

  it("laisse responsable/échéance à null quand l'IA répond null", async () => {
    const client = clientMocke({
      actions: [
        {
          description: 'Le budget n’a pas encore été validé',
          responsable: null,
          echeance: null,
          priorite: 'MOYENNE',
        },
      ],
    });

    const actions = await new AiExtractor(client).extract('texte', DATE_REF);

    expect(actions[0].responsable).toBeNull();
    expect(actions[0].echeance).toBeNull();
  });

  it('rejette une réponse IA dont la priorité est invalide', async () => {
    const client = clientMocke({
      actions: [
        { description: 'x', responsable: null, echeance: null, priorite: 'URGENT' },
      ],
    });

    await expect(new AiExtractor(client).extract('texte', DATE_REF)).rejects.toThrow();
  });

  it('rejette une réponse IA sans bloc texte', async () => {
    const client = { messages: { create: jest.fn().mockResolvedValue({ content: [] }) } } as any;

    await expect(new AiExtractor(client).extract('texte', DATE_REF)).rejects.toThrow();
  });
});
