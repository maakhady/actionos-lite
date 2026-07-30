import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const TEXTE_QUIZZ_PLUS = `L'équipe confirme que la version Android doit être disponible pour les prochains tests utilisateurs. Abdou doit vérifier la configuration Play Store avant jeudi. Awa doit corriger les erreurs signalées sur le classement avant vendredi. Mamadou préparera le message destiné aux testeurs et devra le faire valider avant mercredi soir. La date de lancement ne pourra être confirmée qu'après les tests. Une nouvelle réunion est prévue vendredi à 15 heures. Le budget de la campagne de lancement n'a pas encore été validé.`;

async function main() {
  await prisma.action.deleteMany();
  await prisma.compteRendu.deleteMany();

  await prisma.compteRendu.create({
    data: {
      titre: 'Réunion Projet Quizz+',
      dateReunion: new Date('2026-07-27'),
      texteSource: TEXTE_QUIZZ_PLUS,
    },
  });

  console.log('Seed terminé : compte rendu Quizz+ inséré');
}

main()
  .catch((erreur) => {
    console.error(erreur);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
