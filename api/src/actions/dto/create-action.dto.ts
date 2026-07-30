import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { Origine, Priorite, Statut } from '../../extraction/domain/action-brouillon';

export class CreateActionDto {
  @IsOptional()
  @IsUUID()
  compteRenduId?: string;

  @IsString()
  @IsNotEmpty({ message: 'La description est obligatoire' })
  @MaxLength(500)
  description!: string;

  @IsOptional()
  @IsString()
  responsable?: string | null;

  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: "L'échéance est invalide" })
  echeance?: Date | null;

  @IsOptional()
  @IsEnum(Priorite)
  priorite?: Priorite;

  @IsOptional()
  @IsEnum(Statut)
  statut?: Statut;

  @IsOptional()
  @IsEnum(Origine)
  origine?: Origine;
}
