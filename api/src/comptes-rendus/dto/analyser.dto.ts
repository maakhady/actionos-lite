import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class AnalyserDto {
  @IsString()
  @IsNotEmpty({ message: 'Le texte à analyser est obligatoire' })
  texteSource!: string;

  @Type(() => Date)
  @IsDate({ message: 'La date de réunion est invalide' })
  dateReunion!: Date;
}
