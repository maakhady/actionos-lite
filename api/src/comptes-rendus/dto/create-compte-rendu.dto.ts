import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateCompteRenduDto {
  @IsString()
  @IsNotEmpty({ message: 'Le titre est obligatoire' })
  @MaxLength(200)
  titre!: string;

  @Type(() => Date)
  @IsDate({ message: 'La date de réunion est invalide' })
  dateReunion!: Date;

  @IsString()
  @IsNotEmpty({ message: 'Le texte du compte rendu est obligatoire' })
  texteSource!: string;
}
