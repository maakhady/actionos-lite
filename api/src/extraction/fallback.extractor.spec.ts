import { FallbackExtractor } from './fallback.extractor';
import { Origine, Priorite } from './domain/action-brouillon';

const ACTION_REPLI = [
  {
    description: 'Action de repli',
    responsable: null,
    echeance: null,
    priorite: Priorite.MOYENNE,
    origine: Origine.REGLE,
  },
];

describe('FallbackExtractor', () => {
  const DATE_REF = new Date('2026-07-27');

  it("utilise l'extracteur principal quand il réussit", async () => {
    const principal = {
      extract: jest.fn().mockResolvedValue([]),
    };
    const repli = {
      extract: jest.fn().mockResolvedValue(ACTION_REPLI),
    };

    const actions = await new FallbackExtractor(principal, repli).extract(
      'texte',
      DATE_REF,
    );

    expect(principal.extract).toHaveBeenCalled();
    expect(repli.extract).not.toHaveBeenCalled();
    expect(actions).toEqual([]);
  });

  it("retombe sur l'extracteur de repli si le principal échoue", async () => {
    const principal = {
      extract: jest.fn().mockRejectedValue(new Error('clé API absente')),
    };
    const repli = {
      extract: jest.fn().mockResolvedValue(ACTION_REPLI),
    };

    const actions = await new FallbackExtractor(principal, repli).extract(
      'texte',
      DATE_REF,
    );

    expect(repli.extract).toHaveBeenCalledWith('texte', DATE_REF);
    expect(actions).toEqual(ACTION_REPLI);
  });
});
