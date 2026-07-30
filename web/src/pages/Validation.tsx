import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { actions as apiActions, comptesRendus } from '../api';
import type { ActionBrouillon, CompteRendu, Priorite } from '../types';

const PRIORITES: Priorite[] = ['BASSE', 'MOYENNE', 'HAUTE'];

const LIBELLE_PRIORITE: Record<Priorite, string> = {
  BASSE: 'Basse',
  MOYENNE: 'Moyenne',
  HAUTE: 'Haute',
};

const ACTION_VIDE: ActionBrouillon = {
  description: '',
  responsable: null,
  echeance: null,
  priorite: 'MOYENNE',
};

export default function Validation() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [compteRendu, setCompteRendu] = useState<CompteRendu | null>(null);
  const [brouillons, setBrouillons] = useState<ActionBrouillon[]>([]);
  const [erreur, setErreur] = useState<string | null>(null);
  const [chargement, setChargement] = useState(true);
  const [enCours, setEnCours] = useState(false);
  const [dejaValide, setDejaValide] = useState(false);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const cr = await comptesRendus.recuperer(id);
        setCompteRendu(cr);

        if (cr.actions && cr.actions.length > 0) {
          setDejaValide(true);
          setBrouillons(cr.actions);
          return;
        }

        setBrouillons(
          await comptesRendus.analyser(cr.texteSource, cr.dateReunion),
        );
      } catch (e) {
        setErreur(e instanceof Error ? e.message : 'Chargement impossible');
      } finally {
        setChargement(false);
      }
    })();
  }, [id]);

  const modifier = (index: number, champ: keyof ActionBrouillon, valeur: string) => {
    setBrouillons((liste) =>
      liste.map((action, i) =>
        i === index
          ? { ...action, [champ]: valeur === '' ? null : valeur }
          : action,
      ),
    );
  };

  const supprimer = (index: number) =>
    setBrouillons((liste) => liste.filter((_, i) => i !== index));

  const ajouter = () => setBrouillons((liste) => [...liste, { ...ACTION_VIDE }]);

  const enregistrer = async () => {
    if (!id) return;
    setErreur(null);
    setEnCours(true);
    try {
      await apiActions.valider(id, brouillons);
      navigate('/suivi');
    } catch (e) {
      setErreur(e instanceof Error ? e.message : 'Enregistrement impossible');
    } finally {
      setEnCours(false);
    }
  };

  if (chargement) return <p className="text-sm text-slate-500">Analyse en cours…</p>;

  const incompletes = brouillons.filter((a) => !a.responsable || !a.echeance).length;
  const valides = brouillons.filter((a) => a.description.trim()).length;

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <h1 className="text-xl text-encre">{compteRendu?.titre}</h1>
        <span className="text-sm text-slate-500">
          {compteRendu && new Date(compteRendu.dateReunion).toLocaleDateString('fr-FR')}
        </span>
      </div>
      <p className="mt-1 text-sm text-slate-500">
        {brouillons.length} action{brouillons.length > 1 ? 's' : ''}{' '}
        {dejaValide ? 'enregistrée' : 'détectée'}
        {brouillons.length > 1 ? 's' : ''}
        {incompletes > 0 && ` · ${incompletes} à compléter`}
        {!dejaValide && " · relisez et corrigez avant d'enregistrer"}
      </p>

      {dejaValide && (
        <div className="mt-4 rounded-md border border-bordure bg-ardoise-100 px-4 py-3 text-sm text-encre">
          Ce compte rendu a déjà été validé. Les actions se modifient depuis le{' '}
          <Link to="/suivi" className="text-or-600 underline underline-offset-2">
            tableau de suivi
          </Link>
          .
        </div>
      )}

      <div className="mt-6 space-y-3">
        {brouillons.map((action, index) => {
          const incomplete = !action.responsable || !action.echeance;
          return (
            <div
              key={index}
              className={`rounded-xl border p-4 ${
                incomplete ? 'border-or-500 bg-or-100' : 'border-bordure bg-white'
              }`}
            >
              <div className="flex items-start gap-3">
                <input
                  value={action.description}
                  onChange={(e) => modifier(index, 'description', e.target.value)}
                  disabled={dejaValide}
                  placeholder="Description de l'action"
                  className="flex-1 rounded-md border border-transparent bg-transparent px-2 py-1 text-sm outline-none hover:border-bordure focus:border-or-500 focus:bg-white disabled:hover:border-transparent"
                />
                {incomplete && (
                  <span className="shrink-0 rounded-full bg-white px-2 py-0.5 text-xs text-or-600">
                    à confirmer
                  </span>
                )}
                {!dejaValide && (
                  <button
                    onClick={() => supprimer(index)}
                    className="shrink-0 text-xs text-slate-400 hover:text-red-700"
                  >
                    Supprimer
                  </button>
                )}
              </div>

              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                <label className="block">
                  <span className="text-xs text-slate-500">Responsable</span>
                  <input
                    value={action.responsable ?? ''}
                    onChange={(e) => modifier(index, 'responsable', e.target.value)}
                    disabled={dejaValide}
                    placeholder="non précisé"
                    className={`mt-1 w-full rounded-md border bg-white px-2 py-1.5 text-sm outline-none focus:border-or-500 disabled:bg-transparent ${
                      action.responsable ? 'border-bordure' : 'border-or-500'
                    }`}
                  />
                </label>

                <label className="block">
                  <span className="text-xs text-slate-500">Échéance</span>
                  <input
                    type="date"
                    value={action.echeance ? action.echeance.slice(0, 10) : ''}
                    onChange={(e) => modifier(index, 'echeance', e.target.value)}
                    disabled={dejaValide}
                    className={`mt-1 w-full rounded-md border bg-white px-2 py-1.5 text-sm outline-none focus:border-or-500 disabled:bg-transparent ${
                      action.echeance ? 'border-bordure' : 'border-or-500'
                    }`}
                  />
                </label>

                <label className="block">
                  <span className="text-xs text-slate-500">Priorité</span>
                  <select
                    value={action.priorite}
                    onChange={(e) => modifier(index, 'priorite', e.target.value)}
                    disabled={dejaValide}
                    className="mt-1 w-full rounded-md border border-bordure bg-white px-2 py-1.5 text-sm outline-none focus:border-or-500 disabled:bg-transparent"
                  >
                    {PRIORITES.map((p) => (
                      <option key={p} value={p}>
                        {LIBELLE_PRIORITE[p]}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>
          );
        })}

        {brouillons.length === 0 && (
          <p className="rounded-xl border border-dashed border-bordure p-6 text-center text-sm text-slate-500">
            Aucune action détectée dans ce compte rendu. Vous pouvez en ajouter
            manuellement.
          </p>
        )}
      </div>

      {erreur && (
        <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-800">
          {erreur}
        </p>
      )}

      <div className="mt-6 flex items-center justify-between border-t border-bordure pt-4">
        {dejaValide ? (
          <Link
            to="/reunions"
            className="rounded-md border border-bordure bg-white px-3 py-2 text-sm text-slate-600 hover:border-slate-400"
          >
            Retour aux comptes rendus
          </Link>
        ) : (
          <button
            onClick={ajouter}
            className="rounded-md border border-bordure bg-white px-3 py-2 text-sm text-slate-600 hover:border-slate-400"
          >
            Ajouter une action
          </button>
        )}

        {!dejaValide && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/saisie')}
              className="px-3 py-2 text-sm text-slate-500 hover:text-encre"
            >
              Annuler
            </button>
            <button
              onClick={enregistrer}
              disabled={enCours || valides === 0}
              className="rounded-md bg-or-500 px-5 py-2 text-sm text-white hover:bg-or-600 disabled:opacity-40"
            >
              {enCours
                ? 'Enregistrement…'
                : `Enregistrer ${valides} action${valides > 1 ? 's' : ''}`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}