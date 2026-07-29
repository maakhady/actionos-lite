import { IsEnum, IsOptional } from 'class-validator';
import { Statut } from '../../extraction/domain/action-brouillon';

export class FiltrerActionsDto {
  @IsOptional()
  @IsEnum(Statut)
  statut?: Statut;
}
