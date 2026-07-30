import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { comptesRendus } from '../api';

const EXEMPLE = {
  titre: 'Réunion Projet Quizz+',
  dateReunion: '2026-07-27',
  texteSource: `L'équipe confirme que la version Android doit être disponible pour les prochains tests utilisateurs. Abdou doit vérifier la configuration Play Store avant jeudi. Awa doit corriger les erreurs signalées sur le classement avant vendredi. Mamadou préparera le message destiné aux testeurs et devra le faire valider avant mercredi soir. La date de lancement ne pourra être confirmée qu'après les tests. Une nouvelle réunion est prévue vendredi à 15 heures. Le budget de la campagne de lancement n'a pas encore été validé.`,
};

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

// Pré-remplissage uniquement : le champ reste modifiable et le bouton
// Analyser reste bloqué tant qu'il n'est pas rempli, rien n'est deviné en
// silence.
function detecterTitre(texte: string): string | null {
  const premiereLigne = texte.split(/\r?\n/).find((l) => l.trim().length > 0);
  if (!premiereLigne) return null;
  const nettoyee = premiereLigne.replace(/^compte[\s-]?rendu\s*[—:-]?\s*/i, '').trim();
  return nettoyee || null;
}

function detecterDate(texte: string): string | null {
  const textuelle = texte.match(
    /(\d{1,2})\s+(janvier|février|fevrier|mars|avril|mai|juin|juillet|août|aout|septembre|octobre|novembre|décembre|decembre)\s+(\d{4})/i,
  );
  if (textuelle) {
    const [, jour, mois, annee] = textuelle;
    const indexMois = MOIS[mois.toLowerCase()];
    return `${annee}-${String(indexMois + 1).padStart(2, '0')}-${jour.padStart(2, '0')}`;
  }

  const numerique = texte.match(/(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})/);
  if (numerique) {
    const [, jour, mois, annee] = numerique;
    return `${annee}-${mois.padStart(2, '0')}-${jour.padStart(2, '0')}`;
  }

  return null;
}

export default function Saisie() {
  const navigate = useNavigate();
  const [titre, setTitre] = useState('');
  const [dateReunion, setDateReunion] = useState('');
  const [texteSource, setTexteSource] = useState('');
  const [erreur, setErreur] = useState<string | null>(null);
  const [enCours, setEnCours] = useState(false);

  // Tant que l'utilisateur n'a pas touché le champ lui-même, on continue de
  // le resynchroniser avec ce qui est détecté dans le texte (couvre le
  // copier-coller comme la frappe caractère par caractère).
  const [titreAuto, setTitreAuto] = useState(true);
  const [dateAuto, setDateAuto] = useState(true);

  const chargerExemple = () => {
    setTitre(EXEMPLE.titre);
    setDateReunion(EXEMPLE.dateReunion);
    setTexteSource(EXEMPLE.texteSource);
    setTitreAuto(false);
    setDateAuto(false);
    setErreur(null);
  };

  const changerTexte = (valeur: string) => {
    setTexteSource(valeur);
    if (titreAuto) setTitre(detecterTitre(valeur) ?? '');
    if (dateAuto) setDateReunion(detecterDate(valeur) ?? '');
  };

  const changerTitre = (valeur: string) => {
    setTitreAuto(false);
    setTitre(valeur);
  };

  const changerDate = (valeur: string) => {
    setDateAuto(false);
    setDateReunion(valeur);
  };

  const analyser = async () => {
    setErreur(null);
    setEnCours(true);
    try {
      const cr = await comptesRendus.creer({ titre, dateReunion, texteSource });
      navigate(`/validation/${cr.id}`);
    } catch (e) {
      setErreur(e instanceof Error ? e.message : 'Une erreur est survenue');
    } finally {
      setEnCours(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-xl text-encre">Nouveau compte rendu</h1>
      <p className="mt-1 text-sm text-slate-500">
        Collez le texte de la réunion. Les actions seront extraites, vous les
        validerez à l'étape suivante.
      </p>

      <div className="mt-6 space-y-4 rounded-xl border border-bordure bg-white p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-xs text-slate-500">Titre</span>
            <input
              value={titre}
              onChange={(e) => changerTitre(e.target.value)}
              placeholder="Réunion hebdomadaire produit"
              className="mt-1 w-full rounded-md border border-bordure bg-white px-3 py-2 text-sm outline-none focus:border-or-500"
            />
          </label>

          <label className="block">
            <span className="text-xs text-slate-500">Date de la réunion</span>
            <input
              type="date"
              value={dateReunion}
              onChange={(e) => changerDate(e.target.value)}
              className="mt-1 w-full rounded-md border border-bordure bg-white px-3 py-2 text-sm outline-none focus:border-or-500"
            />
          </label>
        </div>

        <label className="block">
          <span className="text-xs text-slate-500">Compte rendu</span>
          <textarea
            value={texteSource}
            onChange={(e) => changerTexte(e.target.value)}
            rows={12}
            placeholder="Collez ici le texte de la réunion, en prose ou en liste à puces."
            className="mt-1 w-full rounded-md border border-bordure bg-white px-3 py-2 text-sm leading-relaxed outline-none focus:border-or-500"
          />
        </label>

        {erreur && (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-800">
            {erreur}
          </p>
        )}

        <div className="flex items-center justify-between border-t border-bordure pt-4">
          <button
            onClick={chargerExemple}
            className="text-sm text-slate-500 underline underline-offset-4 hover:text-encre"
          >
            Charger l'exemple Quizz+
          </button>

          <button
            onClick={analyser}
            disabled={enCours || !titre || !dateReunion || !texteSource}
            className="rounded-md bg-or-500 px-5 py-2 text-sm text-white hover:bg-or-600 disabled:opacity-40"
          >
            {enCours ? 'Analyse…' : 'Analyser'}
          </button>
        </div>
      </div>
    </div>
  );
}