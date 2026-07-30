import { useEffect, useState } from 'react';
import { actions as apiActions } from '../api';
import type { Action, Priorite, Statut } from '../types';

const STATUTS: Statut[] = ['A_FAIRE', 'EN_COURS', 'TERMINE'];

const LIBELLE_STATUT: Record<Statut, string> = {
  A_FAIRE: 'À faire',
  EN_COURS: 'En cours',
  TERMINE: 'Terminé',
};

const LIBELLE_PRIORITE: Record<Priorite, string> = {
  BASSE: 'Faible',
  MOYENNE: 'Moyenne',
  HAUTE: 'Haute',
};

// Couleurs neutres (ni rouge ni doré : ces deux-là sont réservés au retard
// et au « à confirmer », voir section 7 du contexte).
const COULEUR_PRIORITE: Record<Priorite, string> = {
  BASSE: 'border border-bordure text-slate-500',
  MOYENNE: 'bg-ardoise-100 text-encre',
  HAUTE: 'bg-marine-900 text-white',
};

const estEnRetard = (action: Action) =>
  action.echeance !== null &&
  action.statut !== 'TERMINE' &&
  new Date(action.echeance) < new Date(new Date().toDateString());

export default function Suivi() {
  const [liste, setListe] = useState<Action[]>([]);
  const [filtre, setFiltre] = useState<Statut | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);
  const [chargement, setChargement] = useState(true);

  const charger = async (statut: Statut | null) => {
    setChargement(true);
    try {
      setListe(await apiActions.lister(statut ?? undefined));
    } catch (e) {
      setErreur(e instanceof Error ? e.message : 'Chargement impossible');
    } finally {
      setChargement(false);
    }
  };

  useEffect(() => {
    void charger(filtre);
  }, [filtre]);

  const changerStatut = async (id: string, statut: Statut) => {
    try {
      await apiActions.modifier(id, { statut });
      void charger(filtre);
    } catch (e) {
      setErreur(e instanceof Error ? e.message : 'Modification impossible');
    }
  };

  const supprimer = async (id: string) => {
    try {
      await apiActions.supprimer(id);
      void charger(filtre);
    } catch (e) {
      setErreur(e instanceof Error ? e.message : 'Suppression impossible');
    }
  };

  const retards = liste.filter(estEnRetard).length;
  const aConfirmer = liste.filter((a) => !a.responsable || !a.echeance).length;

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <h1 className="text-xl text-encre">Suivi des actions</h1>
        <div className="flex items-center gap-4 text-sm">
          {aConfirmer > 0 && (
            <span className="text-or-600">{aConfirmer} à confirmer</span>
          )}
          {retards > 0 && (
            <span className="text-red-700">
              {retards} en retard
            </span>
          )}
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          onClick={() => setFiltre(null)}
          className={`rounded-full px-3 py-1 text-sm ${
            filtre === null
              ? 'bg-marine-900 text-white'
              : 'border border-bordure bg-white text-slate-600 hover:border-slate-400'
          }`}
        >
          Toutes
        </button>
        {STATUTS.map((statut) => (
          <button
            key={statut}
            onClick={() => setFiltre(statut)}
            className={`rounded-full px-3 py-1 text-sm ${
              filtre === statut
                ? 'bg-marine-900 text-white'
                : 'border border-bordure bg-white text-slate-600 hover:border-slate-400'
            }`}
          >
            {LIBELLE_STATUT[statut]}
          </button>
        ))}
      </div>

      {erreur && (
        <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-800">
          {erreur}
        </p>
      )}

      <div className="mt-5 overflow-hidden rounded-xl border border-bordure bg-white">
        {chargement && (
          <p className="p-6 text-sm text-slate-500">Chargement…</p>
        )}

        {!chargement && liste.length === 0 && (
          <p className="p-6 text-sm text-slate-500">
            Aucune action pour ce filtre.
          </p>
        )}

        {liste.map((action) => {
          const retard = estEnRetard(action);
          const incomplete = !action.responsable || !action.echeance;
          return (
            <div
              key={action.id}
              className={`flex flex-wrap items-center gap-3 border-b border-bordure px-4 py-3 last:border-b-0 ${
                incomplete ? 'bg-or-100' : ''
              }`}
            >
              <span
                className={`shrink-0 rounded-full px-2 py-0.5 text-xs ${COULEUR_PRIORITE[action.priorite]}`}
              >
                {LIBELLE_PRIORITE[action.priorite]}
              </span>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-encre">{action.description}</p>
                <p className="mt-0.5 text-xs text-slate-500">
                  {action.compteRendu?.titre}
                  {action.responsable ? (
                    ` · ${action.responsable}`
                  ) : (
                    <span className="text-or-600"> · responsable à confirmer</span>
                  )}
                </p>
              </div>

              <span
                className={`shrink-0 text-xs ${
                  retard ? 'text-red-700' : incomplete ? 'text-or-600' : 'text-slate-500'
                }`}
              >
                {action.echeance
                  ? new Date(action.echeance).toLocaleDateString('fr-FR', {
                      weekday: 'long',
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })
                  : 'échéance à confirmer'}
                {retard && ' · en retard'}
              </span>

              <select
                value={action.statut}
                onChange={(e) => void changerStatut(action.id, e.target.value as Statut)}
                className="shrink-0 rounded-md border border-bordure bg-white px-2 py-1 text-xs outline-none focus:border-or-500"
              >
                {STATUTS.map((s) => (
                  <option key={s} value={s}>
                    {LIBELLE_STATUT[s]}
                  </option>
                ))}
              </select>

              <button
                onClick={() => void supprimer(action.id)}
                className="shrink-0 text-xs text-slate-400 hover:text-red-700"
              >
                Supprimer
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
