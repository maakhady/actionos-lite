import { Priorite, Statut } from '../../extraction/domain/action-brouillon';
export declare class CreateActionDto {
    compteRenduId?: string;
    description: string;
    responsable?: string | null;
    echeance?: Date | null;
    priorite?: Priorite;
    statut?: Statut;
}
