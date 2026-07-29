export type Priorite = 'BASSE' | 'MOYENNE' | 'HAUTE';

export interface ActionBrouillon {
  description: string;
  responsable: string | null;
  echeance: Date | null;
  priorite: Priorite;
}
