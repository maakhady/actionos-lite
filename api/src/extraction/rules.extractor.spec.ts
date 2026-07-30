import { RulesExtractor } from './rules.extractor';

describe('RulesExtractor', () => {
  const extractor = new RulesExtractor();
  const DATE_REF = new Date('2026-07-27');

  it('ignore les lignes de titre', async () => {
    const actions = await extractor.extract(
      'Points abordés :\n- Publier la version 1.2',
      DATE_REF,
    );

    expect(actions).toHaveLength(1);
    expect(actions[0].description).toBe('Publier la version 1.2');
  });

  it('extrait un responsable explicite', async () => {
    const actions = await extractor.extract(
      '- Envoyer le message aux testeurs (Responsable : Fatou)',
      DATE_REF,
    );

    expect(actions[0].responsable).toBe('Fatou');
    expect(actions[0].description).not.toContain('Responsable');
  });

  it('extrait un responsable mentionné par arobase', async () => {
    const actions = await extractor.extract(
      '- Corriger le classement @Moussa',
      DATE_REF,
    );

    expect(actions[0].responsable).toBe('Moussa');
  });

  it('laisse le responsable à null quand il est absent', async () => {
    const actions = await extractor.extract(
      '- Vérifier la fiche Play Store',
      DATE_REF,
    );

    expect(actions[0].responsable).toBeNull();
    expect(actions[0].echeance).toBeNull();
  });

  it('extrait une échéance au format numérique', async () => {
    const actions = await extractor.extract(
      '- Publier la mise à jour avant le 05/08/2026',
      DATE_REF,
    );

    expect(actions[0].echeance?.toISOString()).toContain('2026-08-05');
  });

  it('extrait une échéance au format textuel', async () => {
    const actions = await extractor.extract(
      '- Préparer le message pour le 3 août 2026',
      DATE_REF,
    );

    expect(actions[0].echeance?.toISOString()).toContain('2026-08-03');
  });

  it('détecte la priorité haute', async () => {
    const actions = await extractor.extract(
      '- Corriger le bug bloquant du classement',
      DATE_REF,
    );

    expect(actions[0].priorite).toBe('HAUTE');
  });

  it('retombe sur la priorité moyenne par défaut', async () => {
    const actions = await extractor.extract(
      '- Tester la nouvelle version',
      DATE_REF,
    );

    expect(actions[0].priorite).toBe('MOYENNE');
  });

  it("n'invente rien sur un texte sans action", async () => {
    const actions = await extractor.extract(
      'Réunion du 27 juillet. Tour de table.',
      DATE_REF,
    );

    expect(actions).toHaveLength(0);
  });

  it('extrait les actions du CR Quizz+ en prose continue', async () => {
    const texte = `L'équipe confirme que la version Android doit être disponible pour les prochains tests utilisateurs. Abdou doit vérifier la configuration Play Store avant jeudi. Awa doit corriger les erreurs signalées sur le classement avant vendredi. Mamadou préparera le message destiné aux testeurs et devra le faire valider avant mercredi soir. La date de lancement ne pourra être confirmée qu'après les tests. Une nouvelle réunion est prévue vendredi à 15 heures. Le budget de la campagne de lancement n'a pas encore été validé.`;

    const actions = await extractor.extract(texte, DATE_REF);

    const abdou = actions.find((a) => a.responsable === 'Abdou');
    expect(abdou?.echeance?.toISOString()).toContain('2026-07-30');

    const awa = actions.find((a) => a.responsable === 'Awa');
    expect(awa?.echeance?.toISOString()).toContain('2026-07-31');

    const mamadou = actions.find((a) => a.responsable === 'Mamadou');
    expect(mamadou?.echeance?.toISOString()).toContain('2026-07-29');

    const aConfirmer = actions.filter(
      (a) => a.responsable === null && a.echeance === null,
    );
    expect(aConfirmer.length).toBeGreaterThanOrEqual(2);

    expect(actions).toHaveLength(5);
  });
});
