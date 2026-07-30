export enum Priorite {
  BASSE = 'BASSE',
  MOYENNE = 'MOYENNE',
  HAUTE = 'HAUTE',
}

export enum Statut {
  A_FAIRE = 'A_FAIRE',
  EN_COURS = 'EN_COURS',
  TERMINE = 'TERMINE',
}

export enum Origine {
  REGLE = 'REGLE',
  IA = 'IA',
  MANUEL = 'MANUEL',
}

export interface ActionBrouillon {
  description: string;
  responsable: string | null;
  echeance: Date | null;
  priorite: Priorite;
  origine: Origine;
}
