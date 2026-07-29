"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const TEXTE_QUIZZ_PLUS = `Réunion Projet Quizz+ — 27 juillet 2026

Points abordés :
- Publier la nouvelle version sur le Play Store avant le 05/08/2026
- Corriger le bug bloquant du classement des joueurs
- Envoyer un message aux testeurs (Responsable : Fatou)
- Vérifier la fiche Play Store`;
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
//# sourceMappingURL=seed.js.map