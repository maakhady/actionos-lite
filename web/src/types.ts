export type Priorite = 'BASSE' | 'MOYENNE' | 'HAUTE';
export type Statut = 'A_FAIRE' | 'EN_COURS' | 'TERMINE';
export type Origine = 'REGLE' | 'IA' | 'MANUEL';

export interface ActionBrouillon {
  description: string;
  responsable: string | null;
  echeance: string | null;
  priorite: Priorite;
  origine: Origine;
}

export interface Action extends ActionBrouillon {
  id: string;
  compteRenduId: string;
  statut: Statut;
  compteRendu?: { id: string; titre: string };
}

export interface CompteRendu {
  id: string;
  titre: string;
  dateReunion: string;
  texteSource: string;
  actions?: Action[];
  _count?: { actions: number };
}