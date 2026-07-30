import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { comptesRendus } from '../api';
import type { CompteRendu } from '../types';

export default function Reunions() {
  const [liste, setListe] = useState<CompteRendu[]>([]);
  const [erreur, setErreur] = useState<string | null>(null);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setListe(await comptesRendus.lister());
      } catch (e) {
        setErreur(e instanceof Error ? e.message : 'Chargement impossible');
      } finally {
        setChargement(false);
      }
    })();
  }, []);

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <h1 className="text-xl text-encre">Comptes rendus</h1>
        <Link
          to="/saisie"
          className="rounded-md bg-or-500 px-4 py-2 text-sm text-white hover:bg-or-600"
        >
          Nouveau
        </Link>
      </div>

      {erreur && (
        <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-800">
          {erreur}
        </p>
      )}

      <div className="mt-5 overflow-hidden rounded-xl border border-bordure bg-white">
        {chargement && <p className="p-6 text-sm text-slate-500">Chargement…</p>}

        {!chargement && liste.length === 0 && (
          <p className="p-6 text-sm text-slate-500">
            Aucun compte rendu enregistré pour le moment.
          </p>
        )}

        {liste.map((cr) => {
          const nombre = cr._count?.actions ?? 0;
          return (
            <Link
              key={cr.id}
              to={`/validation/${cr.id}`}
              className="flex items-center gap-3 border-b border-bordure px-4 py-3 last:border-b-0 hover:bg-ardoise-50"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-encre">{cr.titre}</p>
                <p className="mt-0.5 text-xs text-slate-500">
                  {new Date(cr.dateReunion).toLocaleDateString('fr-FR')}
                </p>
              </div>
              <span
                className={`shrink-0 text-xs ${
                  nombre === 0 ? 'text-or-600' : 'text-slate-500'
                }`}
              >
                {nombre === 0
                  ? 'à valider'
                  : `${nombre} action${nombre > 1 ? 's' : ''}`}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}