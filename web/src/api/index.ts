import { api } from './client';
import type { Action, ActionBrouillon, CompteRendu, Statut } from '../types';

export const comptesRendus = {
  lister: () => api.get<CompteRendu[]>('/comptes-rendus'),
  recuperer: (id: string) => api.get<CompteRendu>(`/comptes-rendus/${id}`),
  creer: (donnees: { titre: string; dateReunion: string; texteSource: string }) =>
    api.post<CompteRendu>('/comptes-rendus', donnees),
  analyser: (texteSource: string, dateReunion: string) =>
    api.post<ActionBrouillon[]>('/comptes-rendus/analyser', {
      texteSource,
      dateReunion,
    }),
  supprimer: (id: string) => api.delete<void>(`/comptes-rendus/${id}`),
};

export const actions = {
  lister: (statut?: Statut) =>
    api.get<Action[]>(statut ? `/actions?statut=${statut}` : '/actions'),
  valider: (compteRenduId: string, brouillons: ActionBrouillon[]) =>
    api.post<Action[]>('/actions/valider', { compteRenduId, actions: brouillons }),
  modifier: (id: string, donnees: Partial<Action>) =>
    api.patch<Action>(`/actions/${id}`, donnees),
  supprimer: (id: string) => api.delete<void>(`/actions/${id}`),
};
